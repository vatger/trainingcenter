import { getAtcRatingShort } from "@common/AtcRatingHelper";
import { EEnrolRequirementType, ICourseEnrolRequirement } from "@common/Course.model";

function getDescription(requirement: ICourseEnrolRequirement) {
    switch (requirement.type) {
        case EEnrolRequirementType.MIN_RATING:
            return (
                <>
                    Dein ATC Rating beträgt <strong>mindestens {getAtcRatingShort(Number(requirement.value))}</strong>
                </>
            );

        case EEnrolRequirementType.MAX_RATING:
            return (
                <>
                    Dein ATC Rating beträgt <strong>höchstens {getAtcRatingShort(Number(requirement.value))}</strong>
                </>
            );

        case EEnrolRequirementType.EXACT_RATING:
            return (
                <>
                    Dein ATC Rating <strong>entspricht {getAtcRatingShort(Number(requirement.value))}</strong>
                </>
            );

        case EEnrolRequirementType.MIN_HOURS_STATION:
            return (
                <>
                    Du hast <strong>mindestens {requirement.parameters["_atc_station_regex"]} Stunden</strong> auf der Station{" "}
                    <strong>{requirement.value}</strong>
                </>
            );

        default:
            return <>Unbekannt</>;
    }
}

export default {
    getDescription,
};
