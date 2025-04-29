import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";

class ClientIntake extends Model<
    InferAttributes<ClientIntake>,
    InferCreationAttributes<ClientIntake>
> {
    declare id?: string;
    declare userId: string;
    declare name: string;
    declare email: string;
    declare phoneNumber: number;
    declare ageGroup: string;
    declare concern: string;
    declare goal: string;
    declare preferredDate: string;
    declare startTimeUtc: string;
    declare timeZone: string;
    declare status?: string;
}

ClientIntake.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
        userId: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.DECIMAL(15),
            unique: false,
            allowNull: false,
        },
        ageGroup: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        concern: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        goal: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        preferredDate: {
            type: DataTypes.DATEONLY,
            unique: false,
            allowNull: false,
        },
        startTimeUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        timeZone: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(100),
            defaultValue: "PENDING", //PENDING, COMPLETED
            unique: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "ClientIntake",
        tableName: "client_intakes",
        timestamps: true,
    },
);

export default ClientIntake;
