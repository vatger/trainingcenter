import { CourseModel } from "@/models/CourseModel";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendar, TbCertificate, TbId } from "react-icons/tb";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import React from "react";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CCourseInformationSkeleton } from "@/pages/authenticated/course/_skeletons/CCourseInformation.skeleton";

type ActiveCourseInformationPartialProps = {
    course?: CourseModel;
    loadingCourse: boolean;
};

export function CCompletedInformationPartial(props: ActiveCourseInformationPartialProps) {
    return (
        <RenderIf
            truthValue={props.loadingCourse}
            elementTrue={<CCourseInformationSkeleton />}
            elementFalse={
                <Card header={"Allgemeine Informationen"} headerBorder headerExtra={<Badge color={COLOR_OPTS.SUCCESS}>Abgeschlossen</Badge>}>
                    <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                        <Input preIcon={<TbId size={20} />} labelSmall label={"Kurs Name"} disabled value={props.course?.name} />
                        <Input
                            preIcon={<TbCalendar size={20} />}
                            label={"Eingeschrieben am"}
                            labelSmall
                            disabled
                            value={dayjs.utc(props.course?.UsersBelongsToCourses?.createdAt).format(Config.DATETIME_FORMAT)}
                        />
                        <Input
                            preIcon={<TbCertificate size={20} />}
                            label={"Rating nach Abschluss"}
                            labelSmall
                            disabled
                            value={getAtcRatingCombined(props.course?.information?.data?.rating_on_complete)}
                        />
                        <Input
                            preIcon={<TbCertificate size={20} />}
                            label={"Endorsement nach Abschluss"}
                            labelSmall
                            disabled
                            value={getAtcRatingCombined(props.course?.information?.data?.rating_on_complete)}
                        />
                    </div>
                </Card>
            }
        />
    );
}
