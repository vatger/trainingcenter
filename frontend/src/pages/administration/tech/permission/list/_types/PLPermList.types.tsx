import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";
import { PermissionModel } from "@/models/PermissionModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

export function getPermissionTableColumns(navigate: NavigateFunction): TableColumn<PermissionModel>[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
        },
        {
            name: "Erstellt am",
            selector: row => dayjs.utc(row.createdAt).format(Config.DATETIME_FORMAT),
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
