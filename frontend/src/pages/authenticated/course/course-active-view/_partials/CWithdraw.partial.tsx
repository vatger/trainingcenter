import { Modal } from "@/components/ui/Modal/Modal";
import { CourseModel } from "@/models/CourseModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import React, { useState } from "react";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { Form, useNavigate } from "react-router-dom";
import { TbTrash } from "react-icons/tb";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";

type WithdrawFromCoursePartialProps = {
    show: boolean;
    onClose: () => any;
    course?: CourseModel;
};

export function CWithdrawPartial(props: WithdrawFromCoursePartialProps) {
    const navigate = useNavigate();
    const [withdrawing, setWithdrawing] = useState<boolean>(false);

    function withdrawFromCourse() {
        setWithdrawing(true);

        const formData = new FormData();
        FormHelper.set(formData, "course_id", props.course?.id);

        axiosInstance
            .delete("/course/withdraw", {
                data: formData,
            })
            .then(() => {
                ToastHelper.success("Erfolgreich vom Kurs abgemeldet");
                navigate("/course/active");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Abmelden aus dem Kurs");
            })
            .finally(() => {
                setWithdrawing(false);
            });
    }

    return (
        <Modal
            show={props.show}
            onClose={props.onClose}
            title={"Vom Kurs Abmelden"}
            footer={
                <Button loading={withdrawing} variant={"twoTone"} onClick={withdrawFromCourse} icon={<TbTrash size={20} />} color={COLOR_OPTS.DANGER}>
                    Abmelden
                </Button>
            }>
            <p>
                Bist du sicher, dass du dich vom Kurs <strong>{props.course?.name}</strong> abmelden möchtest? Diese Aktion lässt sich nicht rückgängig machen
                und hat zur Folge, dass dein gesamter Fortschritt in diesem gelöscht wird. Alle in diesem Kurs aktiven Trainingsanfragen verfallen. Geplante
                Trainings die in diesem Kurs stattfinden werden ebenfalls entfernt.
            </p>
        </Modal>
    );
}
