import { Request, Response, Router } from "express";
import UserNoteAdminController from "../../../controllers/user/UserNote.admin.controller";

// Path: "/administration/user/notes"
export const UserNoteAdminRouter = Router();

UserNoteAdminRouter.get("/", async (request: Request, response: Response) => {
    await UserNoteAdminController.getGeneralUserNotes(request, response);
});
