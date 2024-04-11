import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";
import { HttpStatusCode } from "axios";
import { EndorsementGroup } from "../../models/EndorsementGroup";
import { TrainingSession } from "../../models/TrainingSession";
import dayjs from "dayjs";

async function getOverviewStatistics(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        const userInformation = await User.findOne({
            where: {
                id: user.id,
            },
            include: [
                {
                    association: User.associations.training_sessions,
                    through: {
                        attributes: [],
                    },
                    include: [TrainingSession.associations.course, TrainingSession.associations.training_station],
                },
                {
                    association: User.associations.endorsement_groups,
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            association: EndorsementGroup.associations.stations,
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                },
            ],
        });

        if (userInformation == null) {
            response.sendStatus(HttpStatusCode.NotFound);
            return;
        }

        const sessions = userInformation.training_sessions as TrainingSession[];
        const completedSessions = sessions?.filter(session => session.completed);
        const upcomingSessions = sessions.filter(session => !session.completed && dayjs.utc(session.date).isAfter(dayjs.utc()));

        response.send({
            count: sessions?.length ?? 0,
            completedCount: completedSessions?.length ?? 0,
            upcomingSessions: upcomingSessions,
            endorsementGroups: userInformation.endorsement_groups ?? [],
        });
    } catch (e) {
        next(e);
    }
}

export default {
    getOverviewStatistics,
};
