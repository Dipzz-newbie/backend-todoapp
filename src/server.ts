import express from "express";
import rateLimit from "express-rate-limit";
import { publicRouter } from "./route/public-api";
import { errorMiddleware } from "./middleware/error-middleware";
import { apiRouter } from "./route/api";
import cors from "cors"

export const web = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

const ratelimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: "Too many request"
    }
})

web.use(cors(corsOptions));
web.use("/uploads", express.static("uploads"));
web.use(express.json());
web.use(ratelimiter);
web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);

import { logger } from "./app/logging";

// export default serverless(web);
web.listen(3000, () => {
    logger.info("Listening on port 3000")
})
