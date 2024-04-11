import { UserModel } from "@/models/UserModel";
import { Table } from "@/components/ui/Table/Table";
import CourseUsersListTypes from "../_types/CVCourseUsersList.types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CVRemoveUserModal } from "../_modals/CVRemoveUser.modal";
import useApi from "@/utils/hooks/useApi";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

export function CVUsersSubpage({ courseUUID }: { courseUUID: string | undefined }) {
    const navigate = useNavigate();
    const [showRemoveUserModal, setShowRemoveUserModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserModel | undefined>(undefined);

    const {
        data: users,
        setData: setUsers,
        loading: loadingUsers,
    } = useApi<UserModel[]>({
        url: `/administration/course/user/${courseUUID}`,
        method: "get",
    });

    function handleUserRemoval(user?: UserModel) {
        setShowRemoveUserModal(false);
        setSelectedUser(undefined);

        if (user == null) return;

        const newUsers = users?.filter((u: UserModel) => {
            return u.id != user.id;
        });

        setUsers(newUsers);
    }

    return (
        <>
            <CVRemoveUserModal show={showRemoveUserModal} onClose={handleUserRemoval} user={selectedUser} courseUUID={courseUUID} />

            <Table
                columns={CourseUsersListTypes.getColumns(navigate, setShowRemoveUserModal, setSelectedUser, courseUUID)}
                data={users ?? []}
                paginate
                searchable
                loading={loadingUsers}
            />
        </>
    );
}
