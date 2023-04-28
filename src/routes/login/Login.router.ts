import { Router } from "express";
import LoginController from "../../controllers/login/Login.controller";
import { User } from "../../models/User";
import SessionLibrary from "../../libraries/session/SessionLibrary";
import { Role } from "../../models/Role";

// Path: "/auth"
export const LoginRouter = Router();

LoginRouter.get("/url", LoginController.getRedirectUri);
LoginRouter.post("/login", LoginController.login);
LoginRouter.post("/logout", LoginController.logout);

LoginRouter.get("/check", async (request, response) => {
    response.send(await SessionLibrary.validateSessionToken(request));
});

LoginRouter.get("/data", async (request, response) => {
    if (!(await SessionLibrary.validateSessionToken(request))) {
        response.status(401).send({ message: "Session token invalid" });
        return;
    }

    const user_id = await SessionLibrary.getUserIdFromSession(request);

    const user = await User.scope("sensitive").findOne({
        where: {
            id: user_id,
        },
        include: [
            {
                association: User.associations.user_data,
            },
            {
                association: User.associations.user_settings,
            },
            {
                association: User.associations.roles,
                attributes: ["name"],
                through: { attributes: [] },

                include: [
                    {
                        association: Role.associations.permissions,
                        attributes: ["name"],
                        through: { attributes: [] },
                    },
                ],
            },
        ],
    });

    response.send(user);
});
