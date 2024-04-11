import { CourseModel } from "@/models/CourseModel";
import { useNavigate } from "react-router-dom";
import { Table } from "@/components/ui/Table/Table";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import React from "react";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import UVTypes from "@/pages/administration/mentor/users/view/_types/UV.types";

export function UVCoursesPartial({ courses, user_id }: { courses: CourseModel[] | undefined; user_id: string }) {
    const navigate = useNavigate();

    return (
        <Card
            header={"Kurse"}
            className={"mt-7"}
            headerBorder
            headerExtra={
                <Button size={SIZE_OPTS.XS} variant={"twoTone"} color={COLOR_OPTS.PRIMARY} icon={<TbPlus size={20} />}>
                    In Kurs Einschreiben
                </Button>
            }>
            <Table columns={UVTypes.getCoursesTableColumns(navigate, user_id)} paginate defaultSortField={1} data={courses ?? []} />
        </Card>
    );
}
