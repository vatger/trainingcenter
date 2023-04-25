import { Request, Response } from "express";
import ValidationHelper, { ValidationOptions } from "../../utility/helper/ValidationHelper";
import { UserNote } from "../../models/UserNote";

/**
 * Gets the specified user's notes that are not linked to a course, i.e. all those, that all mentors can see
 * @param request
 * @param response
 */
async function getGeneralUserNotes(request: Request, response: Response) {
    const user_id = request.query.user_id?.toString();

    const validation = ValidationHelper.validate([
        {
            name: "user_id",
            validationObject: user_id,
            toValidate: [{ val: ValidationOptions.NON_NULL }],
        },
    ]);

    if (validation.invalid) {
        response.status(400).send({ validation: validation.message, validation_failed: validation.invalid });
        return;
    }

    const notes = await UserNote.findAll({
        where: {
            user_id: user_id,
            course_id: null,
        },
        include: {
            association: UserNote.associations.user,
            attributes: ["id", "first_name", "last_name"],
        },
    });

    response.send(notes);
}

export default {
    getGeneralUserNotes,
};
