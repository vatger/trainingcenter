import { NextFunction, Request, Response } from "express";
import { User } from "../../models/User";

async function getData(request: Request, response: Response, next: NextFunction) {
    try {
        const user: User = response.locals.user;

        // TODO: Add some includes here
        const foundUser = await User.scope("sensitive").findOne({
            where: {
                id: user.id,
            },
        });

        console.log("USER: ", foundUser);

        response.send(foundUser);
    } catch (e) {
        next(e);
    }
}

export default {
    getData,
};
