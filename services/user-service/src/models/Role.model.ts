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
    declare active?: boolean;
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
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        modelName: "Role",
        tableName: "Roles",
        timestamps: true,
    },
);

export default Role;
