import { Alert } from "../../../components/ui/Alert/Alert";
import { TYPE_OPTS } from "../../../assets/theme.config";
import React from "react";

const welcomeText = (
    <span className={"max-w-[320px] md:max-w-[450px] mx-auto"}>
        Herzlich Willkommen im VATSIM Germany Trainingscenter. Hier kannst Du dein Trainingsfortschritt innerhalb der vACC Germany verwalten. Melde dich unten
        an um loszulegen.
    </span>
);

export function renderMessages() {
    const url = new URL(window.location.toString());

    if (url.searchParams.get("sinv") != null) {
        return (
            <>
                <Alert className={"mb-5"} rounded type={TYPE_OPTS.WARNING} showIcon>
                    Deine Session ist abgelaufen. Melde dich bitte erneut an.
                </Alert>
                {welcomeText}
            </>
        );
    }

    if (url.searchParams.get("logout") != null) {
        return (
            <>
                <Alert className={"mb-5"} rounded type={TYPE_OPTS.SUCCESS} showIcon>
                    Du wurdest erfolgreich abgemeldet. Bis zum nächsten Mal!
                </Alert>
                {welcomeText}
            </>
        );
    }

    // If all is good, we render the welcome text
    return welcomeText;
}
