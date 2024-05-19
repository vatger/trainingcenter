import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import _UserAdminValidator from "./_UserAdmin.validator";
import { EndorsementGroupsBelongsToUsers } from "../../models/through/EndorsementGroupsBelongsToUsers";
import { HttpStatusCode } from "axios";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import { createEndorsement } from "../../libraries/vateud/VateudCoreLibrary";

async function addEndorsement(request: Request, response: Response, next: NextFunction) {
    try {
        const requestingUser: User = response.locals.user;
        const body = request.body as { user_id: string; endorsement_group_id: string };
        _UserAdminValidator.validateCreateRequest(body);

        const user = await User.findOne({
            where: {
                id: Number(body.user_id),
            },
            include: [User.associations.endorsement_groups],
        });
        if(!user) {
            throw new Error();
        }

        const endorsementGroup = await EndorsementGroup.findOne({where: {
                id: Number(body.endorsement_group_id),
            },})
        if(!endorsementGroup) {
            throw new Error();
        }

        const userEndorsement = await EndorsementGroupsBelongsToUsers.create({
            user_id: user.id,
            endorsement_group_id: endorsementGroup.id,
            created_by: requestingUser.id,
        });


        const success = await createEndorsement(userEndorsement, endorsementGroup);

        if(!success){
            await userEndorsement.destroy();
            throw new Error();
        }


        response.status(HttpStatusCode.Created).send(user?.endorsement_groups ?? []);
    } catch (e) {
        next(e);
    }
}

export default {
    addEndorsement,
};
