import {
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/sequelize.conf";
import Role from "./Role.model";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id?: string;
    declare fullName: string;
    declare email: string;
    declare mobileNumber: number;
    declare password: string;
    declare roleId: ForeignKey<string>;
    declare isDeleted?: boolean;
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
        modelName: "User",
        tableName: "users",
        timestamps: true,
        hooks: {
            //Hash password before saving
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
            //Hash password before updating, if modified
            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    },
);

export default User;
