import { Link, useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Table } from "@/components/ui/Table/Table";
import MentorGroupListTypes from "./_types/MGList.types";
import { MentorGroupModel } from "@/models/MentorGroupModel";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import useApi from "@/utils/hooks/useApi";

export function MentorGroupListView() {
    const navigate = useNavigate();

    const { data: mentorGroups, loading } = useApi<MentorGroupModel[]>({
        url: "/administration/mentor-group/admin",
        method: "get",
    });
    const trainingTypesColumns: (TableColumn<MentorGroupModel> & { searchable?: boolean })[] = MentorGroupListTypes.getColumns(navigate);

    return (
        <>
            <PageHeader title={"Mentorengruppen Verwalten"} hideBackLink />

            <Card
                header={
                    <Link to={"create"}>
                        <Button icon={<TbPlus size={14} />} size={SIZE_OPTS.SM} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                            Mentorgruppe Erstellen
                        </Button>
                    </Link>
                }
                headerBorder>
                <Table searchable paginate loading={loading} columns={trainingTypesColumns} data={mentorGroups ?? []} />
            </Card>
        </>
    );
}
