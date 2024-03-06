import { Request, Response } from "express";
import { Role } from "../../models/Role";
import { RoleHasPermissions } from "../../models/through/RoleHasPermissions";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { User } from "../../models/User";

/**
 * Gets all roles
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const roles = await Role.findAll();
    response.send(roles);
}

/**
 * Gets a role (and its information) from the role's ID
 * @param request
 * @param response
 */
async function getByID(request: Request, response: Response) {
    const role_id = request.params.role_id;

    const role = await Role.findOne({
        where: {
            id: role_id,
        },
        include: [
            {
                association: Role.associations.users,
                as: "users",
                attributes: ["id", "first_name", "last_name"],
                through: {
                    attributes: [],
                },
            },
            {
                association: Role.associations.permissions,
                as: "permissions",
                attributes: ["id", "name"],
                through: {
                    attributes: [],
                },
            },
        ],
    });

    response.send(role);
}

/**
 * Updates a role (really only the name tbh)
 * @param request
 * @param response
 */
async function update(request: Request, response: Response) {
    const role_id = request.params.role_id;
    const role_name = request.body.data.name;

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "name",
    //         validationObject: role_name,
    //         toValidate: [{ val: ValidationOptions.MIN_LENGTH, value: 1 }, { val: ValidationOptions.NON_NULL }],
    //     },
    // ]);

    let role = await Role.findOne({
        where: { id: role_id },
    });

    if (role == null) {
        response.status(500).send({ message: "Role not found" });
        return;
    }

    role = await role.update({
        name: role_name,
    });

    response.send(role);
}

/**
 * Remove a specific permission from this role
 * @param request
 * @param response
 */
async function removePermission(request: Request, response: Response) {
    const user: User = response.locals.user;
    const params = request.params;
    const body = request.body;

    PermissionHelper.checkUserHasPermission(user, "tech.permissions.role.edit", true);

    // const validation = ValidationHelper.validate([
    //     {
    //         name: "role_id",
    //         validationObject: role_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    //     {
    //         name: "permission_id",
    //         validationObject: permission_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }],
    //     },
    // ]);

    const permissionBelongsToRole = await RoleHasPermissions.findOne({
        where: {
            role_id: params.role_id,
            permission_id: body.permission_id,
        },
    });

    if (permissionBelongsToRole != null) {
        const res = await permissionBelongsToRole.destroy();
        response.send(res);
        return;
    }

    response.send({ message: "OK" });
}

/**
 * Adds a permission to a role
 * @param request
 * @param response
 */
async function addPermission(request: Request, response: Response) {
    const user: User = response.locals.user;
    const params = request.params;
    const body = request.body;

    PermissionHelper.checkUserHasPermission(user, "tech.permissions.role.edit", true);

    // const validate = ValidationHelper.validate([
    //     {
    //         name: "role_id",
    //         validationObject: role_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    //     {
    //         name: "permission_id",
    //         validationObject: permission_id,
    //         toValidate: [{ val: ValidationOptions.NON_NULL }, { val: ValidationOptions.NUMBER }],
    //     },
    // ]);

    const res = await RoleHasPermissions.create({
        role_id: Number(params.role_id),
        permission_id: Number(body.permission_id),
    });

    response.send(res);
}

export default {
    getAll,
    getByID,
    update,
    removePermission,
    addPermission,
};
