import { Request, Response } from "express";
import { User } from "../../models/User";

async function getData(request: Request, response: Response) {
    const reqUser: User = request.body.user;

    const user = await User.scope("sensitive").findOne({
        where: {
            id: reqUser.id,
        },
        include: {
            all: true,
        },
    });

    response.send(user);
}

export default {
    getData,
};
