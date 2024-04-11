import useApi from "@/utils/hooks/useApi";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { useParams } from "react-router-dom";
import { Table } from "@/components/ui/Table/Table";
import EGVStationsTypes from "@/pages/administration/lm/endorsement-group/view/_types/EGVStations.types";
import React, { useState } from "react";
import { MapArray } from "@/components/conditionals/MapArray";
import { Select } from "@/components/ui/Select/Select";
import { Separator } from "@/components/ui/Separator/Separator";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbPlus } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { useFilter } from "@/utils/hooks/useFilter";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { Input } from "@/components/ui/Input/Input";

function filterStations(element: TrainingStationModel, searchValue: string) {
    return element.callsign.startsWith(searchValue.toUpperCase());
}

export function EGVStationsSubpage() {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedTrainingStation, setSelectedTrainingStation] = useState<string | undefined>(undefined);

    const {
        loading: loadingEndorsementGroupStations,
        data: endorsementGroupStations,
        setData: setEndorsementGroupStations,
    } = useApi<TrainingStationModel[]>({
        url: `/administration/endorsement-group/${id}/stations`,
        method: "get",
    });

    const { loading: loadingStations, data: trainingStations } = useApi<TrainingStationModel[]>({
        url: "/administration/training-station",
        method: "get",
    });

    const [searchValue, setSearchValue] = useState<string>("");
    const debouncedSearchValue = useDebounce<string>(searchValue);
    const filteredData = useFilter<TrainingStationModel>(trainingStations ?? [], searchValue, debouncedSearchValue, filterStations);

    function addStation() {
        setIsSubmitting(true);
        const trainingStationID = Number(selectedTrainingStation);
        if (trainingStationID == Number.NaN || selectedTrainingStation == null) {
            setIsSubmitting(false);
            return;
        }

        const newStation = trainingStations?.find(t => t.id == trainingStationID);
        if (newStation == null) {
            setIsSubmitting(false);
            return;
        }

        axiosInstance
            .put(`/administration/endorsement-group/${id}/stations`, { training_station_id: trainingStationID })
            .then(() => {
                ToastHelper.success("Station erfolgreich hinzugefügt");
                setEndorsementGroupStations([...(endorsementGroupStations ?? []), newStation]);
                setSelectedTrainingStation(undefined);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Hinzufügen der Station");
            })
            .finally(() => setIsSubmitting(false));
    }

    function removeStation(stationID: number) {
        setIsSubmitting(true);

        axiosInstance
            .delete(`/administration/endorsement-group/${id}/stations`, {
                data: {
                    training_station_id: stationID,
                },
            })
            .then(() => {
                ToastHelper.success("Station erfolgreich entfernt");
                setEndorsementGroupStations(endorsementGroupStations?.filter(e => e.id != stationID));
            })
            .catch(() => {
                ToastHelper.error("Fehler beim entfernen der Station");
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <>
            <Input
                label={"Stationen Filtern"}
                onChange={e => setSearchValue(e.target.value)}
                value={searchValue}
                fieldClassName={"uppercase"}
                placeholder={"EDDF"}
                labelSmall
            />

            <Select
                label={"Trainingsstation Hinzufügen"}
                labelSmall
                className={"mt-5"}
                disabled={loadingStations || loadingEndorsementGroupStations}
                onChange={v => {
                    if (v == "-1") {
                        setSelectedTrainingStation(undefined);
                        return;
                    }
                    setSelectedTrainingStation(v);
                }}
                value={selectedTrainingStation ?? "-1"}>
                <option value={"-1"} disabled>
                    Trainingsstation Auswählen
                </option>
                <MapArray
                    data={filteredData?.filter(t => endorsementGroupStations?.find(e => e.id == t.id) == null) ?? []}
                    mapFunction={(station: TrainingStationModel, index) => {
                        return (
                            <option key={index} value={station.id.toString()}>{`${station.callsign.toUpperCase()} (${station.frequency.toFixed(3)})`}</option>
                        );
                    }}
                />
            </Select>

            <Button
                variant={"twoTone"}
                color={COLOR_OPTS.PRIMARY}
                className={"mt-3"}
                disabled={isSubmitting || selectedTrainingStation == null || selectedTrainingStation == "-1"}
                icon={<TbPlus size={20} />}
                size={SIZE_OPTS.SM}
                onClick={addStation}>
                Hinzufügen
            </Button>

            <Separator />

            <Table
                columns={EGVStationsTypes.getColumns(removeStation, isSubmitting)}
                defaultSortField={1}
                data={endorsementGroupStations ?? []}
                loading={loadingEndorsementGroupStations}
                paginate
            />
        </>
    );
}
