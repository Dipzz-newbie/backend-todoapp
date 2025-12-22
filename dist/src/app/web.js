"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const public_api_1 = require("../route/public-api");
const error_middleware_1 = require("../middleware/error-middleware");
const api_1 = require("../route/api");
const cors_1 = __importDefault(require("cors"));
exports.web = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
const ratelimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        status: 429,
        message: "Too many request"
    }
});
exports.web.use((0, cors_1.default)(corsOptions));
exports.web.use("/uploads", express_1.default.static("uploads"));
exports.web.use(express_1.default.json());
exports.web.use(ratelimiter);
exports.web.use(public_api_1.publicRouter);
exports.web.use(api_1.apiRouter);
exports.web.use(error_middleware_1.errorMiddleware);
