import { UserModel } from "@/models/UserModel";
import { Card } from "@/components/ui/Card/Card";
import React, { Dispatch, useState } from "react";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbPlus } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { Table } from "@/components/ui/Table/Table";
import UVTypes from "@/pages/administration/mentor/users/view/_types/UV.types";
import { useNavigate } from "react-router-dom";
import { UVAddEndorsementModal } from "@/pages/administration/mentor/users/view/_modals/UVAddEndorsement.modal";
import useApi from "@/utils/hooks/useApi";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";

export function UVEndorsementsPartial({ user, setUser }: { user?: UserModel; setUser: Dispatch<UserModel> }) {
    const navigate = useNavigate();

    const [showEndorsementAddModal, setShowEndorsementAddModal] = useState<boolean>(false);

    const { loading: loadingEndorsementGroups, data: endorsementGroups } = useApi<EndorsementGroupModel[]>({
        url: "/administration/endorsement-group/with-stations",
        method: "get",
    });

    return (
        <>
            <Card
                header={"Freigaben"}
                className={"mt-7"}
                headerBorder
                headerExtra={
                    <Button
                        size={SIZE_OPTS.XS}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbPlus size={20} />}
                        onClick={() => setShowEndorsementAddModal(true)}>
                        Freigabe Hinzufügen
                    </Button>
                }>
                <Table
                    columns={UVTypes.getEndorsementTableColumns(navigate, user?.user_solo)}
                    paginate
                    defaultSortField={1}
                    data={user?.endorsement_groups ?? []}
                />
            </Card>

            <UVAddEndorsementModal
                user={user}
                setUser={setUser}
                endorsementGroups={endorsementGroups ?? []}
                userEndorsementGroups={user?.endorsement_groups}
                show={showEndorsementAddModal}
                onClose={() => setShowEndorsementAddModal(false)}
            />
        </>
    );
}
