import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { Course } from "../../models/Course";
import { MentorGroupsBelongsToCourses } from "../../models/through/MentorGroupsBelongsToCourses";
import { HttpStatusCode } from "axios";
import { MentorGroup } from "../../models/MentorGroup";
import { UsersBelongsToCourses } from "../../models/through/UsersBelongsToCourses";
import { TrainingRequest } from "../../models/TrainingRequest";
import { sequelize } from "../../core/Sequelize";
import { TrainingTypesBelongsToCourses } from "../../models/through/TrainingTypesBelongsToCourses";
import { generateUUID } from "../../utility/UUID";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { Transaction } from "sequelize";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * The ICourseBody Interface is the type which all requests that wish to create or update a course must satisfy
 */
interface ICourseBody {
    name_de: string;
    name_en: string;
    description_de: string;
    description_en: string;
    active: boolean;
    self_enrol_enabled: boolean;
    training_type_id: string;
    mentor_group_id: string;
}

/**
 * Creates a new course within a given mentor group
 * @param request
 * @param response
 * @param next
 */
async function createCourse(request: Request, response: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();

    try {
        const user: User = response.locals.user;
        const body: ICourseBody = request.body as ICourseBody;

        Validator.validate(body, {
            name_de: [ValidationTypeEnum.NON_NULL],
            name_en: [ValidationTypeEnum.NON_NULL],
            description_de: [ValidationTypeEnum.NON_NULL],
            description_en: [ValidationTypeEnum.NON_NULL],
            active: [ValidationTypeEnum.NON_NULL],
            self_enrol_enabled: [ValidationTypeEnum.NON_NULL],
            training_type_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            mentor_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        // Check if user is allowed to create a course in this mentor group
        const mentorGroupID = Number(body.mentor_group_id);
        if (!(await user.canManageCourseInMentorGroup(mentorGroupID))) {
            throw new ForbiddenException("You don't have the required permission to create a course in this mentor group.", false);
        }

        const uuid = generateUUID();

        const course = await Course.create(
            {
                uuid: uuid,
                name: body.name_de,
                name_en: body.name_en,
                description: body.description_de,
                description_en: body.description_en,
                is_active: body.active,
                self_enrollment_enabled: body.self_enrol_enabled,
                initial_training_type: Number(body.training_type_id),
            },
            {
                transaction: transaction,
            }
        );

        await MentorGroupsBelongsToCourses.create(
            {
                mentor_group_id: mentorGroupID,
                course_id: course.id,
                can_edit_course: true,
            },
            {
                transaction: transaction,
            }
        );

        await TrainingTypesBelongsToCourses.create(
            {
                course_id: course.id,
                training_type_id: Number(body.training_type_id),
            },
            {
                transaction: transaction,
            }
        );

        await transaction.commit();
        response.status(HttpStatusCode.Created).send(course);
    } catch (e) {
        await transaction.rollback();
        next(e);
    }
}

/**
 * Validates and updates a course based on the request
 * @param request
 * @param response
 * @param next
 */
async function updateCourse(request: Request, response: Response, next: NextFunction) {
    type ICourseBodyWithUUID = ICourseBody & { course_uuid: string };

    try {
        const user: User = response.locals.user;
        const body: ICourseBodyWithUUID = request.body as ICourseBodyWithUUID;

        if (!(await user.canEditCourse(body.course_uuid))) {
            throw new ForbiddenException("You don't have the required permission to edit this course", false);
        }

        await Course.update(
            {
                name: body.name_de,
                name_en: body.name_en,
                description: body.description_de,
                description_en: body.description_en,
                is_active: body.active,
                self_enrollment_enabled: body.self_enrol_enabled,
                initial_training_type: Number(body.training_type_id),
            },
            {
                where: {
                    uuid: body.course_uuid,
                },
            }
        );

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a list of all courses
 * @param _request
 * @param response
 * @param next
 */
async function getAllCourses(_request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.course.view");

        const courses = await Course.findAll();
        response.send(courses);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets basic course information based on the provided course UUID.
 * This includes the initial training type used for this course
 * @param request
 * @param response
 * @param next
 */
async function getCourse(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        PermissionHelper.checkUserHasPermission(user, "lm.course.view");

        const params = request.params as { course_uuid: string };

        const course = await Course.findOne({
            where: {
                uuid: params.course_uuid,
            },
            include: [Course.associations.training_type],
        });

        if (course == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        response.send(course);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a list of users that are enrolled in this course.
 * @param request
 * @param response
 * @param next
 */
async function getCourseParticipants(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };
        if (!(await user.isMentorInCourse(params.course_uuid))) {
            throw new ForbiddenException("You are not a mentor in this course.");
        }

        const course = await Course.findOne({
            where: {
                uuid: params.course_uuid,
            },
            include: [Course.associations.users],
        });

        if (course == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        response.send(course.users);
    } catch (e) {
        next(e);
    }
}

/**
 * Removed a user from the specified course
 * @param request
 * @param response
 * @param next
 */
async function removeCourseParticipant(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };
        const body = request.body as { user_id: number };

        if (!(await user.isMentorInCourse(params.course_uuid))) {
            throw new ForbiddenException("You are not a mentor in this course.");
        }

        Validator.validate(body, {
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
        });

        const courseID = await Course.getIDFromUUID(params.course_uuid);
        if (courseID == -1) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        await UsersBelongsToCourses.destroy({
            where: {
                user_id: body.user_id,
                course_id: courseID,
            },
        });

        await TrainingRequest.destroy({
            where: {
                user_id: body.user_id,
                course_id: courseID,
            },
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a list of mentor groups that are associated with this course
 * This does not include the permission such as 'can_edit'
 *
 * Restricted to mentors of this course.
 * @param request
 * @param response
 * @param next
 */
async function getCourseMentorGroups(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };

        if (!(await user.isMentorInCourse(params.course_uuid))) {
            throw new ForbiddenException("You are not a mentor in this course.");
        }

        const course = await Course.findOne({
            where: {
                uuid: params.course_uuid,
            },
            include: [
                {
                    association: Course.associations.mentor_groups,
                    through: {
                        attributes: ["can_edit_course", "createdAt"],
                    },
                    include: [
                        {
                            association: MentorGroup.associations.users,
                            attributes: ["first_name", "last_name", "id"],
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                },
            ],
        });

        if (course == null) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        response.send(course.mentor_groups);
    } catch (e) {
        next(e);
    }
}

/**
 * Adds a mentor group with the specified information to the course
 * @param request
 * @param response
 * @param next
 */
async function addMentorGroupToCourse(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { course_uuid: string; mentor_group_id: number; can_edit: boolean };

        Validator.validate(body, {
            course_uuid: [ValidationTypeEnum.NON_NULL],
            mentor_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            can_edit: [ValidationTypeEnum.NON_NULL],
        });

        if (!(await user.canEditCourse(body.course_uuid))) {
            throw new ForbiddenException("You are not allowed to edit this course");
        }

        // If this returns -1, sequelize will complain due to a foreign constraint.
        // Therefore, no need to check at this point.
        const courseID = await Course.getIDFromUUID(body.course_uuid);

        await MentorGroupsBelongsToCourses.create({
            mentor_group_id: body.mentor_group_id,
            course_id: courseID,
            can_edit_course: body.can_edit,
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Removes a mentor group from the specified course
 * @param request
 * @param response
 * @param next
 */
async function removeMentorGroupFromCourse(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };
        const body = request.body as { mentor_group_id: number };

        Validator.validate(body, {
            course_uuid: [ValidationTypeEnum.NON_NULL],
            mentor_group_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            can_edit: [ValidationTypeEnum.NON_NULL],
        });

        if (!(await user.canEditCourse(params.course_uuid))) {
            throw new ForbiddenException("You are not allowed to edit this course");
        }

        const courseID = await Course.getIDFromUUID(params.course_uuid);
        if (courseID == -1) {
            response.sendStatus(HttpStatusCode.BadRequest);
            return;
        }

        await MentorGroupsBelongsToCourses.destroy({
            where: {
                course_id: courseID,
                mentor_group_id: body.mentor_group_id,
            },
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

/**
 * Returns a collection of training types associated with this course
 * @param request
 * @param response
 * @param next
 */
async function getCourseTrainingTypes(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };

        if (!(await user.isMentorInCourse(params.course_uuid))) {
            throw new ForbiddenException("You are not a mentor in this course.");
        }

        const course: Course | null = await Course.findOne({
            where: {
                uuid: params.course_uuid,
            },
            include: [Course.associations.training_types],
        });

        if (course == null || course.training_types == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        response.send(course.training_types);
    } catch (e) {
        next(e);
    }
}

/**
 * Adds a single training type to a course
 * @param request
 * @param response
 * @param next
 */
async function addCourseTrainingType(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };
        const body = request.body as { training_type_id: string };

        Validator.validate(body, {
            training_type_id: [ValidationTypeEnum.NON_NULL],
        });

        if (!(await user.canEditCourse(params.course_uuid))) {
            throw new ForbiddenException("You are not allowed to edit this course.");
        }

        const course_id = await Course.getIDFromUUID(params.course_uuid);

        await TrainingTypesBelongsToCourses.create({
            course_id: course_id,
            training_type_id: Number(body.training_type_id),
        });

        response.sendStatus(HttpStatusCode.Created);
    } catch (e) {
        next(e);
    }
}

/**
 * Removes a single training type from a course
 * @param request
 * @param response
 * @param next
 */
async function removeCourseTrainingType(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const params = request.params as { course_uuid: string };
        const body = request.body as { training_type_id: string };

        Validator.validate(body, {
            training_type_id: [ValidationTypeEnum.NON_NULL],
        });

        if (!(await user.canEditCourse(params.course_uuid))) {
            throw new ForbiddenException("You are not allowed to edit this course.");
        }

        const course_id = await Course.getIDFromUUID(params.course_uuid);

        await TrainingTypesBelongsToCourses.destroy({
            where: {
                course_id: course_id,
                training_type_id: Number(body.training_type_id),
            },
        });

        response.sendStatus(HttpStatusCode.NoContent);
    } catch (e) {
        next(e);
    }
}

export default {
    createCourse,
    updateCourse,
    getAllCourses,
    getCourse,
    getCourseParticipants,
    removeCourseParticipant,
    addMentorGroupToCourse,
    removeMentorGroupFromCourse,
    getCourseMentorGroups,

    getCourseTrainingTypes,
    addCourseTrainingType,
    removeCourseTrainingType,
};
