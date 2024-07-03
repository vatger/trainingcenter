import { CourseModel } from "@/models/CourseModel";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendar, TbCertificate, TbId } from "react-icons/tb";
import { getAtcRatingCombined } from "@common/AtcRatingHelper";
import React from "react";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CCourseInformationSkeleton } from "@/pages/authenticated/course/_skeletons/CCourseInformation.skeleton";
import { CGeneralInformationPartial } from "@/pages/authenticated/course/_partials/CGeneralInformation.partial";

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
                    <CGeneralInformationPartial course={props.course} loading={props.loadingCourse} showDescription />
                </Card>
            }
        />
    );
}
