import { TableColumn } from "react-data-table-component";
import { TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye, TbTrash } from "react-icons/tb";
import { NavigateFunction } from "react-router-dom";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

function getColumns(navigate: NavigateFunction): (TableColumn<TrainingLogTemplateModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
            searchable: true,
        },
        {
            name: "Erstellt Am",
            selector: row => dayjs.utc(row.createdAt).format(Config.DATETIME_FORMAT),
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
