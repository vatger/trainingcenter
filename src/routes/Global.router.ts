import { Router } from "express";
import { LoginRouter } from "./login/Login.router";
import { AuthenticatedRouter } from "./authenticated/AuthenticatedRouter";
import { AdministrationRouter } from "./administration/Administration.router";

// TODO, Add try catch around every route :) -> to handle internal server errors with response 500

// Path: "/"
export const GlobalRouter = Router();

GlobalRouter.use("/auth", LoginRouter);
GlobalRouter.use("/", AuthenticatedRouter);
GlobalRouter.use("/administration", AdministrationRouter);
