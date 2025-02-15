import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";

class Permission extends Model<
    InferAttributes<Permission>,
    InferCreationAttributes<Permission>
> {
    declare id?: string;
    declare permissionName: string;
    declare description: string;
    declare isDeleted?: boolean;
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
        permissionName: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            unique: false,
            allowNull: false,
        },
        // updatedBy: {
        //     type: DataTypes.STRING(200),
        //     unique: false,
        //     allowNull: false,
        // },
    },
    {
        sequelize,
        underscored: true,
        modelName: "Permission",
        tableName: "permissions",
        timestamps: true,
    },
);

export default Permission;
