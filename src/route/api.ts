import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { errorMiddleware } from "../middleware/error-middleware";
import { TaskController } from "../controller/task-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);
apiRouter.use(errorMiddleware);

// api User routes
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.post("/api/users/logout", UserController.logout);

//api Task routes
apiRouter.post("/api/users/tasks", TaskController.create);
apiRouter.get("/api/users/tasks/:taskId", TaskController.get);
apiRouter.patch("/api/users/tasks/:taskId", TaskController.update);
apiRouter.delete("/api/users/tasks/:taskId", TaskController.remove);
apiRouter.get("/api/users/tasks", TaskController.list);
apiRouter.get("/api/users/tasks/search", TaskController.search);
