import { RenderIf } from "@/components/conditionals/RenderIf";
import { CCourseInformationSkeleton } from "@/pages/authenticated/course/_skeletons/CCourseInformation.skeleton";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendar, TbCertificate, TbClock, TbId } from "react-icons/tb";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import React from "react";
import { CourseInformationModel, CourseModel } from "@/models/CourseModel";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import { TLanguage, useSettingsSelector } from "@/app/features/settingsSlice";

function getDuration(info?: CourseInformationModel) {
    const language: TLanguage = useSettingsSelector().language;

    if (!info) {
        return "N/A";
    }

    let dur = dayjs.duration(info.data.duration, info.data.duration_unit).locale(language);
    return dur.humanize();
}

export function CGeneralInformationPartial({
    loading,
    course,
    showDescription = false,
    showDuration = false,
    showEnrolDate = true
}: {
    loading: boolean;
    course?: CourseModel;
    showDescription?: boolean;
    showDuration?: boolean;
    showEnrolDate?: boolean;
}) {
    return (
        <RenderIf
            truthValue={loading}
            elementTrue={<CCourseInformationSkeleton />}
            elementFalse={
                <>
                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                        <Input preIcon={<TbId size={20} />} labelSmall label={"Kurs Name"} disabled value={course?.name} />
                        <RenderIf
                            truthValue={showEnrolDate}
                            elementTrue={
                                <Input
                                    preIcon={<TbCalendar size={20} />}
                                    label={"Eingeschrieben am"}
                                    labelSmall
                                    disabled
                                    value={dayjs.utc(course?.UsersBelongsToCourses?.createdAt).format(Config.DATETIME_FORMAT)}
                                />
                            }
                        />
                        <Input
                            preIcon={<TbCertificate size={20} />}
                            label={"Rating nach Abschluss"}
                            labelSmall
                            disabled
                            value={course?.information?.data.rating ? getAtcRatingCombined(course?.information?.data?.rating) : "Keine Angabe"}
                        />
                        <Input
                            preIcon={<TbCertificate size={20} />}
                            label={"Endorsement nach Abschluss"}
                            labelSmall
                            disabled
                            value={course?.endorsement?.name ?? "Keine Angabe"}
                        />
                        <RenderIf
                            truthValue={showDuration}
                            elementTrue={
                                <Input
                                    preIcon={<TbClock size={20} />}
                                    label={"Ungefähre Dauer"}
                                    description={
                                        "Hierbei handelt es sich um einen Richtwert. Je nach Verfügbarkeit, Motivation, usw. kann die eigentliche Dauer von diesem Wert abweichen."
                                    }
                                    labelSmall
                                    disabled
                                    value={getDuration(course?.information)}
                                />
                            }
                        />
                    </div>

                    <RenderIf
                        truthValue={showDescription}
                        elementTrue={<TextArea labelSmall className={"mt-5"} disabled label={"Kursbeschreibung"} value={course?.description} />}
                    />
                </>
            }
        />
    );
}
