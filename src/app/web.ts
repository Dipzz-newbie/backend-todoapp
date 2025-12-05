import express from "express";
import rateLimit from "express-rate-limit";
import { publicRouter } from "../route/public-api";
import { errorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../route/api";

export const web = express();

const ratelimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: "Too many request"
    }
})

web.use(express.json());
web.use(ratelimiter);
web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);
