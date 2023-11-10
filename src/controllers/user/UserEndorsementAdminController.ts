import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import _UserAdminValidator from "./_UserAdmin.validator";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import { HttpStatusCode } from "axios";

async function addEndorsement(request: Request, response: Response, next: NextFunction) {
    try {
        const requestingUser: User = request.body.user;
        const body = request.body as { user_id: string; endorsement_group_id: string };
        _UserAdminValidator.validateCreateRequest(body);

        await EndorsementGroupsBelongsToUsers.create({
            user_id: Number(body.user_id),
            endorsement_group_id: Number(body.endorsement_group_id),
            created_by: requestingUser.id,
        });

        const user = await User.findOne({
            where: {
                id: body.user_id,
            },
            include: [User.associations.endorsement_groups],
        });

        response.status(HttpStatusCode.Created).send(user?.endorsement_groups ?? []);
    } catch (e) {
        next(e);
    }
}

export default {
    addEndorsement,
};
