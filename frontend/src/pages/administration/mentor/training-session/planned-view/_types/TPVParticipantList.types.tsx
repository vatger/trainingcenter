import { TableColumn } from "react-data-table-component";
import { UserModel } from "@/models/UserModel";

function getColumns(): TableColumn<UserModel>[] {
    return [
        {
            name: "CID",
            selector: row => row.id,
            sortable: true,
        },
        {
            name: "Name",
            selector: row => row.first_name + " " + row.last_name,
            sortable: true,
        },
    ];
}

export default {
    getColumns,
};
