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
    declare vendorId?: string;
    declare adminUserId?: string | null;
    declare pricingId?: string;
    declare recommendedServiceId?: string;
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
            allowNull: true,
        },
        adminUserId: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: true,
        },
        pricingId: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: true,
        },
        recommendedServiceId: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: true,
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
            allowNull: true,
        },
        customerLastActiveUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: true,
        },
        vendorJoinTimeUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: true,
        },
        vendorLastActiveUtc: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: true,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "Session",
        tableName: "sessions",
        timestamps: true,
    },
);
export default Session;
