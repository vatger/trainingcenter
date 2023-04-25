import { Course } from "../Course";
import { TrainingType } from "../TrainingType";
import Logger, { LogLevels } from "../../utility/Logger";
import { MentorGroup } from "../MentorGroup";
import { MentorGroupsBelongsToCourses } from "../through/MentorGroupsBelongsToCourses";
import { User } from "../User";
import { UsersBelongsToCourses } from "../through/UsersBelongsToCourses";
import { CourseSkillTemplate } from "../CourseSkillTemplate";
import { CourseInformation } from "../CourseInformation";

export function registerCourseAssociations() {
    //
    // Course -> TrainingType
    //
    Course.hasOne(TrainingType, {
        as: "training_type",
        foreignKey: "id",
        sourceKey: "initial_training_type",
    });

    //
    // Course -> MentorGroups
    //
    Course.belongsToMany(MentorGroup, {
        as: "mentor_groups",
        through: MentorGroupsBelongsToCourses,
        foreignKey: "course_id",
        otherKey: "mentor_group_id",
    });

    //
    // Course -> CourseSkills
    //
    Course.hasOne(CourseSkillTemplate, {
        as: "skill_template",
        foreignKey: "id",
        sourceKey: "skill_template_id",
    });

    //
    // MentorGroups <- Course
    //
    MentorGroup.belongsToMany(Course, {
        as: "courses",
        through: MentorGroupsBelongsToCourses,
        foreignKey: "mentor_group_id",
        otherKey: "course_id",
    });

    //
    // Course -> User
    //
    Course.belongsToMany(User, {
        as: "users",
        through: UsersBelongsToCourses,
        foreignKey: "course_id",
        otherKey: "user_id",
    });

    //
    // User -> Course
    //
    User.belongsToMany(Course, {
        as: "courses",
        through: UsersBelongsToCourses,
        foreignKey: "user_id",
        otherKey: "course_id",
    });

    //
    // UsersBelongsToCourses -> TrainingType
    //
    UsersBelongsToCourses.hasOne(TrainingType, {
        as: "training_type_next",
        foreignKey: "id",
        sourceKey: "next_training_type",
    });

    //
    // UserBelongsToCourses -> Course
    //
    UsersBelongsToCourses.hasOne(Course, {
        as: "course",
        foreignKey: "id",
        sourceKey: "course_id",
    });

    Course.hasOne(CourseInformation, {
        as: "information",
        foreignKey: "course_id",
        sourceKey: "id",
    });

    CourseInformation.belongsTo(Course, {
        as: "course",
        foreignKey: "course_id",
        targetKey: "id",
    });

    Logger.log(LogLevels.LOG_INFO, "[CourseAssociations]");
}
