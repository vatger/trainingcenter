import { UserTrainingSessionModel } from "@/models/TrainingSessionModel";
import React, { ReactElement } from "react";
import { TbCalendar, TbCheck, TbX } from "react-icons/tb";

/**
 * Returns the color to be used for the timeline icon.
 * @param userTrainingSession
 */
function getStatusColor(userTrainingSession: UserTrainingSessionModel): string {
    if (userTrainingSession.training_session_belongs_to_users?.passed == null) {
        return "bg-gray-500 dark:bg-gray-500";
    }

    if (userTrainingSession.training_session_belongs_to_users?.passed == true) {
        return "bg-emerald-500 dark:bg-emerald-600";
    }

    return "bg-red-500 dark:bg-red-700";
}

/**
 * Returns the badge to be used for the timeline icon
 * @param userTrainingSession
 */
function getStatusBadge(userTrainingSession: UserTrainingSessionModel): ReactElement {
    if (userTrainingSession.training_session_belongs_to_users?.passed == null) {
        return <TbCalendar className={"m-[5px]"} size={19} />;
    }

    if (userTrainingSession.training_session_belongs_to_users?.passed == true) {
        return <TbCheck className={"m-[5px]"} size={19} />;
    }

    return <TbX className={"m-[5px]"} size={19} />;
}

export default {
    getStatusBadge,
    getStatusColor,
};
