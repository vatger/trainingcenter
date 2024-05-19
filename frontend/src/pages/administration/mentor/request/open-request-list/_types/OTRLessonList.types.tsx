import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";
import { Link, NavigateFunction } from "react-router-dom";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";

function getColumns(navigate: NavigateFunction, toggleSelectedUser: (cid: number) => any): TableColumn<TrainingRequestModel>[] {
    return [
        {
            name: "Auswahl",
            cell: row => {
                return <Checkbox onChange={() => toggleSelectedUser(row.user?.id ?? -1)}></Checkbox>;
            },
        },
        {
            name: "Trainee",
            cell: row =>
                row.user == null ? (
                    "N/A"
                ) : (
                    <Link to={"/administration/users/" + row.user?.id + "?r"} target={"_blank"}>
                        <span className={"text-primary hover:cursor-pointer hover:underline"}>
                            {row.user.first_name} {row.user.last_name} ({row.user.id})
                        </span>
                    </Link>
                ),
        },
        {
            name: "Training",
            selector: row => row.training_type?.name ?? "N/A",
        },
        {
            name: "Station",
            selector: row => row.training_station?.callsign ?? "N/A",
        },
        {
            name: "Solo Ende",
            selector: row => "xx.xx.xxxx",
        },
        {
            name: "Angefragt",
            selector: row => dayjs.utc(row.createdAt).format(Config.DATE_FORMAT),
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
