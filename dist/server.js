"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = require("./app/web");
// import serverless from "serverless-http"
const logging_1 = require("./app/logging");
// export default serverless(web);
web_1.web.listen(3000, () => {
    logging_1.logger.info("Listening on port 3000");
});
