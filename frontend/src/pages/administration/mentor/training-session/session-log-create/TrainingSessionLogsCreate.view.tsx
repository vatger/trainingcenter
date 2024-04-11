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
import TrainingSessionService from "@/pages/administration/mentor/training-session/session-log-create/_services/TrainingSessionService";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Select } from "@/components/ui/Select/Select";
import StringHelper from "@/utils/helper/StringHelper";

export type ParticipantStatus = {
    user_id: number;
    stringValues: Map<string, string>;
    progressValues: Map<string, number>;
    passed: boolean;
    visible: boolean;
    nextTraining?: number;
    course_completed: boolean;
};

export function TrainingSessionLogsCreateView() {
    const { uuid } = useParams();
    const navigate = useNavigate();

    const [logTemplateElements, setLogTemplateElements] = useState<(LogTemplateElement & { uuid: string })[]>([]);
    const [participantValues, setParticipantValues] = useState<ParticipantStatus[] | undefined>(undefined);

    const [completedIds, setCompletedIds] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const { data: participants, loading: loadingParticipants } = useApi<UserModel[]>({
        url: `/administration/training-session/participants/${uuid}`,
        method: "get",
        onLoad: participants => {
            if (participants == null) return;

            let arr: ParticipantStatus[] = [];
            for (let i = 0; i < participants?.length; i++) {
                arr.push({
                    user_id: participants[i].id,
                    stringValues: new Map<string, string>(),
                    progressValues: new Map<string, number>(),
                    passed: true,
                    visible: true,
                    nextTraining: undefined,
                    course_completed: false,
                });
            }

            setParticipantValues(arr);
        },
    });

    const { loading: loadingLogTemplate } = useApi<TrainingLogTemplateModel>({
        url: `/administration/training-session/log-template/${uuid}`,
        method: "get",
        onLoad: logTemplate => {
            let logTemplates = logTemplate.content as LogTemplateElement[];
            if (logTemplates == null) return;

            const logTemplatesWithUUID = logTemplates.map(logTempElement => ({ ...logTempElement, uuid: generateUUID() }));

            setLogTemplateElements(logTemplatesWithUUID);
            return;
        },
        onError: () => {
            setLogTemplateElements([{ uuid: generateUUID(), type: "textarea", title: "Bewertung" }]);
        },
    });

    const { data: courseTrainingTypes, loading: loadingCourseTrainingTypes } = useApi<TrainingTypeModel[]>({
        url: `/administration/training-session/training-types/${uuid}`,
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Logs Erstellen"} />

            <RenderIf
                truthValue={!loadingParticipants && !loadingLogTemplate && participantValues != null}
                elementTrue={
                    <MapArray
                        data={participants ?? []}
                        mapFunction={(user: UserModel, index) => {
                            return (
                                <Card key={index} className={index > 0 ? "mt-5" : ""} header={`${user.first_name} ${user.last_name} (${user.id})`} headerBorder>
                                    <MapArray
                                        data={logTemplateElements ?? []}
                                        mapFunction={(v, i) => {
                                            return (
                                                <TSLCLogTemplateElementPartial
                                                    element={v}
                                                    index={i}
                                                    key={i}
                                                    stringValues={participantValues![index].stringValues}
                                                    progressValues={participantValues![index].progressValues}
                                                />
                                            );
                                        }}
                                    />

                                    <div className={"flex flex-col mt-5"}>
                                        <Checkbox
                                            checked
                                            onChange={e => {
                                                const p = [...participantValues!];
                                                p[index].passed = e;
                                                setParticipantValues(p);
                                            }}>
                                            Bestanden
                                        </Checkbox>

                                        <Checkbox
                                            className={"mt-3"}
                                            checked
                                            onChange={e => {
                                                const p = [...participantValues!];
                                                p[index].visible = e;
                                                setParticipantValues(p);
                                            }}>
                                            Log Öffentlich - Für den Trainee sichtbar
                                        </Checkbox>

                                        <Checkbox
                                            className={"mt-3"}
                                            checked={false}
                                            onChange={e => {
                                                const p = [...participantValues!];
                                                p[index].course_completed = e;
                                                setParticipantValues(p);

                                                if (e) {
                                                    setCompletedIds([...completedIds, index]);
                                                } else {
                                                    setCompletedIds(completedIds.filter(c => c != index));
                                                }
                                            }}>
                                            Kurs Abgeschlossen - Markiert den Kurs als abgeschlossen und ignoriert die Auswahl des nächsten Trainings
                                        </Checkbox>

                                        <Select
                                            label={"Nächstes Training"}
                                            labelSmall
                                            inputError={!completedIds.includes(index) && participantValues![index].nextTraining == undefined}
                                            disabled={completedIds.includes(index)}
                                            className={"mt-3"}
                                            defaultValue={"none"}
                                            onChange={e => {
                                                let num: number | undefined = Number(e);
                                                if (isNaN(num)) {
                                                    num = undefined;
                                                }

                                                let p = [...participantValues!];
                                                p[index].nextTraining = num;
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
                        <Button
                            color={COLOR_OPTS.PRIMARY}
                            variant={"twoTone"}
                            icon={<TbPlus size={20} />}
                            onClick={() => {
                                TrainingSessionService.SubmitTrainingLogs({
                                    uuid: uuid ?? "-1",
                                    participants: participants,
                                    setSubmitting: setSubmitting,
                                    navigate: navigate,
                                    logTemplateElements: logTemplateElements,
                                    participantValues: participantValues,
                                });
                            }}
                            loading={submitting}>
                            Logs Erstellen
                        </Button>
                    </Card>
                }
            />
        </>
    );
}
