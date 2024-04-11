import { getAtcRatingShort } from "@/utils/helper/vatsim/AtcRatingHelper";

function getDescription(short: string) {
    const str = short.split(":");

    switch (str[0].toLowerCase()) {
        case "min_rating":
            if (str.length < 1) return "N/A";
            return `Dein ATC Rating beträgt mindestens ${getAtcRatingShort(Number(str[1]))}`;

        case "guest":
            return `Du bist kein Mitglied von VATSIM Germany`;
    }
}

export default {
    getDescription,
};
