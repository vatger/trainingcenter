import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { MentorGroupModel } from "../../../../../../models/MentorGroupModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

function getColumns(navigate: NavigateFunction): TableColumn<MentorGroupModel>[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Mitglied Seit",
            selector: row => dayjs.utc(row.UserBelongToMentorGroups?.createdAt).format(Config.DATETIME_FORMAT),
        },
        {
            name: "Aktion",
            selector: row => "TODO",
        },
    ];
}

export default {
    getColumns,
};
