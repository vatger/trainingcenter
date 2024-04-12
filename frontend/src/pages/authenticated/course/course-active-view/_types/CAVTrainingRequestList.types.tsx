import { TableColumn } from "react-data-table-component";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";
import React from "react";
import { NavigateFunction } from "react-router-dom";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

function getColumns(navigate: NavigateFunction): TableColumn<TrainingRequestModel>[] {
    return [
        {
            name: "Name",
            selector: row => row.training_type?.name ?? "N/A",
            sortable: true,
        },
        {
            name: "Status",
            cell: row => {
                switch (row.status) {
                    case "requested":
                        return (
                            <div>
                                <Badge color={COLOR_OPTS.PRIMARY}>Beantragt</Badge>
                            </div>
                        );

                    case "planned":
                        return <Badge color={COLOR_OPTS.SUCCESS}>Geplant</Badge>;

                    case "cancelled":
                        return <Badge color={COLOR_OPTS.DANGER}>Abgesagt</Badge>;

                    case "completed":
                        return <Badge>Abgeschlossen</Badge>;

                    default:
                        return "N/A";
                }
            },
            sortable: true,
            sortFunction: (a: TrainingRequestModel, b: TrainingRequestModel) => {
                return a.status > b.status ? -1 : 1;
            },
        },
        {
            name: "Position",
            selector: row => (row.number_in_queue ? `#${row.number_in_queue}` : "N/A"),
        },
        {
            name: "Station",
            selector: row => row.training_station?.callsign?.toUpperCase() ?? "N/A",
            sortable: true,
        },
        {
            name: "Ablaufdatum",
            cell: row => {
                if (row.status != "requested") return "N/A";

                const date = dayjs.utc(row.expires);
                if (date.isBefore(dayjs())) {
                    return <span className={"text-danger"}>{date.format(Config.DATETIME_FORMAT)}</span>;
                }
                return dayjs.utc(row.expires).format(Config.DATETIME_FORMAT);
            },
            sortable: true,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3"}
                            size={SIZE_OPTS.SM}
                            onClick={() => navigate("/training/request/" + row.uuid)}
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
