import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";

class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    declare id?: string;
    declare roleName: string;
    declare isDeleted?: boolean;
    declare updatedBy?: string;
}

Role.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
        roleName: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            unique: false,
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: true,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "Role",
        tableName: "roles",
        timestamps: true,
    },
);

export default Role;
