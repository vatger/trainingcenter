import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";
import { NavigateFunction } from "react-router-dom";
import { JoblogModel } from "@/models/JoblogModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Badge } from "@/components/ui/Badge/Badge";

function getColumns(navigate: NavigateFunction): TableColumn<JoblogModel>[] {
    return [
        {
            name: "Typ",
            selector: row => row.job_type,
        },
        {
            name: "Versuche",
            selector: row => row.attempts,
            sortable: true,
        },
        {
            name: "Erstellt",
            selector: row => dayjs.utc(row.createdAt).format(Config.DATETIME_FORMAT),
            sortable: true,
        },
        {
            name: "Status",
            cell: row => {
                switch (row.status) {
                    case "queued":
                        return <Badge color={COLOR_OPTS.PRIMARY}>Queued</Badge>;

                    case "completed":
                        return <Badge color={COLOR_OPTS.SUCCESS}>Completed</Badge>;

                    case "failed":
                        return <Badge color={COLOR_OPTS.DANGER}>Failed</Badge>;

                    default:
                        return <Badge color={COLOR_OPTS.DEFAULT}>Unknown</Badge>;
                }
            },
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`${row.id}`)}
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

export default {
    getColumns,
};
