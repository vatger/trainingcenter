import { Request, Response } from "express";
import { Permission } from "../../models/Permission";

/**
 * Gets all permissions
 * @param request
 * @param response
 */
async function getAll(request: Request, response: Response) {
    const permissions = await Permission.findAll();
    response.send(permissions);
}

/**
 * Creates a new permission. If the name of this permission exists, returns a 400 error
 * @param request
 * @param response
 */
async function create(request: Request, response: Response) {
    const name = request.body.name;

    if (name == null || name.length == 0) {
        response.status(400).send({ code: "VAL_ERR", error: "No name supplied" });
        return;
    }

    const [perm, created] = await Permission.findOrCreate({
        where: { name: name },
        defaults: {
            name: name,
        },
    });

    if (!created) {
        response.status(400).send({ code: "DUP_ENTRY", error: "Duplicate entry for column name" });
        return;
    }

    response.send(perm);
}

/**
 * Deletes a permission specified by request.body.perm_id
 * @param request
 * @param response
 */
async function destroy(request: Request, response: Response) {
    const perm_id = request.body.perm_id;

    if (perm_id == null || perm_id == -1) {
        response.status(400).send({ code: "VAL_ERR", error: "No permission supplied" });
        return;
    }

    const res = await Permission.destroy({
        where: {
            id: perm_id,
        },
    });

    response.send({ message: "OK", rows: res });
}

export default {
    getAll,
    create,
    destroy,
};
