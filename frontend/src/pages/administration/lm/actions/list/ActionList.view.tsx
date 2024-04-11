import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Table } from "@/components/ui/Table/Table";
import { Card } from "@/components/ui/Card/Card";
import useApi from "@/utils/hooks/useApi";
import { ActionRequirementModel } from "@/models/CourseModel";
import ALTypes from "@/pages/administration/lm/actions/list/_types/AL.types";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";

export function ActionListView() {
    const navigate = useNavigate();

    const { loading: loadingActionRequirements, data: actionRequirements } = useApi<ActionRequirementModel[]>({
        url: "administration/action-requirement",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Aktionen / Bedingungen Verwalten"} hideBackLink />

            <Card
                header={
                    <Link to={"create"}>
                        <Button icon={<TbPlus size={14} />} size={SIZE_OPTS.SM} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                            Aktion/Bedingung Erstellen
                        </Button>
                    </Link>
                }
                headerBorder>
                <Table
                    searchable
                    loading={loadingActionRequirements}
                    columns={ALTypes.getActionRequirementTableColumns(navigate)}
                    data={actionRequirements ?? []}
                />
            </Card>
        </>
    );
}
