import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";
import User from "./User.model";

class Vendor extends Model<
    InferAttributes<Vendor>,
    InferCreationAttributes<Vendor>
> {
    declare id?: string;
    declare userId: ForeignKey<string>;
    declare mobileNumber: string;
    declare businessName: string;
    declare pincode: number;
    declare state: string;
    declare city: string;
    declare completeAddress: string;
    declare category: string;
    declare qualifications: string;
    declare certificationName: string;
    declare issuingAuthority: string;
    declare certificationNumber: number;
    declare expirationDate: string;
    declare experience: number;
    declare profileImageUrl?: string;
    declare languages?: string[];
    declare bio?: string;
    declare serviceDescription?: string;
    declare registrationNumber: number;
    declare proofOfCertificationUrl: string;
    declare contactMethod: string;
    declare availability: string;
    declare status: string;
    declare isDeleted?: boolean;
}

Vendor.init(
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
            unique: true,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        mobileNumber: {
            type: DataTypes.DECIMAL(15),
            unique: true,
            allowNull: false,
        },
        businessName: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        pincode: {
            type: DataTypes.DECIMAL(7),
            unique: false,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        completeAddress: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        qualifications: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        certificationName: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        issuingAuthority: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        certificationNumber: {
            type: DataTypes.DECIMAL(30),
            unique: false,
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.DATE,
            unique: false,
            allowNull: false,
        },
        experience: {
            type: DataTypes.DECIMAL(10),
            unique: false,
            allowNull: false,
        },
        profileImageUrl: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: true,
        },
        languages: {
            type: DataTypes.ARRAY(DataTypes.STRING(200)),
            unique: false,
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        serviceDescription: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
        registrationNumber: {
            type: DataTypes.DECIMAL(50),
            unique: false,
            allowNull: false,
        },
        proofOfCertificationUrl: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        contactMethod: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
        },
        availability: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: false,
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
        modelName: "Vendor",
        tableName: "vendors",
        timestamps: true,
    },
);

export default Vendor;
