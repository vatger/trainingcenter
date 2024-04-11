import { Table } from "@/components/ui/Table/Table";
import useApi from "@/utils/hooks/useApi";
import { UserModel } from "@/models/UserModel";
import { useParams } from "react-router-dom";
import EGVUsersTypes from "@/pages/administration/lm/endorsement-group/view/_types/EGVUsers.types";
import { useState } from "react";
import { EGVUserRemoveModal } from "@/pages/administration/lm/endorsement-group/view/_modals/EGVUserRemove.modal";

export function EGVUsersSubpage() {
    const { id } = useParams();
    const {
        loading: loadingEndorsementGroupUsers,
        data: endorsementGroupUsers,
        setData: setEndorsementGroupUsers,
    } = useApi<UserModel[]>({
        url: `/administration/endorsement-group/${id}/users`,
        method: "get",
    });

    const [removingUser, setRemovingUser] = useState<UserModel | undefined>(undefined);
    const [showRemoveUserModal, setShowRemoveUserModal] = useState<boolean>(false);

    return (
        <>
            <Table
                searchable
                columns={EGVUsersTypes.getColumns(userID => {
                    setRemovingUser(endorsementGroupUsers?.find(u => u.id == userID));
                    setShowRemoveUserModal(true);
                })}
                data={endorsementGroupUsers ?? []}
                loading={loadingEndorsementGroupUsers}
            />

            <EGVUserRemoveModal
                show={showRemoveUserModal}
                onClose={() => setShowRemoveUserModal(false)}
                onRemoveUser={(user: UserModel) => setEndorsementGroupUsers(endorsementGroupUsers?.filter(u => u.id != user.id))}
                user={removingUser}
                endorsementGroupID={id}
            />
        </>
    );
}
