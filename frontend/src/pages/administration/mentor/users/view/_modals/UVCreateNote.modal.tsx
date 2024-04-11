import { Modal } from "@/components/ui/Modal/Modal";
import { CourseModel } from "@/models/CourseModel";
import { UserModel } from "@/models/UserModel";
import { Input } from "@/components/ui/Input/Input";
import { TbClipboardPlus, TbUser } from "react-icons/tb";
import { Separator } from "@/components/ui/Separator/Separator";
import { MapArray } from "@/components/conditionals/MapArray";
import { Select } from "@/components/ui/Select/Select";
import React, { FormEvent, useState } from "react";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { UserNoteModel } from "@/models/UserNoteModel";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "../../../../../../utils/helper/FormHelper";
import { AxiosError, AxiosResponse } from "axios";
import toastHelper from "../../../../../../utils/helper/ToastHelper";
import StringHelper from "../../../../../../utils/helper/StringHelper";

type CreateUserNotePartialProps = {
    show: boolean;
    onClose: () => any;
    onCreate: (userNote: UserNoteModel) => any;
    courses: CourseModel[];
    user_id?: string;
};

export function UVCreateNoteModal(props: CreateUserNotePartialProps) {
    const [submitting, setSubmitting] = useState<boolean>(false);

    function createNote(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const formData = FormHelper.getEntries(e.target);
        axiosInstance
            .post("/administration/user/note", formData)
            .then((res: AxiosResponse) => {
                props.onCreate(res.data as UserNoteModel);
                toastHelper.success("Notiz erfolgreich erstellt");
                props.onClose();
            })
            .catch((err: AxiosError) => {
                toastHelper.error("Fehler beim Erstellen der Notiz");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <form onSubmit={createNote}>
            <Modal
                show={props.show}
                onClose={props.onClose}
                title={"Notiz erstellen"}
                footer={
                    <Button icon={<TbClipboardPlus size={20} />} type={"submit"} loading={submitting} color={COLOR_OPTS.PRIMARY} variant={"twoTone"}>
                        Erstellen
                    </Button>
                }>
                <input className={"hidden"} name={"user_id"} value={props.user_id} />

                <Select
                    labelSmall
                    defaultValue={"-1"}
                    name={"course_id"}
                    label={"Kurs"}
                    description={"Wähle einen Kurs aus um diese Notiz dem Kurs zuzuordnen"}>
                    <option value="-1" selected>
                        Kurs Auswählen
                    </option>
                    <MapArray
                        data={props.courses}
                        mapFunction={(value: CourseModel, index: number) => {
                            return (
                                <option key={index} value={value.id}>
                                    {value.name}
                                </option>
                            );
                        }}
                    />
                </Select>

                <TextArea className={"mt-5"} name={"content"} required labelSmall label={"Notiz"}></TextArea>
                <div className={"flex flex-col sm:flex-row"}></div>
            </Modal>
        </form>
    );
}
