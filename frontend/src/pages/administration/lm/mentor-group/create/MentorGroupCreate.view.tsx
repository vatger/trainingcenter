import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { TbFilePlus, TbId, TbMap2, TbUser } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Separator } from "@/components/ui/Separator/Separator";
import React, { FormEvent, useState } from "react";
import FormHelper from "../../../../../utils/helper/FormHelper";
import { MinimalUser, UserModel } from "@/models/UserModel";
import { Table } from "@/components/ui/Table/Table";
import { MentorGroupModel } from "@/models/MentorGroupModel";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { useNavigate } from "react-router-dom";
import { Select } from "@/components/ui/Select/Select";
import { AxiosResponse } from "axios";
import { CommonConstants, CommonRegexp } from "@/core/Config";
import { useUserSelector } from "@/app/features/authSlice";
import MGCUsersTableTypes from "@/pages/administration/lm/mentor-group/create/_types/MGCUsersTable.types";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { UserFilter } from "@/components/ui/UserFilter/UserFilter";

export interface IUserInMentorGroup {
    user: MinimalUser;
    admin: boolean;
    can_manage: boolean;
}

export function MentorGroupCreateView() {
    const navigate = useNavigate();
    const user = useUserSelector();

    const defaultUser: IUserInMentorGroup = { user: user ?? ({} as MinimalUser), admin: true, can_manage: true };
    const [newUserID, setNewUserID] = useState<string>("");
    const [loadingUser, setLoadingUser] = useState<boolean>(false);
    const [users, setUsers] = useState<IUserInMentorGroup[]>([defaultUser]);

    const [submitting, setSubmitting] = useState<boolean>(false);

    function handleCreate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        let formData = FormHelper.getEntries(e.target);
        FormHelper.set(
            formData,
            "users",
            users.map(u => ({
                user_id: u.user.id,
                admin: u.admin,
                can_manage: u.can_manage,
            }))
        );

        axiosInstance
            .post("/administration/mentor-group", formData)
            .then((res: AxiosResponse) => {
                const mentorGroup = res.data as MentorGroupModel;
                navigate("/administration/mentor-group/" + mentorGroup.id + "?r");
                ToastHelper.success("Mentorengruppe erfolgreich erstellt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen der Mentorengruppe");
            })
            .finally(() => setSubmitting(false));
    }

    function addUser(u: MinimalUser) {
        const newUser = {
            user: { ...u },
            admin: false,
            can_manage: false,
        };
        setUsers([...users, newUser]);
    }

    return (
        <>
            <PageHeader title={"Mentorengruppe Erstellen"} />

            <Card header={"Informationen"} headerBorder>
                <form onSubmit={e => handleCreate(e)}>
                    <Input
                        name={"name"}
                        type={"text"}
                        maxLength={70}
                        description={"Name der Mentorengruppe"}
                        labelSmall
                        placeholder={"Frankfurt Tower Mentoren"}
                        label={"Name"}
                        required
                        regex={CommonRegexp.NOT_EMPTY}
                        regexMatchEmpty
                        regexCheckInitial
                        preIcon={<TbId size={20} />}
                    />

                    <Select
                        name={"fir"}
                        label={"FIR"}
                        preIcon={<TbMap2 size={20} />}
                        className={"mt-5"}
                        description={"FIR der Mentorengruppe"}
                        labelSmall
                        defaultValue={"none"}>
                        <option value={"none"}>N/A</option>
                        <option value={"edww"}>EDWW</option>
                        <option value={"edgg"}>EDGG</option>
                        <option value={"edmm"}>EDMM</option>
                    </Select>

                    <Separator />

                    <Button type={"submit"} loading={submitting} icon={<TbFilePlus size={20} />} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                        Mentorengruppe Erstellen
                    </Button>
                </form>
            </Card>

            <Card className={"mt-5"} header={"Mitglieder"} headerBorder>
                <UserFilter onUserSelect={addUser} removeIDs={users.map(u => u.user.id)} />

                <Separator />

                <p className="mb-3 text-xs">
                    Du bist automatisch als Gruppenadministrator und Kursverwalter in dieser Mentorengruppe. Falls dies nicht erwünscht sein sollte, kann dies
                    im Nachinein über die Verwaltung der Mentorengruppen angepasst werden. Wenn Du allerdings diese Berechtigungen nicht mehr besitzt, kannst Du
                    auch keine Änderungen mehr an der Mentorengruppe vornehmen um bspw. Mitglieder hinzuzufügen oder zu entfernen!
                </p>

                <Table paginate columns={MGCUsersTableTypes.getColumns(user?.id, users, setUsers)} data={users} />
            </Card>
        </>
    );
}
