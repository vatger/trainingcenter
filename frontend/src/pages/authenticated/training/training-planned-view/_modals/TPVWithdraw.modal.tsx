import { Modal } from "@/components/ui/Modal/Modal";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { useNavigate } from "react-router-dom";
import React, { Dispatch } from "react";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { TbDoorExit } from "react-icons/tb";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { axiosInstance } from "@/utils/network/AxiosInstance";

type Props = {
    show: boolean;
    onClose: () => any;
    setSubmitting: Dispatch<boolean>;
    submitting: boolean;
    trainingSession?: TrainingSessionModel;
};

export function TPVWithdrawModal(props: Props) {
    const navigate = useNavigate();

    function withdrawFromSession() {
        if (props.trainingSession == null) {
            return;
        }

        props.setSubmitting(true);
        axiosInstance
            .delete(`/training-session/withdraw/${props.trainingSession.uuid}`)
            .then(() => {
                ToastHelper.success("Erfolgreich von Session abgemeldet");
                navigate("/training/planned");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim abmelden");
            })
            .finally(() => props.setSubmitting(false));
    }

    return (
        <Modal
            show={props.show}
            onClose={props.onClose}
            title={"Von Session Abmelden"}
            footer={
                <div className={"flex justify-end mt-5"}>
                    <Button
                        icon={<TbDoorExit size={20} />}
                        loading={props.submitting}
                        variant={"twoTone"}
                        onClick={() => withdrawFromSession()}
                        color={COLOR_OPTS.DANGER}>
                        Abmelden
                    </Button>
                </div>
            }>
            <p>
                Bist du sicher, dass du dich von deiner geplanten Session am{" "}
                <strong>{dayjs.utc(props.trainingSession?.date).format(Config.DATETIME_FORMAT)}</strong> für den Kurs{" "}
                <strong>{props.trainingSession?.course?.name}</strong> abmelden möchtest? Solltest du der einzige Teilnehmer in dieser Session gewesen sein,
                wird diese gelöscht und deine Trainingsanfrage wird erhält wieder den Status 'angefragt'.
            </p>
        </Modal>
    );
}
