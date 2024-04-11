import { TableColumn } from "react-data-table-component";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import SortHelper from "@/utils/helper/SortHelper";

type OnRemoveFunction = (stationID: number) => any;

function getColumns(onRemove: OnRemoveFunction, isSubmitting: boolean): (TableColumn<TrainingStationModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Callsign",
            selector: row => row.callsign.toUpperCase(),
            sortable: true,
            sortFunction: (a, b) => SortHelper.sortAtcStation(a.callsign, b.callsign),
        },
        {
            name: "Frequenz",
            selector: row => row.frequency.toFixed(3),
            sortable: true,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => {
                            onRemove(row.id);
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
