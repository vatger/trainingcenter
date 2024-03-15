import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { EndorsementGroup } from "../../models/EndorsementGroup";

async function getData(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        // TODO: Add some includes here
        const foundUser = await User.scope("sensitive").findOne({
            where: {
                id: user.id,
            },
            include: [
                User.associations.user_data,
                User.associations.user_settings,
                {
                    association: User.associations.user_solo,
                    attributes: {
                        exclude: ["id", "created_by", "solo_used", "vateud_solo_id", "createdAt", "updatedAt"],
                    },
                },
                {
                    association: User.associations.mentor_groups,
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"],
                    },
                    through: {
                        attributes: ["group_admin", "can_manage_course"],
                    },
                },
                {
                    association: User.associations.mentor_sessions,
                    attributes: {
                        exclude: ["id", "uuid", "cpt_examiner_id", "cpt_atsim_passed", "training_station_id", "training_type_id", "createdAt", "updatedAt"],
                    },
                },
                {
                    association: User.associations.endorsement_groups,
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"],
                    },
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            association: EndorsementGroup.associations.stations,
                            attributes: ["callsign"],
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                },
                {
                    association: User.associations.training_sessions,
                    attributes: ["completed", "date", "mentor_id"],
                    through: {
                        attributes: [],
                    },
                },
                {
                    association: User.associations.training_requests,
                    attributes: ["comment", "status", "expires", "createdAt"],
                },
                {
                    association: User.associations.training_logs,
                    attributes: ["content", "author_id", "createdAt"],
                    through: {
                        attributes: [],
                    },
                },
                {
                    association: User.associations.courses,
                    attributes: ["name"],
                    through: {
                        attributes: ["completed", "createdAt"],
                    },
                },
                {
                    association: User.associations.fast_track_requests,
                    attributes: ["rating", "status", "createdAt"],
                },
                {
                    association: User.associations.roles,
                    attributes: ["id"],
                    through: {
                        attributes: [],
                    },
                },
                {
                    association: User.associations.user_notes,
                    attributes: ["author_id", "content", "createdAt"],
                },
            ],
        });

        response.send(foundUser);
    } catch (e) {
        next(e);
    }
}

export default {
    getData,
};
