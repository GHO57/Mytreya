import User from "./User.model";
import Role from "./Role.model";
import Permission from "./Permission.model";
import RolePermission from "./RolePermission.model";

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
RolePermission.belongsTo(Role, { foreignKey: "roleId" });
RolePermission.belongsTo(Permission, { foreignKey: "permissionId" });

export { User, Role, Permission, RolePermission };
