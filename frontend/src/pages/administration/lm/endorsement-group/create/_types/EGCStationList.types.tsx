import { TrainingStationModel } from "@/models/TrainingStationModel";
import { Dispatch } from "react";
import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbTrash } from "react-icons/tb";

function getColumns(
    trainingStations: number[],
    setTrainingStations: Dispatch<number[]>
): (TableColumn<TrainingStationModel> & {
    searchable?: boolean;
})[] {
    function removeStation(id: number) {
        setTrainingStations(trainingStations.filter(t => t != id));
    }

    return [
        {
            name: "Station",
            selector: row => row.callsign.toUpperCase(),
            sortable: true,
            searchable: true,
        },
        {
            name: "Frequenz",
            selector: row => row.frequency.toFixed(3).toString(),
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3 ml-2"}
                            onClick={() => removeStation(row.id)}
                            size={SIZE_OPTS.SM}
                            variant={"twoTone"}
                            color={COLOR_OPTS.DANGER}
                            icon={<TbTrash size={20} />}></Button>
                    </div>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
