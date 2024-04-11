import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";

function getColumns(navigate: NavigateFunction): (TableColumn<EndorsementGroupModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
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
                            Ansehen
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
