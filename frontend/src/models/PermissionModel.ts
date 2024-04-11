import { UserModel } from "./UserModel";

export type RoleModel = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
    permissions?: PermissionModel[];

    users?: UserModel[];
};

export type PermissionModel = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
};
