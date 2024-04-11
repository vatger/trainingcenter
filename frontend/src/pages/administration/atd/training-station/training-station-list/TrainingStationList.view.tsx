import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Table } from "@/components/ui/Table/Table";
import { Card } from "@/components/ui/Card/Card";
import useApi from "@/utils/hooks/useApi";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import TSLListTypes from "@/pages/administration/atd/training-station/training-station-list/_types/TSLList.types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, ICON_SIZE_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbReload } from "react-icons/tb";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import ToastHelper from "@/utils/helper/ToastHelper";
import { useState } from "react";

export function TrainingStationListView() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const {
        data: trainingStations,
        loading: loadingTrainingStations,
        setData: setTrainingStations,
    } = useApi<TrainingStationModel[]>({
        url: "/administration/training-station",
        method: "get",
    });

    function syncStations() {
        setSubmitting(true);
        axiosInstance
            .post("/administration/training-station/sync")
            .then((res: AxiosResponse) => {
                ToastHelper.success("Stationen erfolgreich aktualisiert");
                setTrainingStations(res.data as TrainingStationModel[]);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim synchronisieren der Stationen");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <>
            <PageHeader title={"Trainingsstationen Verwalten"} hideBackLink />

            <Card
                header={
                    <Button
                        variant={"twoTone"}
                        size={SIZE_OPTS.SM}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbReload size={ICON_SIZE_OPTS.SM} />}
                        onClick={syncStations}
                        loading={submitting}>
                        Jetzt Synchronisieren
                    </Button>
                }
                headerBorder>
                <Table
                    paginate
                    searchable
                    defaultSortField={1}
                    columns={TSLListTypes.getColumns(navigate)}
                    data={trainingStations ?? []}
                    loading={loadingTrainingStations}
                />
            </Card>
        </>
    );
}
