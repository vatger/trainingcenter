import { TableColumn } from "react-data-table-component";
import { FastTrackRequestModel } from "@/models/FastTrackRequestModel";
import { getAtcRatingShort } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import React from "react";
import { Button } from "@/components/ui/Button/Button";
import { TbEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import FastTrackHelper from "@/utils/helper/FastTrackHelper";

function getColumns(): (TableColumn<FastTrackRequestModel> & { searchable?: boolean })[] {
    const navigate = useNavigate();

    return [
        {
            name: "Benutzer",
            selector: row => `${row.user?.first_name} ${row.user?.last_name}`,
            sortable: true,
        },
        {
            name: "Rating",
            selector: row => getAtcRatingShort(row.rating),
        },
        {
            name: "Status",
            cell: row => FastTrackHelper.statusToBadge(row.status),
        },
        {
            name: "Angefragt Am",
            cell: row => dayjs.utc(row.createdAt).format(Config.DATE_FORMAT),
            sortable: true,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3"}
                            onClick={() => navigate(`/administration/fast-track/${row.id}`)}
                            size={SIZE_OPTS.SM}
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
