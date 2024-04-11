export const enum E_VATSIM_RATING {
    INAC = -1,
    SUS,
    OBS,
    S1,
    S2,
    S3,
    C1,
    C2,
    C3,
    I1,
    I2,
    I3,
    SUP,
    ADM,
}

export function getAtcRatingShort(rating: number) {
    switch (rating) {
        case -1:
            return "INAC";

        case 0:
            return "SUS";

        case 1:
            return "OBS";

        case 2:
            return "S1";

        case 3:
            return "S2";

        case 4:
            return "S3";

        case 5:
            return "C1";

        case 6:
            return "C2";

        case 7:
            return "C3";

        case 8:
            return "I1";

        case 9:
            return "I2";

        case 10:
            return "I3";

        case 11:
            return "SUP";

        case 12:
            return "ADM";

        default:
            return "N/A";
    }
}

export function getAtcRatingLong(rating: number) {
    switch (rating) {
        case -1:
            return "Inactive";

        case 0:
            return "Suspended";

        case 1:
            return "Observer";

        case 2:
            return "Tower Trainee";

        case 3:
            return "Tower Controller";

        case 4:
            return "Senior Student";

        case 5:
            return "Enroute Controller";

        case 6:
            return "Controller 2 (not in use)";

        case 7:
            return "Senior Controller";

        case 8:
            return "Instructor";

        case 9:
            return "Instructor 2 (not in use)";

        case 10:
            return "Senior Instructor";

        case 11:
            return "Supervisor";

        case 12:
            return "Administrator";

        default:
            return "N/A";
    }
}

export function getAtcRatingCombined(rating: number | undefined): string {
    if (rating == null) return "Keine Angabe";

    const short = getAtcRatingShort(rating);
    const long = getAtcRatingLong(rating);
    return `${short} (${long})`;
}
