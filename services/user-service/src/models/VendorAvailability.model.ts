import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";
import Vendor from "./Vendor.model";

class VendorAvailability extends Model<
    InferAttributes<VendorAvailability>,
    InferCreationAttributes<VendorAvailability>
> {
    declare id?: string;
    declare vendorId: ForeignKey<string>;
    declare availableDate: string;
    declare startTimeUtc: string;
    declare endTimeUtc: string;
    declare timeZone: string;
    declare status?: string;
}

VendorAvailability.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
        vendorId: {
            type: DataTypes.UUID,
            unique: false,
            allowNull: false,
            references: {
                model: Vendor,
                key: "id",
            },
        },
        availableDate: {
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
        timeZone: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(200),
            defaultValue: "ACTIVE",
            unique: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "VendorAvailability",
        tableName: "vendor_availability",
    },
);

export default VendorAvailability;
