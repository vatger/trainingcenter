import {QueryInterface} from "sequelize";

const now = new Date();

async function removeRoles(queryInterface: QueryInterface) {
    console.log("[RoleSeeder] Removing all roles");
    await queryInterface.bulkDelete("roles", {}, {});
    console.log("[RoleSeeder] Removed all roles");
}

async function removePermissions(queryInterface: QueryInterface) {
    console.log("[PermissionSeeder] Removing all permissions");
    await queryInterface.bulkDelete("permissions", {}, {});
    console.log("[PermissionSeeder] Removed all permissions");
}

const roleHasPerms = [
    {
        role: 0,
        permissions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    },
];

const allRoles = ["tech"];

const allPerms = [
    "mentor.acc.manage.own",

    "mentor.view",

    "lm.view",

    "atd.view",
    "atd.solo.delete", // Allow User to delete Solos (reset them)
    "atd.examiner.view",
    "atd.fast_track.view",
    "atd.atsim.view",
    "atd.training_stations.view",

    "tech.view",
    "tech.syslog.view",

    "tech.permissions.view",
    "tech.permissions.role.edit",
    "tech.permissions.role.view",
    "tech.permissions.perm.edit",
    "tech.permissions.perm.view",

    "tech.appsettings.view",
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await removePermissions(queryInterface);
        await removeRoles(queryInterface);

        ///////////////
        //// PERMS ////
        ///////////////
        let perms: any[] = [...allPerms];
        perms = perms.map(p => {
            console.log("\t\t Adding Permission: ", p);

            return {
                name: p,
                createdAt: now,
            };
        });

        const firstPermId: any = await queryInterface.bulkInsert("permissions", perms);
        const lastPermId = firstPermId.id + perms.length - 1;
        console.log("[PermissionSeeder] Inserted new permissions ", firstPermId, " - ", lastPermId, "- DONE\n");

        ///////////////
        //// ROLES ////
        ///////////////
        let roles: any[] = [...allRoles];
        roles = roles.map(p => {
            console.log("\t\t Adding Role: ", p);

            return {
                name: p,
                createdAt: now,
            };
        });

        const firstRoleId: any = await queryInterface.bulkInsert("roles", roles);
        const lastRoleId = firstRoleId + roles.length - 1;
        console.log("[RoleSeeder] Inserted new roles ", firstRoleId, " - ", lastRoleId, "- DONE\n");

        ///////////////////////////
        //// ROLES  -->  PERMS ////
        ///////////////////////////
        for (const v of roleHasPerms) {
            for (const p of v.permissions) {
                await queryInterface.bulkInsert("role_has_permissions", [
                    {
                        role_id: v.role + firstRoleId,
                        permission_id: p + firstPermId,
                        createdAt: now,
                    },
                ]);
            }
        }
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.bulkDelete("permissions", {}, {});
    },
};
