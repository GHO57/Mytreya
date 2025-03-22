import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";

class Session extends Model<
    InferAttributes<Session>,
    InferCreationAttributes<Session>
> {
    declare id?: string;
    declare userId: string;
    declare vendorId: string;
    declare sessionDate: string;
    declare startTimeUtc: string;
    declare endTimeUtc: string;
    declare status?: string;
    declare customerJoinTimeUtc?: string;
    declare customerLastActiveUtc?: string;
    declare vendorJoinTimeUtc?: string;
    declare vendorLastActiveUtc?: string;
}

Session.init(
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
        vendorId: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: false,
        },
        sessionDate: {
            type: DataTypes.DATEONLY,
            unique: false,
            allowNull: false,
        },
        startTimeUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        endTimeUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(200),
            defaultValue: "BOOKED",
            unique: false,
            allowNull: false,
        },
        customerJoinTimeUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        customerLastActiveUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        vendorJoinTimeUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        vendorLastActiveUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "Session",
        tableName: "sessions",
    },
);
export default Session;
