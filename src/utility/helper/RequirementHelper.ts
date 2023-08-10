import { User } from "../../models/User";

async function validateRequirement(user: User, requirement: string): Promise<boolean> {
    return true;
}

export default {
    validateRequirement,
};
