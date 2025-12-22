"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = require("../src/app/web");
const serverless_http_1 = __importDefault(require("serverless-http"));
// import { logger } from "./app/logging";
exports.default = (0, serverless_http_1.default)(web_1.web);
// web.listen(3000, () => {
//     logger.info("Listening on port 3000")
// })
