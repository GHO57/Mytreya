import { Sequelize } from "sequelize";
import logger from "../utils/logger.utils";

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS as string,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT as any,
        logging: false,
    },
);

const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('"payments" DATABASE CONNECTED');
        await sequelize.sync();
        logger.info('"payments" DATABASE SYNCED');
    } catch (error) {
        logger.error('"payments" DATABASE ERROR: ', error);
    }
};

export { dbConnection, sequelize };
