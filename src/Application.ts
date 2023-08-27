import express, { Express } from "express";
import { initializeApplication } from "./core/StartupRoutine";
import { Config } from "./core/Config";
import cors from "cors";
import Logger, { LogLevels } from "./utility/Logger";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { syslogMiddleware } from "./middlewares/SyslogMiddleware";
import { handleUncaughtException } from "./exceptions/handler/ExceptionHandler";
import fileUpload from "express-fileupload";
import { router } from "./Router";

const application: Express = express();

process.on("uncaughtException", (err, origin) => handleUncaughtException(err, origin));

initializeApplication()
    .then(() => {
        // Basic server configuration
        application.use(
            cors({
                credentials: true,
                origin: Config.APP_CORS_ALLOW,
            })
        );
        application.use(cookieParser(Config.APP_KEY));
        application.use(bodyParser.json());
        application.use(fileUpload({ debug: Config.APP_DEBUG, useTempFiles: true, tempFileDir: Config.FILE_TMP_LOCATION }));

        application.set("trust proxy", ["loopback", "172.16.0.201"]);

        // Start listening
        application.listen(Config.APP_PORT, Config.APP_HOST ?? "127.0.0.1", () => {
            Logger.log(LogLevels.LOG_WARN, `Debug mode: ${Config.APP_DEBUG ? "ENABLED" : "DISABLED"}`);
            Logger.log(LogLevels.LOG_WARN, `SQL logging: ${Config.APP_LOG_SQL ? "ENABLED" : "DISABLED"}`);
            Logger.log(LogLevels.LOG_WARN, `File Upload: {location: ${Config.FILE_STORAGE_LOCATION}, tmp: ${Config.FILE_TMP_LOCATION}}\n`);

            Logger.log(LogLevels.LOG_SUCCESS, `Server is running on http://${Config.APP_HOST ?? "0.0.0.0"}:${Config.APP_PORT}`, true);
        });

        application.use(syslogMiddleware);
        application.use("/", router);
    })
    .catch(() => {
        Logger.log(LogLevels.LOG_ERROR, "\n\nFatal Error detected. Application will now shutdown!\n\n");
        process.exit(-1);
    });
