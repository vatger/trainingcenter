import { QueryInterface } from "sequelize";
import dayjs from "dayjs";

const allPerms = [
    "mentor.acc.manage.own",

    "mentor.view",

    "lm.view",
    "lm.action_requirements.view",
    "lm.course.view",

    "lm.mentor_group.create",
    "lm.mentor_group.edit",
    "lm.mentor_group.view",

    "lm.endorsement_groups.view",
    "lm.endorsement_groups.edit",
    "lm.endorsement_groups.create",

    "lm.training_types.view",

    "atd.view",
    "atd.solo.delete",
    "atd.examiner.view",
    "atd.fast_track.view",
    "atd.atsim.view",
    "atd.training_stations.view",

    "atd.log_template.view",
    "atd.log_template.edit",
    "atd.log_template.create",

    "tech.view",
    "tech.syslog.view",

    "tech.role_management.view",
    "tech.role_management.edit",
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
