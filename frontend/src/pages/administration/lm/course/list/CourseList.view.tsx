import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CourseModel } from "@/models/CourseModel";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Table } from "@/components/ui/Table/Table";
import { TableColumn } from "react-data-table-component";
import { getCourseTableColumns } from "./_types/CL.types";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbPlus } from "react-icons/tb";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import useApi from "@/utils/hooks/useApi";

export function AdminCourseListView() {
    const navigate = useNavigate();

    const { data: courseData, loading } = useApi<CourseModel[]>({
        url: "/administration/course/editable",
        method: "get",
    });

    const columns: (TableColumn<CourseModel> & { searchable?: boolean })[] = getCourseTableColumns(navigate);

    return (
        <>
            <PageHeader title={"Kurse Verwalten"} hideBackLink />

            <Card
                header={
                    <Link to={"create"}>
                        <Button icon={<TbPlus size={14} />} size={SIZE_OPTS.SM} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                            Kurs Erstellen
                        </Button>
                    </Link>
                }
                headerBorder>
                <Table searchable paginate loading={loading} columns={columns} data={courseData ?? []} />
            </Card>
        </>
    );
}
