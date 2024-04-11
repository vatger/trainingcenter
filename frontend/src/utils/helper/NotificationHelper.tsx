import { NotificationModel } from "@/models/NotificationModel";
import { TbAlertTriangle, TbCheck, TbCircleCheck, TbClipboard, TbDoorExit, TbTrash } from "react-icons/tb";
import { TLanguage } from "@/app/features/settingsSlice";

function convertNotificationContent(notification: NotificationModel | undefined, language: TLanguage): string {
    if (notification == null) return "";

    let s = notification.content_de;

    if (language == "en") {
        s = notification.content_en;
    }

    return s;
}

function getIconByString(size: number, s?: string, className?: string) {
    switch (s?.toLowerCase()) {
        case "trash":
            return <TbTrash className={className} size={size} />;

        case "door-exit":
            return <TbDoorExit className={className} size={size} />;

        case "alert-triangle":
            return <TbAlertTriangle className={className} size={size} />;

        case "circle-check":
            return <TbCircleCheck className={className} size={size} />;

        case "check":
            return <TbCheck className={className} size={size} />;

        default:
            return <TbClipboard className={className} size={size} />;
    }
}

function getIconColorBySeverity(s: "default" | "info" | "success" | "danger") {
    switch (s.toLowerCase()) {
        case "default":
            return "bg-indigo-500 dark:bg-indigo-600";

        case "info":
            return "bg-cyan-500 dark:bg-cyan-600";

        case "success":
            return "bg-emerald-500 dark:bg-emerald-600";

        case "danger":
            return "bg-red-500 dark:bg-red-600";
    }
}

export default {
    getIconByString,
    getIconColorBySeverity,
    convertNotificationContent,
};
