import express, { Express, Router } from "express";
import { initializeApplication } from "./core/StartupRoutine";
import { Config } from "./core/Config";
import cors from "cors";
import Logger, { LogLevels } from "./utility/Logger";
import cookieParser from "cookie-parser";
import { syslogMiddleware } from "./middlewares/SyslogMiddleware";
import { router, routerGroup } from "./Router";
import { exceptionInterceptorMiddleware } from "./middlewares/ExceptionInterceptorMiddleware";
import multer from "multer";

const application: Express = express();

function logStartupOptions() {
    Logger.log(LogLevels.LOG_WARN, `Debug mode: ${Config.APP_DEBUG ? "ENABLED" : "DISABLED"}`);
    Logger.log(LogLevels.LOG_WARN, `SQL logging: ${Config.APP_LOG_SQL ? "ENABLED" : "DISABLED"}`);
    Logger.log(LogLevels.LOG_WARN, `File Upload: {location: ${Config.FILE_STORAGE_LOCATION}, tmp: ${Config.FILE_TMP_LOCATION}}\n`);

    Logger.log(LogLevels.LOG_SUCCESS, `Server is running on http://${Config.APP_HOST ?? "0.0.0.0"}:${Config.APP_PORT}`, true);
}

initializeApplication()
    .then(() => {
        // Basic server configuration
        if (Config.APP_DEBUG) {
            application.use(
                cors({
                    credentials: true,
                    origin: Config.APP_CORS_ALLOW,
                })
            );
        }

        application.set("trust proxy", ["loopback", "172.16.0.201"]);

        application.use(
            "/api/v1",
            routerGroup((r: Router) => {
                r.use(cookieParser(Config.APP_KEY));
                r.use(
                    multer({
                        dest: Config.FILE_TMP_LOCATION,
                    }).array("files")
                );

                r.use(syslogMiddleware);
                r.use(router);
                r.use(exceptionInterceptorMiddleware);
            })
        );

        // Start listening
        application.listen(Config.APP_PORT, Config.APP_HOST, logStartupOptions);
    })
    .catch(() => {
        Logger.log(LogLevels.LOG_ERROR, "\n\nFatal Error detected. Application will now shutdown!\n\n");
        process.exit(-1);
    });
