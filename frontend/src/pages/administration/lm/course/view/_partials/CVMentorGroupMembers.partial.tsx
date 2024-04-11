import { UserModel } from "../../../../../../models/UserModel";
import { Modal } from "../../../../../../components/ui/Modal/Modal";
import { MentorGroupModel } from "../../../../../../models/MentorGroupModel";
import { Table } from "../../../../../../components/ui/Table/Table";
import { TableColumn } from "react-data-table-component";

const userTableColumn: TableColumn<UserModel>[] = [
    {
        name: "CID",
        selector: (row: UserModel) => row.id,
    },
    {
        name: "Name",
        selector: (row: UserModel) => row.first_name + " " + row.last_name,
    },
];

export function CVMentorGroupMembersPartial(props: { users: UserModel[]; mentorGroup?: MentorGroupModel; show: boolean; onClose: () => any }) {
    return (
        <Modal show={props.show} title={props.mentorGroup?.name ?? "Laden..."} onClose={props.onClose}>
            <Table columns={userTableColumn} data={props.users} />
        </Modal>
    );
}
