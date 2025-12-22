import {web} from "../app/web"
import serverless from "serverless-http"
// import { logger } from "./app/logging";

export default serverless(web);
// web.listen(3000, () => {
//     logger.info("Listening on port 3000")
// })
