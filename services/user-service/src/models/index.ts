import User from "./User.model";
import Role from "./Role.model";
import Permission from "./Permission.model";
import RolePermission from "./RolePermission.model";
import Client from "./Client.model";
import Vendor from "./Vendor.model";
import VendorApplication from "./VendorApplication.model";
import VendorAvailability from "./VendorAvailability.model";

//associations

//User - Role (One-to-Many)
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

//Role - Permission (Many-to-Many) through RolePermissions table
Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "roleId",
});
Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permissionId",
});

//RolePermission - Role and Permission (one to one)
RolePermission.belongsTo(Role, { foreignKey: "roleId" });
RolePermission.belongsTo(Permission, { foreignKey: "permissionId" });

//client - User (one to one)
Client.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Client, { foreignKey: "userId" });

//vendor - User (one to one)
Vendor.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Vendor, { foreignKey: "userId" });

//vendor - vendorAvailability (one to many)
Vendor.hasMany(VendorAvailability, { foreignKey: "vendorId" });
VendorAvailability.belongsTo(Vendor, { foreignKey: "vendorId" });

export {
    User,
    Role,
    Permission,
    RolePermission,
    Client,
    Vendor,
    VendorApplication,
    VendorAvailability,
};
