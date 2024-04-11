import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import React, { FormEvent, useRef, useState } from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { Separator } from "@/components/ui/Separator/Separator";
import { Input } from "@/components/ui/Input/Input";
import { TbActivity, TbFilePlus, TbId, TbLock, TbTemplate } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import FormHelper from "../../../../../utils/helper/FormHelper";
import { Alert } from "@/components/ui/Alert/Alert";
import { CCreateViewSkeleton } from "../_skeletons/CCreateView.skeleton";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import { CommonRegexp } from "@/core/Config";
import { Select } from "@/components/ui/Select/Select";
import useApi from "@/utils/hooks/useApi";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { MapArray } from "@/components/conditionals/MapArray";
import StringHelper from "@/utils/helper/StringHelper";
import { MentorGroupModel } from "@/models/MentorGroupModel";
import ToastHelper from "@/utils/helper/ToastHelper";
import axios, { AxiosResponse } from "axios";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { CourseModel } from "@/models/CourseModel";

export function CourseCreateView() {
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { data: mentorGroups, loading: loadingMentorGroups } = useApi<MentorGroupModel[]>({
        url: "/user-info/mentor-group/cm",
        method: "get",
    });

    const { data: trainingTypes, loading: loadingTrainingTypes } = useApi<TrainingTypeModel[]>({
        url: "/administration/training-type",
        method: "get",
    });

    function handleFormSubmission(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = FormHelper.getEntries(e.target);
        FormHelper.setBool(formData, "active", formData.get("active") == "1");
        FormHelper.setBool(formData, "self_enrol_enabled", formData.get("self_enrol_enabled") == "1");

        axiosInstance
            .post("/administration/course", formData)
            .then((res: AxiosResponse) => {
                const course = res.data as CourseModel;
                navigate(`/administration/course/${course.uuid}`);
                ToastHelper.success(`Kurs erfolgreich erstellt`);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen des Kurses");
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <>
            <PageHeader title={"Kurs Erstellen"} />

            <RenderIf
                truthValue={loadingMentorGroups || loadingTrainingTypes}
                elementTrue={<CCreateViewSkeleton />}
                elementFalse={
                    <RenderIf
                        truthValue={mentorGroups != null && mentorGroups.length == 0}
                        elementTrue={
                            <Alert className={"mb-4"} type={TYPE_OPTS.DANGER} showIcon rounded>
                                Du hast in keiner Mentorengruppe die Rechte Kurse zu verwalten oder anzulegen.
                            </Alert>
                        }
                        elementFalse={
                            <Card>
                                <form onSubmit={handleFormSubmission}>
                                    <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                                        <Input
                                            name={"name_de"}
                                            type={"text"}
                                            maxLength={70}
                                            description={"Name des Kurses"}
                                            labelSmall
                                            placeholder={"Frankfurt Tower Einweisung"}
                                            label={"Name"}
                                            required
                                            regex={CommonRegexp.NOT_EMPTY}
                                            regexMatchEmpty
                                            regexCheckInitial
                                            preIcon={<TbId size={20} />}
                                        />
                                        <Input
                                            name={"name_en"}
                                            type={"text"}
                                            maxLength={70}
                                            className={"mt-5 md:mt-0"}
                                            description={"Name des Kurses in Englisch"}
                                            labelSmall
                                            placeholder={"Frankfurt Tower Endorsement"}
                                            label={"Name (EN)"}
                                            required
                                            regex={CommonRegexp.NOT_EMPTY}
                                            regexMatchEmpty
                                            regexCheckInitial
                                            preIcon={<TbId size={20} />}
                                        />
                                    </div>

                                    <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                                        <div className={"mt-5"}>
                                            <TextArea
                                                label={"Beschreibung"}
                                                description={"Beschreibung des Kurses"}
                                                placeholder={"Die Frankfurt Tower Einweisung ist für alle Lotsen..."}
                                                required
                                                regex={CommonRegexp.NOT_EMPTY}
                                                regexMatchEmpty
                                                regexCheckInitial
                                                labelSmall
                                                name={"description_de"}
                                            />
                                        </div>
                                        <div className={"mt-5"}>
                                            <TextArea
                                                label={"Beschreibung (EN)"}
                                                description={"Beschreibung des Kurses auf Englisch"}
                                                placeholder={"The Frankfurt Tower Endorsement is meant for all controllers..."}
                                                required
                                                regex={CommonRegexp.NOT_EMPTY}
                                                regexMatchEmpty
                                                regexCheckInitial
                                                labelSmall
                                                name={"description_en"}
                                            />
                                        </div>
                                    </div>

                                    <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                                        <Select
                                            description={
                                                "Wenn der Kurs aktiv ist, wird dieser in der Kurssuche angezeigt. Mentoren sind nur im aktiven Zustand in der Lage Mitglieder in Kursen hinzuzufügen - sofern dies nicht durch die Selbsteinschreibung geregelt ist."
                                            }
                                            label={"Kurs Aktiv"}
                                            className={"mt-5 flex flex-col"}
                                            labelSmall
                                            required
                                            name={"active"}
                                            preIcon={<TbActivity size={20} />}>
                                            <option value={1}>Ja</option>
                                            <option value={0}>Nein</option>
                                        </Select>

                                        <Select
                                            description={
                                                "Wenn die Selbsteinschreibung aktiviert ist, können sich Mitglieder selber in diesen Kurs einschreiben. Falls nicht, geschieht dies über Mentoren oder das ATD."
                                            }
                                            label={"Selbsteinschreibung Aktiv"}
                                            className={"mt-5 flex flex-col"}
                                            selectClassName={"mt-auto"}
                                            labelSmall
                                            required
                                            name={"self_enrol_enabled"}
                                            preIcon={<TbLock size={20} />}>
                                            <option value={1}>Ja</option>
                                            <option value={0}>Nein</option>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <Select
                                        label={"Initiales Training"}
                                        labelSmall
                                        name={"training_type_id"}
                                        description={"Dies ist das erste Training, welches jedem Mitglied des Kurses zugewiesen wird."}
                                        required
                                        preIcon={<TbTemplate size={20} />}
                                        defaultValue={"-1"}>
                                        <option value={"-1"} disabled>
                                            Initiales Training Auswählen
                                        </option>
                                        <MapArray
                                            data={trainingTypes ?? []}
                                            mapFunction={(trainingType: TrainingTypeModel, index: number) => {
                                                return (
                                                    <option key={index} value={trainingType.id.toString()}>
                                                        {trainingType.name} ({StringHelper.capitalize(trainingType.type)})
                                                    </option>
                                                );
                                            }}
                                        />
                                    </Select>

                                    <Separator />

                                    <Select
                                        label={"Mentorengruppe"}
                                        labelSmall
                                        className={"mt-5"}
                                        name={"mentor_group_id"}
                                        description={
                                            "Jeder Kurs muss einer Mentorengruppe zugewiesen werden. Die Administratoren dieser Mentorgruppe sind in der Lage den Kurs zu bearbeiten, oder neue in diese Gruppe hinzuzufügen. " +
                                            "Falls mehrere Mentorengruppen sich diesen Kurs teilen, wähle zunächst eine Mentorgruppe aus, die diesen Kurs mentorieren soll und füge anschließend in der Kursübersicht die weiteren " +
                                            "Mentorengruppen hinzu."
                                        }
                                        required
                                        preIcon={<TbTemplate size={20} />}>
                                        <MapArray
                                            data={mentorGroups ?? []}
                                            mapFunction={(mentorGroup: MentorGroupModel, index: number) => {
                                                return (
                                                    <option key={index} value={mentorGroup.id.toString()}>
                                                        {mentorGroup.name}
                                                    </option>
                                                );
                                            }}
                                        />
                                    </Select>

                                    <Separator />

                                    <Button
                                        type={"submit"}
                                        loading={isSubmitting}
                                        icon={<TbFilePlus size={20} />}
                                        variant={"twoTone"}
                                        color={COLOR_OPTS.PRIMARY}>
                                        Kurs Erstellen
                                    </Button>
                                </form>
                            </Card>
                        }
                    />
                }
            />
        </>
    );
}
