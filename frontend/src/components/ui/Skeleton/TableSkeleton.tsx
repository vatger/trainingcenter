import { Table } from "../Table/Table";
import { TableColumn } from "react-data-table-component";
import { Skeleton } from "./Skeleton";

export function TableSkeleton(props: { colCount: number; rowCount: number }) {
    let columns: TableColumn<any>[] = [];

    Array(props.colCount)
        .fill(0)
        .forEach(() => {
            columns.push({
                name: <Skeleton />,
                cell: () => {
                    return (
                        <div className={"w-full h-full px-10 py-3"}>
                            <Skeleton />
                        </div>
                    );
                },
            });
        });

    return <Table columns={columns} data={Array(props.rowCount).fill(0)} />;
}
