import { TableColumn } from "react-data-table-component";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import { NavigateFunction } from "react-router-dom";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

function getColumns(navigate: NavigateFunction): (TableColumn<TrainingStationModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Callsign",
            selector: row => row.callsign.toUpperCase(),
            searchable: true,
            sortable: true,
        },
        {
            name: "Gcap Klasse",
            cell: row => {
                return <Badge color={COLOR_OPTS.DEFAULT}>{row.gcap_class}</Badge>;
            },
        },
        {
            name: "Gcap Gruppe",
            cell: row => {
                return <Badge color={COLOR_OPTS.DEFAULT}>{row.gcap_class_group}</Badge>;
            },
        },
        {
            name: "Training",
            cell: row => {
                if (row.gcap_training_airport) {
                    return <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge>;
                }

                return <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>;
            },
            sortable: true,
            sortFunction: (a, b) => {
                return a.gcap_training_airport ? -1 : 1;
            },
        },
        {
            name: "S1 Twr",
            cell: row => {
                if (row.s1_twr) {
                    return <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge>;
                }

                return <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>;
            },
            sortable: true,
            sortFunction: (a, b) => {
                return a.s1_twr ? -1 : 1;
            },
        },
        {
            name: "Zuletzt Aktualisiert",
            selector: row => dayjs.utc(row.updatedAt).format(Config.DATETIME_FORMAT),
        },
    ];
}

export default { getColumns };
