import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Table } from "@/components/ui/Table/Table";
import { TableColumn } from "react-data-table-component";
import { SyslogModel } from "@/models/SyslogModel";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import useApi from "@/utils/hooks/useApi";
import SLTypes from "@/pages/administration/tech/syslog/list/_types/SL.types";

export function SyslogListView() {
    const navigate = useNavigate();
    const { data: systemLogs, loading } = useApi<SyslogModel[]>({
        url: `/administration/syslog`,
        method: "get",
    });

    const columns: TableColumn<SyslogModel>[] = SLTypes.getColumns(navigate);

    return (
        <>
            <PageHeader title={"Systemlogs"} hideBackLink />

            <Card>
                <Table loading={loading} columns={columns} data={systemLogs ?? []} />
            </Card>
        </>
    );
}
