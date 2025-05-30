import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        // format.json(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level.toUpperCase()}] : ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
        }),
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/pricing_service.log" }),
    ],
});

export default logger;
