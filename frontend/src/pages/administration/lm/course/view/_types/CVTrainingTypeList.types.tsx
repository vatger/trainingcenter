import { TableColumn } from "react-data-table-component";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

type OnDeleteFunction = (trainingTypeID: number) => any;

function getColumns(isSubmitting: boolean, onDelete: OnDeleteFunction): (TableColumn<TrainingTypeModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
        },
        {
            name: "Hinzugefügt Am",
            selector: row => dayjs.utc(row.createdAt).format(Config.DATE_FORMAT),
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => {
                            onDelete(row.id);
                        }}
                        disabled={isSubmitting}
                        size={SIZE_OPTS.SM}
                        variant={"twoTone"}
                        color={COLOR_OPTS.DANGER}
                        icon={<TbTrash size={20} />}>
                        Löschen
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
