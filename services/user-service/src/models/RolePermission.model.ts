import {
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";
import Role from "./Role.model";
import Permission from "./Permission.model";

class RolePermission extends Model<
    InferAttributes<RolePermission>,
    InferCreationAttributes<RolePermission>
> {
    declare id?: string;
    declare roleId: ForeignKey<string>;
    declare permissionId: ForeignKey<string>;
    declare isDeleted?: boolean;
}

RolePermission.init(
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
        permissionId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Permission,
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
        modelName: "RolePermission",
        tableName: "role_permissions",
        timestamps: true,
    },
);

export default RolePermission;
