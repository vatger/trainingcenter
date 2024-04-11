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
import { CourseModel } from "@/models/CourseModel";

function getColumns(): (TableColumn<CourseModel> & { searchable?: boolean })[] {
    const navigate = useNavigate();

    return [
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
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
