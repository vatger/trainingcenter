import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { CCompletedInformationPartial } from "@/pages/authenticated/course/course-completed-view/_partials/CCompletedInformation.partial";
import useApi from "@/utils/hooks/useApi";
import { CourseModel } from "@/models/CourseModel";
import { useParams } from "react-router-dom";
import { CTrainingHistoryPartial } from "@/pages/authenticated/course/_partials/CTrainingHistory.partial";
import { UserTrainingSessionModel } from "@/models/TrainingSessionModel";
import { CGeneralInformationPartial } from "@/pages/authenticated/course/_partials/CGeneralInformation.partial";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import React from "react";
import { Card } from "@/components/ui/Card/Card";

export function CourseCompletedView() {
    const { uuid } = useParams();

    const {
        data: course,
        loading: loadingCourse,
        loadingError: loadingCourseError,
    } = useApi<CourseModel>({
        url: "/course/info/my",
        method: "get",
        params: {
            uuid: uuid,
        },
    });

    const {
        data: trainingData,
        loading: loadingTrainingData,
        loadingError: loadingTrainingDataError,
    } = useApi<UserTrainingSessionModel[]>({
        url: "/course/info/training",
        method: "get",
        params: {
            uuid: uuid,
        },
    });

    const loading = loadingCourse || loadingTrainingData;

    return (
        <>
            <PageHeader title={"Kurs Ansehen"} />

            <Card header={"Allgemeine Informationen"} headerBorder headerExtra={<Badge color={COLOR_OPTS.SUCCESS}>Abgeschlossen</Badge>}>
                <CGeneralInformationPartial course={course} loading={loading} />
            </Card>

            <CTrainingHistoryPartial trainingData={trainingData ?? []} loading={loading} />
        </>
    );
}
