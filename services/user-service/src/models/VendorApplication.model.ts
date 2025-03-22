import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
} from "sequelize";
import { sequelize } from "../config/sequelize.conf";

class VendorApplication extends Model<
    InferAttributes<VendorApplication>,
    InferCreationAttributes<VendorApplication>
> {
    declare id?: string;
    declare fullName: string;
    declare email: string;
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
    declare registrationNumber: number;
    declare proofOfCertificationUrl: string;
    declare contactMethod: string;
    declare availability: string;
    declare status?: string;
    declare isDeleted?: boolean;
}

VendorApplication.init(
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
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        mobileNumber: {
            type: DataTypes.DECIMAL(15),
            unique: false,
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
            defaultValue: "PENDING",
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
        modelName: "VendorApplication",
        tableName: "vendor_applications",
        timestamps: true,
    },
);

export default VendorApplication;
