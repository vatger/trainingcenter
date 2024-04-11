import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

function getColumns(mentor_group_id: string | undefined): (TableColumn<EndorsementGroupModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
            searchable: true,
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
                        className={"my-3 ml-2"}
                        size={SIZE_OPTS.SM}
                        loading={false}
                        disabled={false}
                        variant={"twoTone"}
                        color={COLOR_OPTS.DANGER}
                        icon={<TbTrash size={20} />}>
                        Löschen (TODO!)
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
