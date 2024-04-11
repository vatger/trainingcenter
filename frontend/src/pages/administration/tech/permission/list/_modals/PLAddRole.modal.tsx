import { PermissionModel, RoleModel } from "@/models/PermissionModel";
import React, { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal/Modal";
import { CommonRegexp } from "@/core/Config";
import { Input } from "@/components/ui/Input/Input";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import ToastHelper from "@/utils/helper/ToastHelper";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";

export function PLAddRoleModal(props: { show: boolean; onClose: () => any; onCreate: (permission: RoleModel) => any }) {
    const [loading, setLoading] = useState<boolean>(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = FormHelper.getEntries(e.target);

        axiosInstance
            .post("/administration/role", formData)
            .then((res: AxiosResponse) => {
                const role: RoleModel = res.data as RoleModel;
                props.onCreate(role);
                ToastHelper.success("Rolle erfolgreich erstellt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen der Rolle");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Modal
                show={props.show}
                title={"Rolle Hinzufügen"}
                onClose={props.onClose}
                footer={
                    <Button type={"submit"} loading={loading} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                        Hinzufügen
                    </Button>
                }>
                <Input
                    regex={CommonRegexp.NOT_EMPTY}
                    regexMatchEmpty
                    regexCheckInitial
                    label={"Name"}
                    loading={loading}
                    labelSmall
                    name={"name"}
                    maxLength={70}
                    placeholder={"tech"}
                />
            </Modal>
        </form>
    );
}
