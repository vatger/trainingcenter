import { UserModel } from "@/models/UserModel";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { CommonRegexp } from "@/core/Config";
import React, { FormEvent, useState } from "react";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import ToastHelper from "@/utils/helper/ToastHelper";

interface AddUserModalT {
    show: boolean;
    onClose: () => any;
    onCreate: (user: UserModel) => any;
    role_id?: string;
}

export function PVAddUserModal(props: AddUserModalT) {
    const [loading, setLoading] = useState<boolean>(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (props.role_id == null) return;
        setLoading(true);

        const formData = FormHelper.getEntries(e.target);
        FormHelper.set(formData, "role_id", props.role_id);

        axiosInstance
            .post("/administration/role/user", formData)
            .then((res: AxiosResponse) => {
                const user: UserModel = res.data as UserModel;
                props.onCreate(user);
                ToastHelper.success("Benutzer erfolgreich hinzugefügt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Hinzufügen des Nutzers");
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
                    regex={CommonRegexp.CID}
                    regexMatchEmpty
                    regexCheckInitial
                    label={"CID"}
                    loading={loading}
                    labelSmall
                    name={"user_id"}
                    maxLength={70}
                    placeholder={"1373921"}
                />
            </Modal>
        </form>
    );
}
