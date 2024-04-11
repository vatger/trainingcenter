import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye, TbTrash } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { Dispatch } from "react";

function getColumns(
    navigate: NavigateFunction,
    setSelectedTrainingSession: Dispatch<TrainingSessionModel | undefined>,
    setShowDeleteSessionModal: Dispatch<boolean>
): TableColumn<TrainingSessionModel>[] {
    return [
        {
            name: "Datum",
            selector: row => dayjs.utc(row.date).format(Config.DATETIME_FORMAT),
        },
        {
            name: "Kurs",
            selector: row => row.course?.name ?? "N/A",
        },
        {
            name: "Trainingstyp",
            selector: row => row.training_type?.name ?? "N/A",
        },
        {
            name: "Teilnehmer",
            selector: row => row.training_session_belongs_to_users?.length ?? "N/A",
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3"}
                            onClick={() => navigate(`${row.uuid}`)}
                            size={SIZE_OPTS.SM}
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbEye size={20} />}></Button>

                        <Button
                            className={"my-3 ml-3"}
                            onClick={() => {
                                setSelectedTrainingSession(row);
                                setShowDeleteSessionModal(true);
                            }}
                            disabled={row.training_type?.type == "cpt"}
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
