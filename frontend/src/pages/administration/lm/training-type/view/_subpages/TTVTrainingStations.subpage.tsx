import { TrainingStationModel } from "@/models/TrainingStationModel";
import TrainingTypeViewTrainingStationsListTypes from "../_types/TTVTrainingStationsList.types";
import { Table } from "@/components/ui/Table/Table";
import useApi from "@/utils/hooks/useApi";
import { Select } from "@/components/ui/Select/Select";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { MapArray } from "@/components/conditionals/MapArray";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbPlus } from "react-icons/tb";
import { useState } from "react";
import { Separator } from "@/components/ui/Separator/Separator";
import ToastHelper from "@/utils/helper/ToastHelper";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TTVSkeleton } from "@/pages/administration/lm/training-type/view/_skeletons/TTV.skeleton";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";

export function TTVTrainingStationsSubpage(props: { trainingTypeID?: string }) {
    const [selectedTrainingStation, setSelectedTrainingStation] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const {
        data: trainingType,
        setData: setTrainingType,
        loading: loadingTrainingType,
    } = useApi<TrainingTypeModel>({
        url: `/administration/training-type/${props.trainingTypeID ?? "-1"}`,
        method: "get",
    });

    const { data: trainingStations, loading: loadingTrainingStations } = useApi<TrainingStationModel[]>({
        url: "/administration/training-station",
        method: "get",
    });

    function addTrainingStation() {
        setSubmitting(true);

        const trainingStation = trainingStations?.find(ts => ts.id == Number(selectedTrainingStation));
        if (trainingStation == null || trainingType == null || trainingType.training_stations?.find(t => t.id == trainingStation.id) != null) {
            setSubmitting(false);
            return;
        }

        let newStations = [...(trainingType.training_stations ?? [])];
        newStations.push({ ...trainingStation });

        const formData = new FormData();
        FormHelper.set(formData, "training_type_id", props.trainingTypeID);
        FormHelper.set(formData, "training_station_id", selectedTrainingStation);

        axiosInstance
            .put("/administration/training-type/station", formData)
            .then(() => {
                ToastHelper.success("Trainingsstation erfolgreich hinzugefügt");
                setTrainingType({ ...trainingType, training_stations: newStations });
                setSelectedTrainingStation(undefined);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Hinzufügen der Trainingsstation");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <>
            <RenderIf
                truthValue={loadingTrainingStations || loadingTrainingType}
                elementTrue={<TTVSkeleton />}
                elementFalse={
                    <>
                        <Select
                            label={"Trainingsstation Hinzufügen"}
                            labelSmall
                            value={selectedTrainingStation ?? "-1"}
                            disabled={submitting}
                            onChange={v => {
                                if (v == "-1") {
                                    setSelectedTrainingStation(undefined);
                                    return;
                                }
                                setSelectedTrainingStation(v);
                            }}>
                            <option value={"-1"}>Trainingsstation Auswählen</option>

                            <MapArray
                                data={trainingStations?.filter(ts => !trainingType?.training_stations?.find(t => t.id == ts.id)) ?? []}
                                mapFunction={(trainingType: TrainingStationModel, index) => {
                                    return (
                                        <option key={index} value={trainingType.id}>
                                            {trainingType.callsign.toUpperCase()} ({trainingType.frequency.toFixed(3)})
                                        </option>
                                    );
                                }}
                            />
                        </Select>

                        <Button
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            disabled={selectedTrainingStation == null || selectedTrainingStation == "-1"}
                            className={"mt-3"}
                            icon={<TbPlus size={20} />}
                            loading={submitting}
                            size={SIZE_OPTS.SM}
                            onClick={() => {
                                addTrainingStation();
                            }}>
                            Hinzufügen
                        </Button>
                    </>
                }
            />

            <Separator />

            <Table
                paginate
                columns={TrainingTypeViewTrainingStationsListTypes.getColumns(trainingType, setTrainingType)}
                data={trainingType?.training_stations ?? []}
                loading={loadingTrainingType}
            />
        </>
    );
}
