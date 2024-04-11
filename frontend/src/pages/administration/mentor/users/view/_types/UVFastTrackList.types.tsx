import { TableColumn } from "react-data-table-component";
import { FastTrackRequestModel } from "@/models/FastTrackRequestModel";
import React from "react";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Button } from "@/components/ui/Button/Button";
import { TbEye } from "react-icons/tb";
import { getAtcRatingShort } from "@/utils/helper/vatsim/AtcRatingHelper";
import FastTrackHelper from "@/utils/helper/FastTrackHelper";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

function getColumns(): TableColumn<FastTrackRequestModel>[] {
    return [
        {
            name: "Rating",
            selector: row => getAtcRatingShort(row.rating),
        },
        {
            name: "Status",
            cell: row => FastTrackHelper.statusToBadge(row.status),
        },
        {
            name: "Erstellt Am",
            selector: row => dayjs.utc(row.createdAt).format(Config.DATE_FORMAT),
        },
    ];
}

export default {
    getColumns,
};
