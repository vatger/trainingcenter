import express from "express";
import { initializeApplication } from "./src/core/StartupRoutine";
import { Config } from "./src/core/Config";
import cors from "cors";
import Logger, { LogLevels } from "./src/utility/Logger";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { syslogMiddleware } from "./src/middlewares/SyslogMiddleware";
import { handleUncaughtException } from "./src/exceptions/handler/ExceptionHandler";
import fileUpload from "express-fileupload";
import { GlobalRouter } from "./src/routes/Global.router";

const application = express();

process.on("uncaughtException", (err, origin) => handleUncaughtException(err, origin));

initializeApplication()
    .then(() => {
        // Basic server configuration
        application.use(
            cors({
                credentials: true,
                origin: "http://localhost:8000",
            })
        );
        application.use(cookieParser(Config.APP_KEY));
        application.use(bodyParser.json());
        application.use(fileUpload({ debug: Config.APP_DEBUG, useTempFiles: true, tempFileDir: Config.FILE_TMP_LOCATION }));

        // Start listening
        application.listen(Config.APP_PORT, Config.APP_HOST ?? "127.0.0.1", () => {
            Logger.log(LogLevels.LOG_WARN, `Debug mode: ${Config.APP_DEBUG ? "ENABLED" : "DISABLED"}`);
            Logger.log(LogLevels.LOG_WARN, `SQL logging: ${Config.APP_LOG_SQL ? "ENABLED" : "DISABLED"}`);
            Logger.log(LogLevels.LOG_WARN, `File Upload: {location: ${Config.FILE_STORAGE_LOCATION}, tmp: ${Config.FILE_TMP_LOCATION}}\n`);

            Logger.log(LogLevels.LOG_SUCCESS, `Server is running on http://${Config.APP_HOST ?? "127.0.0.1"}:${Config.APP_PORT}`, true);
        });

        application.use(syslogMiddleware);
        application.use("/", GlobalRouter);
    })
    .catch(() => {
        Logger.log(LogLevels.LOG_ERROR, "\n\nFatal Error detected. Application will now shutdown!\n\n");
        process.exit(-1);
    });
