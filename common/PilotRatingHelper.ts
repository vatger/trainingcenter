export function getPilotRatingShort(rating: number) {
    switch (rating) {
        case 0:
            return "NEW";

        case 1:
            return "PPL";

        case 3:
            return "IR";

        case 7:
            return "CMEL";

        case 15:
            return "ATPL";

        default:
            return "N/A";
    }
}

export function getPilotRatingLong(rating: number) {
    switch (rating) {
        case 0:
            return "Basic Member";

        case 1:
            return "Private Pilot License";

        case 3:
            return "Instrument Rating";

        case 7:
            return "Commercial Multi-Engine License";

        case 15:
            return "Airline Transport Pilot License";

        default:
            return "N/A";
    }
}
