import { UserModel } from "@/models/UserModel";
import { LogTemplateElement, LogTemplateElementRating, LogTemplateElementSection, LogTemplateElementTextarea } from "@/models/TrainingLogTemplateModel";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import React from "react";
import { ParticipantStatus } from "@/pages/administration/mentor/training-session/session-log-create/TrainingSessionLogsCreate.view";
import { NavigateFunction } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import ToastHelper from "@/utils/helper/ToastHelper";

interface ITrainingSessionServiceProps {
    uuid: string;
    participants: UserModel[] | undefined;
    setSubmitting: React.Dispatch<boolean>;
    navigate: NavigateFunction;
    logTemplateElements: (LogTemplateElement & { uuid: string })[];
    participantValues: ParticipantStatus[] | undefined;
}

function SubmitTrainingLogs(data: ITrainingSessionServiceProps) {
    if (data.participants == null) {
        return;
    }

    data.setSubmitting(true);

    let result: {
        user_id: number;
        next_training_id: number;
        course_completed: boolean;
        log_public: boolean;
        passed: boolean;
        user_log: LogTemplateElement[] | string;
    }[] = [];

    // Loop through all participants
    for (let i = 0; i < data.participants.length; i++) {
        let user_log: LogTemplateElement[] = [];
        let user_passed = data.participantValues?.[i].passed ?? true;
        let log_public = data.participantValues?.[i].visible ?? true;
        let next_training_id = data.participantValues?.[i].nextTraining ?? -1;
        let course_completed = data.participantValues?.[i].course_completed ?? false;

        // For each element of the log templates...
        for (let j = 0; j < data.logTemplateElements.length; j++) {
            // The section has no value to add, so we can directly push it to the resulting array
            if (data.logTemplateElements[j].type == "section") {
                let log = { ...data.logTemplateElements[j] } as LogTemplateElementSection & { uuid?: string };
                delete log["uuid"];
                user_log.push({ ...log });
            }

            // If there is a textarea, we need to extract the text result and delete the UUID
            if (data.logTemplateElements[j].type == "textarea") {
                let log = { ...data.logTemplateElements[j] } as LogTemplateElementTextarea & { uuid?: string };
                log.text_content = data.participantValues?.[i].stringValues.get(data.logTemplateElements[j].uuid) ?? "N/A";

                delete log["uuid"];

                user_log.push({ ...log });
            }

            // If there is a rating, we need to extract the value and text and delete the UUID
            if (data.logTemplateElements[j].type == "rating") {
                let log = { ...data.logTemplateElements[j] } as LogTemplateElementRating & { uuid?: string };
                log.text_content = data.participantValues?.[i].stringValues.get(data.logTemplateElements[j].uuid) ?? "N/A";
                log.value = data.participantValues?.[i].progressValues.get(data.logTemplateElements[j].uuid) ?? 0;

                delete log["uuid"];

                user_log.push({ ...log });
            }
        }
        result.push({
            user_id: data.participants[i].id,
            log_public: log_public,
            passed: user_passed,
            user_log: JSON.stringify(user_log),
            next_training_id: next_training_id,
            course_completed: course_completed,
        });
    }

    axiosInstance
        .post(`/administration/training-session/log/${data.uuid}`, result)
        .then((res: AxiosResponse) => {
            ToastHelper.success("Logs erfolgreich erstellt");
            data.navigate("/administration/training-request/planned");
        })
        .catch((err: AxiosError) => {
            ToastHelper.error("Fehler beim erstellen der Logs");
        })
        .finally(() => data.setSubmitting(false));
}

export default {
    SubmitTrainingLogs,
};
