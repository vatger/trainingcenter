import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CourseViewSkeleton } from "@/pages/authenticated/course/course-view/_skeletons/CourseView.skeleton";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { TbCertificate, TbCheckbox, TbClock, TbId } from "react-icons/tb";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import React from "react";
import useApi from "@/utils/hooks/useApi";
import { CourseModel } from "@/models/CourseModel";
import { ICourseInformationData, ICourseInformationDurationUnits } from "@models/CourseInformation";
import genericTranslation from "@/assets/lang/generic.translation";
import { TLanguage, useSettingsSelector } from "@/app/features/settingsSlice";
import { ButtonRow } from "@/components/ui/Button/ButtonRow";

function getTypeString(type: "online" | "sim" | "cpt" | "lesson") {
    switch (type) {
        case "lesson":
            return "Gruppenstunde (Lesson)";

        case "sim":
            return "Sim-Session";

        case "cpt":
            return "Controller Practical Test (CPT)";

        case "online":
            return "Online-Session";
    }
}

function getDuration(data: ICourseInformationData, language: TLanguage) {
    if (data == null || data.duration == null) return "Keine Angabe";

    const duration = data.duration;
    const unit = data?.duration_unit;

    return `${duration} ${genericTranslation.durations[unit ?? "day"][language]}`;
}

function getEndorsement(data?: ICourseInformationData) {
    if (data?.endorsement_id == null) return "Keine Angabe";

    return `${data.endorsement_id} (TODO: Name)`;
}

export function CourseView() {
    const language = useSettingsSelector().language;
    const navigate = useNavigate();
    const { uuid } = useParams();

    const { data: course, loading } = useApi<CourseModel>({
        url: "/course/info",
        params: { uuid: uuid },
        method: "get",
    });

    return (
        <>
            <PageHeader title={course?.name ?? "Lade Kursübersicht"} />

            <RenderIf
                truthValue={loading}
                elementTrue={<CourseViewSkeleton />}
                elementFalse={
                    <>
                        <Card header={"Allgemeine Informationen"} headerBorder headerExtra={<Badge color={COLOR_OPTS.DANGER}>Nicht eingeschrieben</Badge>}>
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"}>
                                <Input labelSmall preIcon={<TbId size={20} />} label={"Name"} disabled value={course?.name} />

                                <Input
                                    labelSmall
                                    preIcon={<TbClock size={20} />}
                                    label={"Ungefähre Dauer"}
                                    disabled
                                    value={getDuration(course?.information?.data, language)}
                                />

                                <Input
                                    labelSmall
                                    preIcon={<TbCertificate size={20} />}
                                    label={"Rating nach Abschluss"}
                                    disabled
                                    value={getAtcRatingCombined(course?.information?.data?.rating)}
                                />

                                <Input
                                    labelSmall
                                    preIcon={<TbCertificate size={20} />}
                                    label={"Endorsement nach Abschluss (TODO)"}
                                    disabled
                                    value={getEndorsement(course?.information?.data)}
                                />
                            </div>

                            <TextArea labelSmall disabled label={"Kursbeschreibung"} value={course?.description} />

                            <ButtonRow>
                                <RenderIf
                                    truthValue={course?.self_enrollment_enabled == true}
                                    elementTrue={
                                        <Button
                                            icon={<TbCheckbox size={20} />}
                                            className={"mt-7"}
                                            variant={"twoTone"}
                                            color={COLOR_OPTS.PRIMARY}
                                            onClick={() => navigate("enrol")}>
                                            Jetzt Einschreiben
                                        </Button>
                                    }
                                />
                            </ButtonRow>

                            <RenderIf
                                truthValue={!course?.self_enrollment_enabled}
                                elementTrue={
                                    <p className={"mt-2"}>
                                        Die Selbsteinschreibung ist derzeit nicht aktiv. Kontaktiere einen Mentor um dich in den Kurs einschreiben zu lassen.
                                    </p>
                                }
                            />
                        </Card>

                        <Card header={"Erstes Training"} className={"mt-7"} headerBorder>
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                                <Input labelSmall preIcon={<TbId size={20} />} label={"Name"} disabled value={course?.training_type?.name} />

                                <Input
                                    labelSmall
                                    preIcon={<TbId size={20} />}
                                    label={"Typ"}
                                    disabled
                                    value={getTypeString(course?.training_type?.type ?? "online")}
                                />
                            </div>
                        </Card>
                    </>
                }
            />
        </>
    );
}
