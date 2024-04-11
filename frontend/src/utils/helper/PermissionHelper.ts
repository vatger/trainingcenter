import { useAuthSelector } from "@/app/features/authSlice";

function hasPerm(requiredPermission: string) {
    const userPermissions = useAuthSelector().userPermissions;
    return userPermissions.includes(requiredPermission.toUpperCase());
}

export default {
    hasPerm,
};
