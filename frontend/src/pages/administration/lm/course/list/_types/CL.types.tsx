import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { CourseModel } from "@/models/CourseModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Button } from "@/components/ui/Button/Button";
import { TbEye } from "react-icons/tb";

export function getCourseTableColumns(navigate: NavigateFunction): (TableColumn<CourseModel> & { searchable?: boolean })[] {
    return [
        {
            name: "UUID",
            selector: row => row.uuid,
            omit: true,
            searchable: true,
        },
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
            searchable: true,
        },
        {
            name: "Aktiv",
            cell: row => {
                return row.is_active ? <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge> : <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>;
            },
            sortable: true,
            sortFunction: (a, b) => {
                if (a.is_active && !b.is_active) return -1;
                else if (!a.is_active && b.is_active) return 1;
                else return 0;
            },
        },
        {
            name: "Selbsteinschreibung",
            cell: row => {
                return row.self_enrollment_enabled ? <Badge color={COLOR_OPTS.SUCCESS}>Aktiv</Badge> : <Badge color={COLOR_OPTS.DANGER}>Deaktiviert</Badge>;
            },
            sortable: true,
            sortFunction: (a, b) => {
                if (a.self_enrollment_enabled && !b.self_enrollment_enabled) return -1;
                else if (!a.self_enrollment_enabled && b.self_enrollment_enabled) return 1;
                else return 0;
            },
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`${row.uuid}`)}
                        size={SIZE_OPTS.SM}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbEye size={20} />}>
                        Ansehen
                    </Button>
                );
            },
        },
    ];
}
