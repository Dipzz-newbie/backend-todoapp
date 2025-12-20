import { web } from "./app/web";
// import { logger } from "./app/logging";
import serverless from "serverless-http";

export const handler = serverless(web);

// web.listen(3000, () => {
//     logger.info("Listening on port 3000")
// })