import {
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";
import Role from "./Role.model";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string;
    declare fullName: string;
    declare email: string;
    declare mobileNumber: number;
    declare password: string;
    declare roleId: ForeignKey<string>;
    declare active: string;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
        fullName: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        mobileNumber: {
            type: DataTypes.DECIMAL(12),
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Role,
                key: "id",
            },
        },
        active: {
            type: DataTypes.STRING(10),
            unique: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
    },
);

export default User;
