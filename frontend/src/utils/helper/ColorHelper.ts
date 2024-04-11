import { COLOR_OPTS } from "../../assets/theme.config";

const colors = {
    INDIGO: "rgb(79,70,229)",
    DANGER: "rgb(220 38 38)",
    SUCCESS: "rgb(5 150 105)",
};

export function getRgbFromColorOpt(color_opt: COLOR_OPTS | undefined) {
    switch (color_opt) {
        case COLOR_OPTS.PRIMARY:
            return colors.INDIGO;

        case COLOR_OPTS.DANGER:
            return colors.DANGER;

        case COLOR_OPTS.SUCCESS:
            return colors.SUCCESS;

        default:
            return colors.INDIGO;
    }
}

export function getColorClassBasedOnPercentage(percentage: number, noColorIfOk?: boolean) {
    if (percentage < 70) return noColorIfOk ? "" : "text-success";

    if (percentage < 85) return "text-warning";

    return "text-danger";
}
