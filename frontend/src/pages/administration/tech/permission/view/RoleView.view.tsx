import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { TbCheckbox, TbPlus } from "react-icons/tb";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { useParams } from "react-router-dom";
import { RVRolePermissionTablePartial } from "./_partials/RVRolePermissionTable.partial";
import { RVRoleUserTablePartial } from "./_partials/RVRoleUserTable.partial";
import { FormEvent, useState } from "react";
import FormHelper from "../../../../../utils/helper/FormHelper";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import useApi from "@/utils/hooks/useApi";
import { PermissionModel, RoleModel } from "@/models/PermissionModel";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { PVAddUserModal } from "@/pages/administration/tech/permission/view/_modals/PVAddUser.modal";

const name_regex: RegExp = RegExp("^(?!\\s*$).+");

export function RoleViewView() {
    const { role_id } = useParams();

    const [showAddRoleModal, setShowAddRoleModal] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);

    const { data: permissions, loading: loadingPermissions } = useApi<PermissionModel[]>({
        url: "/administration/permission",
        method: "get",
    });
    const {
        data: roleData,
        setData: setRoleData,
        loading: loadingRoleData,
    } = useApi<RoleModel>({
        url: `/administration/role/${role_id}`,
        method: "get",
    });

    const tabHeader = ["Berechtigungen", "Benutzer" + (loadingRoleData ? null : ` (${roleData?.users?.length})`)];

    function handleUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setUpdating(true);

        const formData = FormHelper.getEntries(e.target);

        axiosInstance
            .patch(`/administration/role/${role_id}`, formData)
            .then(() => {
                ToastHelper.success("Rolle aktualisiert");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Aktualisieren der Rolle");
            })
            .finally(() => setUpdating(false));
    }

    return (
        <>
            <PageHeader title={"Rolle Bearbeiten"} />

            <Card header={"Informationen"} headerBorder>
                <form onSubmit={handleUpdate}>
                    <Input label={"Name"} regex={name_regex} regexMatchEmpty description={"Name der Rolle"} name={"name"} labelSmall value={roleData?.name} />

                    <Button
                        loading={updating}
                        type={"submit"}
                        className={"mt-4"}
                        icon={<TbCheckbox size={20} />}
                        variant={"twoTone"}
                        size={SIZE_OPTS.SM}
                        color={COLOR_OPTS.PRIMARY}>
                        Speichern
                    </Button>
                </form>
            </Card>

            <Card
                className={"mt-5"}
                header={"Benutzer & Berechtigungen"}
                headerBorder
                headerExtra={
                    <Button
                        size={SIZE_OPTS.XS}
                        onClick={() => setShowAddRoleModal(true)}
                        icon={<TbPlus size={20} />}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}>
                        Benutzer Hinzufügen
                    </Button>
                }>
                <Tabs tabHeaders={tabHeader} type={"underline"}>
                    <RVRolePermissionTablePartial
                        loading={loadingRoleData || loadingPermissions}
                        permissions={permissions ?? []}
                        role={roleData}
                        setRole={setRoleData}
                    />

                    <RVRoleUserTablePartial loading={loadingRoleData || loadingPermissions} roleData={roleData} setRoleData={setRoleData} role_id={role_id} />
                </Tabs>
            </Card>

            <PVAddUserModal
                show={showAddRoleModal}
                onClose={() => {
                    setShowAddRoleModal(false);
                }}
                onCreate={user => {
                    if (roleData == null) return;

                    const roleD = { ...roleData };
                    roleD.users = [...(roleD.users ?? []), user];
                    setRoleData(roleD);
                    setShowAddRoleModal(false);
                }}
                role_id={role_id}
            />
        </>
    );
}
