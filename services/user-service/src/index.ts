import http from "http";
import app from "./app";
import { dbConnection } from "./config/sequelize.conf";
import logger from "./utils/logger.utils";

//creating http server
const server = http.createServer(app);

//database connection and server starting function
const startServer = async () => {
    try {
        await dbConnection();

        server.listen(process.env.PORT, () => {
            logger.info(
                `"user-service" SERVER IS RUNNING AT ${process.env.HOST}:${process.env.PORT}/`,
            );
        });
    } catch (error) {
        logger.error("FAILED TO START THE SERVER, ERROR: ", error);
    }
};

//calling the startServer function
startServer();

//handling uncaught exception
process.on("uncaughtException", (error) => {
    logger.error(`Error: ${error.message}\n`);
    logger.error(`Shutting down the server due to uncaught Exception `);
    process.exit(1);
});

//unhandled promise rejection
process.on("unhandledRejection", (error: any, promise) => {
    logger.error(`- Error : ${error.message}`);
    logger.error("Unhandled Rejection at:", promise, "reason:", error);
    logger.error(
        `\n- Shutting down the server due to unhandled promise rejection`,
    );
    server.close(() => {
        process.exit(1);
    });
});
