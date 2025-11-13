
import express from "express";
import { UserController } from "../controller/user-controller";

export const publicRouter = express();

publicRouter.post("/api/register", UserController.register)