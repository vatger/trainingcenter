import { NavigateFunction, useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye, TbTrash } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { Dispatch } from "react";

function getColumns(): TableColumn<TrainingSessionModel>[] {
    const navigate = useNavigate();

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
            selector: row => row.users?.length ?? "N/A",
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`${row.uuid}`)}
                        size={SIZE_OPTS.SM}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbEye size={20} />}>
                        Ansehen
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
