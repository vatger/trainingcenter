import { Modal } from "@/components/ui/Modal/Modal";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import React, { FormEvent, useState } from "react";
import { PermissionModel } from "@/models/PermissionModel";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";
import { AxiosResponse } from "axios";
import ToastHelper from "@/utils/helper/ToastHelper";
import { CommonRegexp } from "@/core/Config";

export function PLAddPermissionModal(props: { show: boolean; onClose: () => any; onCreate: (permission: PermissionModel) => any }) {
    const [loading, setLoading] = useState<boolean>(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = FormHelper.getEntries(e.target);

        axiosInstance
            .put("/administration/permission", formData)
            .then((res: AxiosResponse) => {
                const permission: PermissionModel = res.data as PermissionModel;
                props.onCreate(permission);
                ToastHelper.success("Berechtigung erfolgreich erstellt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen der Berechtigung");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Modal
                show={props.show}
                title={"Berechtigung Hinzufügen"}
                footer={
                    <Button type={"submit"} loading={loading} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                        Hinzufügen
                    </Button>
                }
                onClose={props.onClose}>
                <Input
                    regex={CommonRegexp.NOT_EMPTY}
                    regexMatchEmpty
                    regexCheckInitial
                    label={"Name"}
                    loading={loading}
                    labelSmall
                    name={"name"}
                    maxLength={70}
                    placeholder={"administration.access"}
                />
            </Modal>
        </form>
    );
}
