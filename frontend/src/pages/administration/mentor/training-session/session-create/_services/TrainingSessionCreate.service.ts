import { UserModel } from "@/models/UserModel";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { Dispatch, FormEvent } from "react";
import FormHelper from "@/utils/helper/FormHelper";
import { AxiosResponse } from "axios";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import { NavigateFunction } from "react-router-dom";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";

interface AddUserPropsT {
    participants: UserModel[];
    setParticipants: Dispatch<UserModel[]>;
    newParticipantId: string;
    setNewParticipantId: Dispatch<string>;
    setLoadingUser: Dispatch<boolean>;
}

async function addUser(opts: AddUserPropsT) {
    if (opts.participants.find(u => u.id == Number(opts.newParticipantId)) || opts.newParticipantId.length < 4) {
        return;
    }

    opts.setLoadingUser(true);
    axiosInstance
        .get(`/administration/user/data/basic`, {
            params: { user_id: opts.newParticipantId },
        })
        .then(res => {
            let p = [...opts.participants];
            const user = res.data as UserModel;
            p.push(user);
            opts.setParticipants(p);
            opts.setNewParticipantId("");
        })
        .catch(() => {
            ToastHelper.error(`Fehler beim laden des Benutzers ${opts.newParticipantId}`);
        })
        .finally(() => opts.setLoadingUser(false));
}

interface CreateSessionPropsT {
    event: FormEvent<HTMLFormElement>;
    setSubmitting: Dispatch<boolean>;
    participants: UserModel[];
    navigate: NavigateFunction;
    fromRequest: boolean;
    trainingRequest?: TrainingRequestModel;
}

async function createSession(opts: CreateSessionPropsT) {
    opts.event.preventDefault();
    if (opts.fromRequest && opts.trainingRequest == null) return;
    opts.setSubmitting(true);

    const formData = FormHelper.getEntries(opts.event.target);
    FormHelper.set(
        formData,
        "user_ids",
        opts.participants.map(u => u.id)
    );
    // Adds fields that aren't there if we're creating it from a request
    if (opts.fromRequest) {
        FormHelper.set(formData, "course_uuid", opts.trainingRequest!.course?.uuid);
        FormHelper.set(formData, "training_type_id", opts.trainingRequest!.training_type_id);
    }

    axiosInstance
        .post("/administration/training-session/training", formData)
        .then((res: AxiosResponse) => {
            const session = res.data as TrainingSessionModel;
            ToastHelper.success("Session wurde erfolgreich erstellt");
            opts.navigate(`/administration/training-request/planned/${session.uuid}`);
        })
        .catch(() => {
            ToastHelper.error("Fehler beim Erstellen der Session");
        })
        .finally(() => opts.setSubmitting(false));
}

export default {
    addUser,
    createSession,
};
