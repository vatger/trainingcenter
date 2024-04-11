import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import useApi from "@/utils/hooks/useApi";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { Table } from "@/components/ui/Table/Table";
import EGListTypes from "@/pages/administration/lm/endorsement-group/list/_types/EGList.types";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";

export function EndorsementGroupListView() {
    const navigate = useNavigate();
    const { loading: loadingEndorsementGroups, data: endorsementGroups } = useApi<EndorsementGroupModel[]>({
        url: "/administration/endorsement-group",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Freigabegruppen Verwalten"} hideBackLink />

            <Card
                header={
                    <Link to={"create"}>
                        <Button icon={<TbPlus size={14} />} size={SIZE_OPTS.SM} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                            Freigabegruppe Erstellen
                        </Button>
                    </Link>
                }
                headerBorder>
                <Table paginate columns={EGListTypes.getColumns(navigate)} data={endorsementGroups ?? []} loading={loadingEndorsementGroups} />
            </Card>
        </>
    );
}
