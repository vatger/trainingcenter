import { Link, useNavigate } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import TrainingTypeListTypes from "./_types/TTLList.types";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Table } from "@/components/ui/Table/Table";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import useApi from "@/utils/hooks/useApi";

export function TrainingTypeListView() {
    const navigate = useNavigate();

    const { data: trainingTypes, loading } = useApi<TrainingTypeModel[]>({
        url: "/administration/training-type",
        method: "get",
    });

    const trainingTypesColumns: (TableColumn<TrainingTypeModel> & { searchable?: boolean })[] = TrainingTypeListTypes.getColumns(navigate);

    return (
        <>
            <PageHeader title={"Trainingstypen Verwalten"} hideBackLink />

            <Card
                header={
                    <Link to={"create"}>
                        <Button icon={<TbPlus size={14} />} size={SIZE_OPTS.SM} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                            Trainingstyp Erstellen
                        </Button>
                    </Link>
                }
                headerBorder>
                <Table searchable loading={loading} columns={trainingTypesColumns} data={trainingTypes ?? []} />
            </Card>
        </>
    );
}
