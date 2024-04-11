import { TableColumn } from "react-data-table-component";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { UserModel } from "@/models/UserModel";
import { Badge } from "@/components/ui/Badge/Badge";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

type OnRemoveFunction = (userID: number) => any;

function getColumns(onRemove: OnRemoveFunction): (TableColumn<UserModel> & { searchable?: boolean })[] {
    return [
        {
            name: "ID",
            selector: row => row.id.toString(),
            sortable: true,
            searchable: true,
        },
        {
            name: "Name",
            selector: row => `${row.first_name} ${row.last_name}`,
            sortable: true,
            searchable: true,
        },
        {
            name: "Solo",
            cell: row => {
                if (row.user_solo != null) {
                    if (dayjs.utc(row.user_solo?.current_solo_start).isAfter(dayjs.utc())) {
                        return (
                            <Badge color={COLOR_OPTS.DANGER}>
                                <>Ab {dayjs.utc(row.user_solo?.current_solo_start).format(Config.DATE_FORMAT)}</>
                            </Badge>
                        );
                    }

                    return (
                        <Badge color={COLOR_OPTS.DANGER}>
                            <>Bis {dayjs.utc(row?.user_solo?.current_solo_end).format(Config.DATE_FORMAT)}</>
                        </Badge>
                    );
                }

                return <Badge color={COLOR_OPTS.PRIMARY}>Nein</Badge>;
            },
        },
        {
            name: "Freigabe Am",
            selector: row => dayjs.utc(row.EndorsementGroupsBelongsToUsers?.createdAt).format(Config.DATE_FORMAT),
            sortable: true,
            searchable: true,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        disabled={row.user_solo != null}
                        onClick={() => {
                            onRemove(row.id);
                        }}
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
