import { Link, NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { UserModel } from "../../../../../../models/UserModel";
import { Button } from "../../../../../../components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "../../../../../../assets/theme.config";
import { TbEye, TbTrash } from "react-icons/tb";
import { Badge } from "../../../../../../components/ui/Badge/Badge";
import { Dispatch } from "react";

function getColumns(
    navigate: NavigateFunction,
    setShowRemoveUserModal: Dispatch<boolean>,
    setSelectedUser: Dispatch<UserModel>,
    course_id?: string
): (TableColumn<UserModel> & { searchable?: boolean })[] {
    return [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
        },
        {
            name: "Name",
            cell: row =>
                row == null ? (
                    "N/A"
                ) : (
                    <Link to={"/administration/user/" + row.id}>
                        <span className={"text-primary hover:cursor-pointer hover:underline"}>
                            {row.first_name} {row.last_name}
                        </span>
                    </Link>
                ),
            sortable: true,
            searchable: true,
        },
        {
            name: "Abgeschlossen",
            cell: row => {
                return row?.UsersBelongsToCourses?.completed ? <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge> : <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>;
            },
            searchable: true,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3"}
                            size={SIZE_OPTS.SM}
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbEye size={20} />}
                            onClick={() => {
                                navigate(`/administration/user-course-progress/${course_id}/${row.id}`);
                            }}
                        />
                        <Button
                            className={"my-3 ml-2"}
                            variant={"twoTone"}
                            onClick={() => {
                                setSelectedUser(row);
                                setShowRemoveUserModal(true);
                            }}
                            size={SIZE_OPTS.SM}
                            color={COLOR_OPTS.DANGER}
                            icon={<TbTrash size={20} />}></Button>
                    </div>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
