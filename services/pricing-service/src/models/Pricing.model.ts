import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";

class Pricing extends Model<
    InferAttributes<Pricing>,
    InferCreationAttributes<Pricing>
> {
    declare id?: string;
    declare serviceName: string;
    declare price: number;
    declare description: string;
    declare active?: string;
}

Pricing.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
        serviceName: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
        },
        price: {
            type: DataTypes.DECIMAL(10),
            allowNull: false,
            unique: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
            unique: false,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "Pricing",
        tableName: "pricings",
        timestamps: true,
    },
);
export default Pricing;
