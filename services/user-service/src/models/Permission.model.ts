import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";
import Role from "./Role.model";

class Permission extends Model<
    InferAttributes<Permission>,
    InferCreationAttributes<Permission>
> {
    declare id: string;
    declare roleId: ForeignKey<string>;
    declare permissionName: string;
    declare description: string;
    declare active: string;
    declare updatedBy: string;
}

Permission.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Role,
                key: "id",
            },
        },
        permissionName: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        active: {
            type: DataTypes.STRING(10),
            unique: false,
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Permission",
        tableName: "permissions",
        timestamps: true,
    },
);

export default Permission;
