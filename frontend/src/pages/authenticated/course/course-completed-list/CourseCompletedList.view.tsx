import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import useApi from "@/utils/hooks/useApi";
import { CourseModel } from "@/models/CourseModel";
import CCLListTypes from "@/pages/authenticated/course/course-completed-list/_types/CCLList.types";

export function CourseCompletedListView() {
    const { data, loading } = useApi<CourseModel[]>({
        url: "/course/completed",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Abgeschlossene Kurse"} hideBackLink />

            <Card>
                <Table columns={CCLListTypes.getColumns()} data={data ?? []} loading={loading} />
            </Card>
        </>
    );
}
