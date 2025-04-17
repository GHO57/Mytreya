import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";

class RecommendedPackage extends Model<
    InferAttributes<RecommendedPackage>,
    InferCreationAttributes<RecommendedPackage>
> {
    declare id?: string;
    declare userId: string;
    declare adminId: string;
    declare status?: string;
    declare notes?: string;
    declare totalAmount: number;
}

RecommendedPackage.init(
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
            allowNull: false,
            unique: false,
        },
        //used admin's user id in the system not the admin id unlike client id or vendor id
        adminId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: false,
        },
        status: {
            type: DataTypes.STRING(200),
            defaultValue: "PENDING",
            allowNull: false,
            unique: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10),
            allowNull: false,
            unique: false,
        },
    },
    {
        sequelize,
        underscored: true,
        modelName: "RecommendedService",
        tableName: "recommended_services",
    },
);
export default RecommendedPackage;
