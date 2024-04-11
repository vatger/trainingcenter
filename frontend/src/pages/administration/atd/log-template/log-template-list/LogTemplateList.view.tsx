import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import LTLListTypes from "@/pages/administration/atd/log-template/log-template-list/_types/LTLList.types";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import useApi from "@/utils/hooks/useApi";
import { TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";

export function LogTemplateListView() {
    const navigate = useNavigate();

    const { data: trainingLogTemplates, loading: loadingTrainingLogTemplates } = useApi<TrainingLogTemplateModel[]>({
        url: "/administration/training-log/template",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Logvorlagen Verwalten"} hideBackLink />

            <Card
                header={
                    <Link to={"create"}>
                        <Button icon={<TbPlus size={14} />} size={SIZE_OPTS.SM} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                            Logvorlage Erstellen
                        </Button>
                    </Link>
                }
                headerBorder>
                <Table
                    paginate
                    searchable
                    columns={LTLListTypes.getColumns(navigate)}
                    data={trainingLogTemplates ?? []}
                    loading={loadingTrainingLogTemplates}
                />
            </Card>
        </>
    );
}
