import { Request, Response } from "express";
import { ActionRequirement } from "../../models/ActionRequirement";

async function getAll(request: Request, response: Response) {
    const actionRequirements = await ActionRequirement.findAll();

    response.send(actionRequirements);
}

export default {
    getAll,
};
