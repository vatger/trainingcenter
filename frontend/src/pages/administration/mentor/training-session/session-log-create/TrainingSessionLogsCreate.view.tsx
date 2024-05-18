import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { LogTemplateElement } from "@/models/TrainingLogTemplateModel";
import { MapArray } from "@/components/conditionals/MapArray";
import { Card } from "@/components/ui/Card/Card";
import { UserModel } from "@/models/UserModel";
import { TSLCLogTemplateElementPartial } from "@/pages/administration/mentor/training-session/session-log-create/_partials/TSLCLogTemplateElement.partial";
import useApi from "@/utils/hooks/useApi";
import { TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import { generateUUID } from "@/utils/helper/UUIDHelper";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { TbPlus } from "react-icons/tb";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Select } from "@/components/ui/Select/Select";
import StringHelper from "@/utils/helper/StringHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

export type ParticipantStatus = {
    user_id: number;
    user_log: LogTemplateElement[];
    passed: boolean;
    log_public: boolean;
    next_training_id?: number;
    course_completed: boolean;
    _uuid: string; // This is used internally only!
};

export function TrainingSessionLogsCreateView() {
    const { uuid } = useParams();
    const navigate = useNavigate();

    const [logTemplateElements, setLogTemplateElements] = useState<LogTemplateElement[]>([]);
    const [participantValues, setParticipantValues] = useState<ParticipantStatus[]>([]);

    const [submitting, setSubmitting] = useState<boolean>(false);

    const { data: participants, loading: loadingParticipants } = useApi<UserModel[]>({
        url: `/administration/training-session/participants/${uuid}`,
        method: "get",
        onLoad: participants => {
            if (participants == null) return;

            let arr: ParticipantStatus[] = [];
            for (const participant of participants) {
                arr.push({
                    user_id: participant.id,
                    user_log: [],
                    passed: true,
                    log_public: true,
                    next_training_id: undefined,
                    course_completed: false,
                    _uuid: generateUUID(),
                });
            }

            setParticipantValues([...arr]);
        },
    });

    const { loading: loadingLogTemplate } = useApi<TrainingLogTemplateModel>({
        url: `/administration/training-session/log-template/${uuid}`,
        method: "get",
        onLoad: logTemplate => {
            let logTemplates = logTemplate.content as LogTemplateElement[];
            if (logTemplates == null) return;
            setLogTemplateElements(logTemplates);
        },
        onError: () => {
            setLogTemplateElements([{ type: "textarea", title: "Bewertung" }]);
        },
    });

    const { data: courseTrainingTypes, loading: loadingCourseTrainingTypes } = useApi<TrainingTypeModel[]>({
        url: `/administration/training-session/training-types/${uuid}`,
        method: "get",
    });

    useEffect(() => {
        // Make sure that both of these are false! (i.e. have loaded)
        // We now need to append to the participantStatus array...
        if (loadingParticipants || loadingLogTemplate || participantValues.length == 0 || logTemplateElements.length == 0) return;

        let newStatus = [...participantValues];
        for (const s of newStatus) {
            s.user_log?.push(...logTemplateElements);
        }

        setParticipantValues(newStatus);
    }, [loadingParticipants, loadingLogTemplate]);

    function submitTrainingLogs() {
        axiosInstance
            .post(`/administration/training-session/log/${uuid}`, participantValues)
            .then(() => {
                ToastHelper.success("Logs erfolgreich angelegt");
                navigate("/administration/training-request/planned");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen der Logs");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <>
            <PageHeader title={"Logs Erstellen"} />

            <RenderIf
                truthValue={!loadingParticipants && !loadingLogTemplate && participantValues != null}
                elementTrue={
                    <MapArray
                        data={participantValues ?? []}
                        mapFunction={(v: ParticipantStatus, index: number) => {
                            const user = participants?.find(p => p.id == v.user_id);

                            return (
                                <Card
                                    key={index}
                                    className={index > 0 ? "mt-5" : ""}
                                    header={`${user?.first_name} ${user?.last_name} (${user?.id})`}
                                    headerBorder>
                                    <TSLCLogTemplateElementPartial
                                        participantStatus={v}
                                        participantStatusList={participantValues}
                                        setParticipantValues={setParticipantValues}
                                    />

                                    <div className={"flex flex-col mt-5"}>
                                        <Checkbox
                                            checked
                                            onChange={e => {
                                                const p = [...participantValues];
                                                p[index].passed = e;
                                                setParticipantValues(p);
                                            }}>
                                            Bestanden
                                        </Checkbox>

                                        <Checkbox
                                            className={"mt-3"}
                                            checked
                                            onChange={e => {
                                                const p = [...participantValues];
                                                p[index].log_public = e;
                                                setParticipantValues(p);
                                            }}>
                                            Log Öffentlich - Für den Trainee sichtbar
                                        </Checkbox>

                                        <Checkbox
                                            className={"mt-3"}
                                            checked={false}
                                            onChange={e => {
                                                const p = [...participantValues];
                                                p[index].course_completed = e;
                                                setParticipantValues(p);
                                            }}>
                                            Kurs Abgeschlossen - Markiert den Kurs als abgeschlossen und ignoriert die Auswahl des nächsten Trainings
                                        </Checkbox>

                                        <Select
                                            label={"Nächstes Training"}
                                            labelSmall
                                            inputError={!v.course_completed && v.next_training_id == undefined}
                                            disabled={v.course_completed}
                                            className={"mt-3"}
                                            defaultValue={"none"}
                                            onChange={e => {
                                                let num: number | undefined = Number(e);
                                                if (isNaN(num)) {
                                                    num = undefined;
                                                }

                                                let p = [...participantValues];
                                                p[index].next_training_id = num;
                                                setParticipantValues(p);
                                            }}>
                                            <option value={"none"} disabled>
                                                Nächstes Training Auswählen
                                            </option>
                                            <MapArray
                                                data={courseTrainingTypes ?? []}
                                                mapFunction={(t: TrainingTypeModel, index: number) => {
                                                    return (
                                                        <option key={index} value={t.id}>
                                                            {t.name} ({StringHelper.capitalize(t.type)})
                                                        </option>
                                                    );
                                                }}
                                            />
                                        </Select>
                                    </div>
                                </Card>
                            );
                        }}
                    />
                }
            />

            <RenderIf
                truthValue={participants != null && participants?.length > 0}
                elementTrue={
                    <Card className={"mt-5"} header={"Abschließen"} headerBorder>
                        <Button color={COLOR_OPTS.PRIMARY} variant={"twoTone"} icon={<TbPlus size={20} />} onClick={submitTrainingLogs} loading={submitting}>
                            Logs Erstellen
                        </Button>
                    </Card>
                }
            />
        </>
    );
}
