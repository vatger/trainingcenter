import { User } from "../User";
import { MentorGroup } from "../MentorGroup";
import { Role } from "../Role";
import { Permission } from "../Permission";
import { Course } from "../Course";

/**
 * Checks if the user as the specified role
 * @param role
 */
function hasRole(this: User, role: string): boolean {
    const roles: string[] = [];
    this.roles?.forEach((role: Role) => {
        roles.push(role.name);
    });

    return roles.includes(role);
}

/**
 * Checks if the user has the specified permission
 * @param permission
 */
function hasPermission(this: User, permission: string): boolean {
    const permissions: string[] = [];
    this.roles?.forEach((role: Role) => {
        role.permissions?.forEach((perm: Permission) => {
            permissions.push(perm.name.toLowerCase());
        });
    });

    return permissions.includes(permission.toLowerCase());
}

/**
 * Returns a list of mentor groups this user is associated with
 * Note: Permissions.txt within this mentor group are not considered!
 */
async function getMentorGroups(this: User): Promise<MentorGroup[]> {
    const user = await User.findOne({
        where: {
            id: this.id,
        },
        include: {
            association: User.associations.mentor_groups,
        },
    });

    return user?.mentor_groups ?? [];
}

/**
 * Returns a list of mentor groups this user is a group admin in
 */
async function getGroupAdminMentorGroups(this: User): Promise<MentorGroup[]> {
    const user = await User.findOne({
        where: {
            id: this.id,
        },
        include: {
            association: User.associations.mentor_groups,
            through: {
                where: {
                    group_admin: true,
                },
            },
        },
    });

    return user?.mentor_groups ?? [];
}

/**
 * Returns a list of mentor groups this user can manage courses
 * Manage in this context means, create, update, delete - although this might be reevaluated in the future
 */
async function getCourseCreatorMentorGroups(this: User): Promise<MentorGroup[]> {
    const user = await User.findOne({
        where: {
            id: this.id,
        },
        include: {
            association: User.associations.mentor_groups,
            through: {
                where: {
                    can_manage_course: true,
                },
            },
        },
    });

    return user?.mentor_groups ?? [];
}

/**
 * Checks if the current user can create a course in the specified mentor group
 * @param mentorGroupID
 */
async function canManageCourseInMentorGroup(this: User, mentorGroupID: number): Promise<boolean> {
    const mentorGroups = await this.getCourseCreatorMentorGroups();
    for (const mentorGroup of mentorGroups) {
        if (mentorGroup.id == mentorGroupID) {
            return true;
        }
    }

    return false;
}

/**
 * Checks if the user can edit the course with the specified UUID
 * This is the case if and only if:
 * 1. A user is in a mentor group of a course and has the 'can_manage_course' attribute
 * 2. This mentor group has the 'can_edit_course' attribute set
 * @param courseUUID
 */
async function canEditCourse(this: User, courseUUID: string): Promise<boolean> {
    // TODO: Find an overlap between 1 & 2 (above) and return a boolean if the case is true
    return true;
}

/**
 * Gets all courses which the current user is associated with (enrolled, completed, ...)
 */
async function getCourses(this: User): Promise<Course[]> {
    const user: User | null = await User.findOne({
        where: {
            id: this.id,
        },
        include: [User.associations.courses],
    });

    return user?.courses ?? [];
}

export default {
    hasRole,
    hasPermission,
    getMentorGroups,
    getGroupAdminMentorGroups,
    getCourseCreatorMentorGroups,
    canManageCourseInMentorGroup,
    canEditCourse,
    getCourses,
};