import { QueryInterface } from "sequelize";
import dayjs from "dayjs";

const allPerms = [
    "mentor.acc.manage.own",

    "mentor.view",

    "lm.view",

    "atd.view",
    "atd.solo.delete",
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
    "tech.joblog.view",
];

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.bulkDelete("permissions", {}, {});

        const perms = allPerms.map(perm => ({
            name: perm,
            createdAt: dayjs().toDate(),
        }));

        await queryInterface.bulkInsert("permissions", perms);
    },
};
