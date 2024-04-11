import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";
import { NavigateFunction, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";

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
            name: "Station",
            selector: row => row.training_station?.callsign ?? "N/A",
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`/training/planned/${row.uuid}`)}
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
