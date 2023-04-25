import { Router } from "express";
import LoginController from "../../controllers/login/Login.controller";
import { User } from "../../models/User";
import SessionLibrary, { validateSessionToken } from "../../libraries/session/SessionLibrary";
import { Role } from "../../models/Role";

// Path: "/auth"
export const LoginRouter = Router();

LoginRouter.get("/url", async (request, response) => {
    const redirectUri = LoginController.getRedirectUri();
    response.send(redirectUri);
});

LoginRouter.post("/login", async (request, response) => {
    await LoginController.login(request, response);
});

LoginRouter.post("/logout", async (request, response) => {
    await LoginController.logout(request, response);
});

LoginRouter.get("/check", async (request, response) => {
    response.send(await validateSessionToken(request));
});

LoginRouter.get("/data", async (request, response) => {
    if (!(await validateSessionToken(request))) {
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
