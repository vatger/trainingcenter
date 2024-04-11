import { MentorGroupModel } from "@/models/MentorGroupModel";
import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import React from "react";
import { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import MentorGroupListTypes from "../_types/UVMentorGroupList.types";

type UserMentorGroupsPartialProps = {
    mentorGroups: MentorGroupModel[];
};

export function UVMentorGroupsPartial(props: UserMentorGroupsPartialProps) {
    const navigate = useNavigate();

    return (
        <Card header={"Mentorengruppen"} className={"mt-7"} headerBorder>
            <Table paginate defaultSortField={1} columns={MentorGroupListTypes.getColumns(navigate)} data={props.mentorGroups} />
        </Card>
    );
}
