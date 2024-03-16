import { QueryInterface } from "sequelize";
import { Role } from "../../src/models/Role";
import { Permission } from "../../src/models/Permission";
import { RoleHasPermissions } from "../../src/models/through/RoleHasPermissions";
import { User } from "../../src/models/User";
import { RoleBelongsToUsers } from "../../src/models/through/RoleBelongsToUsers";

const DEFAULT_USER_ID = 10000010;

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.bulkDelete("roles", {}, {});
        await queryInterface.bulkDelete("role_belongs_to_users", {}, {});
        await queryInterface.bulkDelete("role_has_permissions", {}, {});

        const role = await Role.create({ name: "tech" });
        const permissions = await Permission.findAll();

        for (const perm of permissions) {
            console.log(`Assigning Perm: ${perm.id} -> ${role?.id}`);
            await RoleHasPermissions.create({
                role_id: role?.id,
                permission_id: perm.id,
            });
        }

        const user = await User.findOne({
            where: { id: DEFAULT_USER_ID },
        });
        if (user) {
            await RoleBelongsToUsers.create({
                user_id: user.id,
                role_id: role.id,
            });
        }
    },
};
