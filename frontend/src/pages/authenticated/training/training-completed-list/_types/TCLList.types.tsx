import { TableColumn } from "react-data-table-component";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import React from "react";
import { Button } from "@/components/ui/Button/Button";
import { TbEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import StringHelper from "@/utils/helper/StringHelper";

function getColumns(): TableColumn<TrainingSessionModel>[] {
    const navigate = useNavigate();

    return [
        {
            name: "Kurs",
            selector: row => row.course?.name ?? "N/A",
        },
        {
            name: "Datum",
            selector: row => dayjs.utc(row.date).format(Config.DATETIME_FORMAT),
        },
        {
            name: "Mentor",
            selector: row => row.mentor_id ?? "N/A",
        },
        {
            name: "Trainingstyp",
            selector: row => `${row.training_type?.name} (${StringHelper.capitalize(row.training_type?.type)})` ?? "N/A",
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3"}
                            size={SIZE_OPTS.SM}
                            onClick={() => navigate("/training/planned/" + row.uuid)}
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbEye size={20} />}>
                            Ansehen
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
