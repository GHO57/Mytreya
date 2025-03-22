import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";
import User from "./User.model";

class Client extends Model<
    InferAttributes<Client>,
    InferCreationAttributes<Client>
> {
    declare id?: string;
    declare userId?: ForeignKey<string>;
    declare mobileNumber?: number;
    declare age?: number;
    declare gender?: string;
    declare pincode?: number;
    declare preferredLanguages?: string[];
    declare isDeleted?: boolean;
}

Client.init(
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
            unique: true,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        mobileNumber: {
            type: DataTypes.DECIMAL(15),
            unique: true,
            allowNull: true,
        },
        age: {
            type: DataTypes.DECIMAL(3),
            unique: false,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: true,
        },
        pincode: {
            type: DataTypes.DECIMAL(6),
            unique: false,
            allowNull: true,
        },
        preferredLanguages: {
            type: DataTypes.ARRAY(DataTypes.STRING(100)),
            defaultValue: ["english"],
            unique: false,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            unique: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "Client",
        tableName: "clients",
        timestamps: true,
    },
);

export default Client;
