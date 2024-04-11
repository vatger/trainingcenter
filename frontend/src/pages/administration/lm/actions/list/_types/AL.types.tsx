import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { ActionRequirementModel } from "@/models/CourseModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Button } from "@/components/ui/Button/Button";
import { TbEye } from "react-icons/tb";

function getActionRequirementTableColumns(navigate: NavigateFunction): (TableColumn<ActionRequirementModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
            searchable: true,
            sortable: true,
        },
        {
            name: "Typ",
            sortable: true,
            sortFunction: (a, b) => {
                if (a.type == b.type) return 0;
                if (a.type == "action" && b.type == "requirement") return -1;
                return 1;
            },
            cell: row => {
                switch (row.type) {
                    case "action":
                        return <Badge color={COLOR_OPTS.PRIMARY}>Aktion</Badge>;
                    case "requirement":
                        return <Badge color={COLOR_OPTS.WARNING}>Bedingung</Badge>;
                }
            },
        },
        {
            name: "Erstellt Am",
            selector: row => dayjs.utc(row.createdAt).format(Config.DATE_FORMAT),
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3"}
                            onClick={() => navigate(`${row.id}`)}
                            size={SIZE_OPTS.SM}
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbEye size={20} />}>
                            Ansehen (TBD)
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export default { getActionRequirementTableColumns };
