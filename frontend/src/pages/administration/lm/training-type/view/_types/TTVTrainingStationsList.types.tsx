import { TableColumn } from "react-data-table-component";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Button } from "@/components/ui/Button/Button";
import { TbTrash } from "react-icons/tb";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { Dispatch, useState } from "react";
import ToastHelper from "@/utils/helper/ToastHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";

function getColumns(
    trainingType?: TrainingTypeModel,
    setTrainingType?: Dispatch<TrainingTypeModel>
): (TableColumn<TrainingStationModel> & { searchable?: boolean })[] {
    const [removing, setRemoving] = useState<boolean>(false);

    function removeStation(id: number) {
        if (trainingType == null || setTrainingType == null) return;
        setRemoving(true);

        const formData = new FormData();
        FormHelper.set(formData, "training_type_id", trainingType.id);
        FormHelper.set(formData, "training_station_id", id);

        axiosInstance
            .delete("/administration/training-type/station", {
                data: formData,
            })
            .then(() => {
                if (trainingType.training_stations == null) {
                    return;
                }

                const newStations = trainingType.training_stations.filter(t => {
                    return t.id != id;
                });

                setTrainingType({ ...trainingType, training_stations: newStations });
                ToastHelper.success("Trainingsstation erfolgreich entfernt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Entfernen der Trainingsstation");
            })
            .finally(() => setRemoving(false));
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
                            loading={removing}
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
