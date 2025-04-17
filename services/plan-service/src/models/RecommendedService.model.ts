import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";
import Pricing from "./Pricing.model";
import RecommendedPackage from "./RecommendedPackage.model";

class RecommendedService extends Model<
    InferAttributes<RecommendedService>,
    InferCreationAttributes<RecommendedService>
> {
    declare id?: string;
    // declare userId: string;
    // declare adminId: string;
    declare pricingId: ForeignKey<string>;
    declare packageId: ForeignKey<string>;
    declare monthNumber: number;
    declare sessionCount: number;
    declare notes?: string;
    declare status?: string;
}

RecommendedService.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            validate: {
                isUUID: 4,
            },
        },
        // userId: {
        //     type: DataTypes.UUID,
        //     allowNull: false,
        //     unique: false,
        // },
        //used admin's user id in the system not the admin id unlike client id or vendor id
        // adminId: {
        //     type: DataTypes.UUID,
        //     allowNull: false,
        //     unique: false,
        // },
        pricingId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: false,
            references: {
                key: "id",
                model: Pricing,
            },
        },
        packageId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: false,
            references: {
                key: "id",
                model: RecommendedPackage,
            },
        },
        monthNumber: {
            type: DataTypes.DECIMAL(5),
            allowNull: false,
            unique: false,
        },
        sessionCount: {
            type: DataTypes.DECIMAL(5),
            allowNull: false,
            unique: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        },
        status: {
            type: DataTypes.STRING(200),
            defaultValue: "PENDING",
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
export default RecommendedService;
