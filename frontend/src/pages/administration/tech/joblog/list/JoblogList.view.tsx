import { useNavigate } from "react-router-dom";
import useApi from "@/utils/hooks/useApi";
import { SyslogModel } from "@/models/SyslogModel";
import { TableColumn } from "react-data-table-component";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import JLTypes from "@/pages/administration/tech/joblog/list/_types/JL.types";
import { JoblogModel } from "@/models/JoblogModel";

export function JoblogListView() {
    const navigate = useNavigate();
    const { data: jobLogs, loading } = useApi<SyslogModel[]>({
        url: `/administration/joblog`,
        method: "get",
    });

    const columns: TableColumn<JoblogModel>[] = JLTypes.getColumns(navigate);

    return (
        <>
            <PageHeader title={"Joblogs"} hideBackLink />

            <Card>
                <Table loading={loading} paginate columns={columns} defaultSortField={3} defaultSortAsc={false} data={jobLogs ?? []} />
            </Card>
        </>
    );
}
