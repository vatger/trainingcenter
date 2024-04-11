import { NavigateFunction, useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { TrainingSessionBelongsToUserModel } from "@/models/TrainingSessionBelongsToUser.model";
import { UserModel } from "@/models/UserModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";

function getColumns(): TableColumn<TrainingSessionBelongsToUserModel>[] {
    const navigate = useNavigate();

    return [
        {
            name: "Mentor",
            selector: row => {
                const mentor: UserModel | undefined = row.training_session?.mentor;

                if (mentor == null) {
                    return "N/A";
                }

                return `${mentor.first_name} ${mentor.last_name} (${mentor.id})`;
            },
        },
        {
            name: "Datum",
            selector: row => dayjs.utc(row.training_session?.date).format(Config.DATETIME_FORMAT),
            sortable: true,
        },
        {
            name: "Station",
            selector: row =>
                row.training_session?.training_station?.callsign
                    ? `${row.training_session?.training_station?.callsign} (${row.training_session?.training_station?.frequency?.toFixed(3)})`
                    : "N/A",
            sortable: true,
        },
        {
            name: "Trainingstyp",
            cell: row => row.training_session?.training_type?.name ?? "[Error]",
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`${row.training_session?.uuid}`)}
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
