import { User } from "../../models/User";
import { EEnrolRequirementType, ICourseEnrolRequirement } from "../../../../common/Course.model";

async function validateRequirement(user: User, requirement: ICourseEnrolRequirement): Promise<boolean> {
    switch (requirement.type) {
        case EEnrolRequirementType.MIN_RATING:
            return (user.user_data?.rating_atc ?? -100) >= Number(requirement.value);

        case EEnrolRequirementType.MAX_RATING:
            return (user.user_data?.rating_atc ?? 100) <= Number(requirement.value);

        case EEnrolRequirementType.EXACT_RATING:
            return (user.user_data?.rating_atc ?? -100) == Number(requirement.value);

        default:
            return false;
    }
}

export default {
    validateRequirement,
};
