import { NextFunction, Request, Response } from "express";
import { UserNote } from "../../models/UserNote";
import { User } from "../../models/User";
import { generateUUID } from "../../utility/UUID";
import Validator, { ValidationTypeEnum } from "../../utility/Validator";
import { HttpStatusCode } from "axios";
import PermissionHelper from "../../utility/helper/PermissionHelper";
import { Course } from "../../models/Course";
import { ForbiddenException } from "../../exceptions/ForbiddenException";

/**
 * Gets the specified user's notes that are not linked to a course, i.e. all those, that all mentors can see
 * @param request
 * @param response
 * @param next
 */
async function getGeneralUserNotes(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const query = request.query as { user_id: string };

        PermissionHelper.checkUserHasPermission(user, "notes.view");

        const notes: UserNote[] = await UserNote.findAll({
            where: {
                user_id: query.user_id,
                course_id: null,
            },
            include: {
                association: UserNote.associations.author,
                attributes: ["id", "first_name", "last_name"],
            },
        });

        response.send(notes);
    } catch (e) {
        next(e);
    }
}

/**
 * Gets all the notes of the requested user by the specified course_id
 * @param request
 * @param response
 * @param next
 */
async function getNotesByCourseID(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const query = request.query as { courseID: string; userID: string };

        PermissionHelper.checkUserHasPermission(user, "notes.view");
        const courseUUID = await Course.getUUIDFromID(query.courseID);
        if (!(await user.isMentorInCourse(courseUUID))) {
            throw new ForbiddenException("You are not a mentor of this course");
        }

        const notes: UserNote[] = await UserNote.findAll({
            where: {
                user_id: query.userID?.toString(),
                course_id: query.courseID?.toString(),
            },
            include: {
                association: UserNote.associations.author,
                attributes: ["id", "first_name", "last_name"],
            },
        });

        response.send(notes);
    } catch (e) {
        next(e);
    }
}

/**
 * Creates a new user note
 * @param request
 * @param response
 * @param next
 */
async function createUserNote(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;
        const body = request.body as { user_id: string; content: string; course_id?: string };

        PermissionHelper.checkUserHasPermission(user, "notes.create");

        if (body.course_id != null) {
            const courseUUID = await Course.getUUIDFromID(body.course_id);
            if (!(await user.isMentorInCourse(courseUUID))) {
                throw new ForbiddenException("You are not a mentor of this course");
            }
        }

        Validator.validate(body, {
            user_id: [ValidationTypeEnum.NON_NULL, ValidationTypeEnum.NUMBER],
            content: [ValidationTypeEnum.NON_NULL],
        });

        const note: UserNote = await UserNote.create({
            uuid: generateUUID(),
            user_id: Number(body.user_id),
            course_id: request.body.course_id == "-1" ? null : request.body.course_id,
            content: request.body.content.toString(),
            author_id: user.id,
        });

        const noteWithAuthor: UserNote | null = await note.getAuthor();

        response.status(HttpStatusCode.Created).send(noteWithAuthor);
    } catch (e) {
        next(e);
    }
}

export default {
    getGeneralUserNotes,
    createUserNote,
    getNotesByCourseID,
};
