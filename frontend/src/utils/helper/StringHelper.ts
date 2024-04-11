import { UserModel } from "@/models/UserModel";

function capitalize(string?: string) {
    if (string == null) return "";

    // Force full capitalization of CPT
    if (string.toLowerCase() == "cpt") {
        return "CPT";
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getUserFullName(user?: UserModel) {
    return user?.first_name == null ? "N/A" : `${user?.first_name} ${user?.last_name}`;
}

function getUserFullNameAndCID(user?: UserModel) {
    return user?.first_name == null ? "N/A" : `${user?.first_name} ${user?.last_name} (${user.id})`;
}

export default { capitalize, getUserFullName, getUserFullNameAndCID };
