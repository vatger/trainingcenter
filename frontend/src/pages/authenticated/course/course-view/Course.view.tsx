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
import { getAtcRatingLong, getAtcRatingShort } from "@/utils/helper/vatsim/AtcRatingHelper";
import React from "react";
import useApi from "@/utils/hooks/useApi";
import { CourseModel } from "@/models/CourseModel";

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

function getDuration(data: any) {
    if (data == null) return "Keine Angabe";

    const duration = data.estimated_duration?.value;
    const unit = data.estimated_duration?.unit;

    return `${duration} ${unit}`;
}

function getAtcRating(rating: number | undefined): string {
    if (rating == null) return "Keine Angabe";

    const short = getAtcRatingShort(rating);
    const long = getAtcRatingLong(rating);
    return `${long} (${short})`;
}

export function CourseView() {
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

                                <Input labelSmall preIcon={<TbId size={20} />} label={"UUID"} disabled value={course?.uuid} />

                                <Input
                                    labelSmall
                                    preIcon={<TbClock size={20} />}
                                    label={"Ungefähre Dauer"}
                                    disabled
                                    value={getDuration(course?.information?.data)}
                                />

                                <Input
                                    labelSmall
                                    preIcon={<TbCertificate size={20} />}
                                    label={"Rating nach Abschluss"}
                                    disabled
                                    value={getAtcRating(course?.information?.data?.rating_on_complete)}
                                />
                            </div>

                            <TextArea labelSmall disabled label={"Kursbeschreibung"} value={course?.description} />

                            <Button
                                disabled={!course?.self_enrollment_enabled}
                                icon={<TbCheckbox size={20} />}
                                className={"mt-7"}
                                variant={"twoTone"}
                                color={COLOR_OPTS.PRIMARY}
                                onClick={() => navigate("enrol")}>
                                Jetzt Einschreiben
                            </Button>
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
