import { COLOR_OPTS } from "../../../assets/theme.config";

export function getBadgeColorClass(color?: COLOR_OPTS): string {
    let classString = "";

    switch (color) {
        case COLOR_OPTS.PRIMARY:
            classString += "bg-indigo-50 text-indigo-500 dark:bg-indigo-500 dark:bg-opacity-20 dark:text-indigo-50";
            break;

        case COLOR_OPTS.SUCCESS:
            classString += "bg-emerald-50 text-emerald-500 dark:bg-emerald-500 dark:bg-opacity-20 dark:text-emerald-50";
            break;

        case COLOR_OPTS.DANGER:
            classString += "bg-red-50 text-red-500 dark:bg-red-500 dark:bg-opacity-20 dark:text-red-50";
            break;

        case COLOR_OPTS.WARNING:
            classString += "bg-amber-50 text-amber-500 dark:bg-amber-500 dark:bg-opacity-20 dark:text-amber-50";
            break;

        default:
            classString += "bg-gray-100 text-gray-500";
            break;
    }

    return classString;
}
