import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        // format.json(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] : ${message}`;
        }),
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/api-gateway.log" }),
    ],
});

export default logger;
