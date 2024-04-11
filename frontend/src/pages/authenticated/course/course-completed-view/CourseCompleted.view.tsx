import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { CCompletedInformationPartial } from "@/pages/authenticated/course/course-completed-view/_partials/CCompletedInformation.partial";
import useApi from "@/utils/hooks/useApi";
import { CourseModel } from "@/models/CourseModel";
import { useParams } from "react-router-dom";
import { CTrainingHistoryPartial } from "@/pages/authenticated/course/_partials/CTrainingHistory.partial";
import { UserTrainingSessionModel } from "@/models/TrainingSessionModel";

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

            <CCompletedInformationPartial course={course} loadingCourse={loading} />

            <CTrainingHistoryPartial trainingData={trainingData ?? []} loading={loading} />
        </>
    );
}
