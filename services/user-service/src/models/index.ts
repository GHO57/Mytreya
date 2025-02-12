import User from "./User.model";
import Role from "./Role.model";
import Permission from "./Permission.model";

//associations
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

Role.hasMany(Permission, { foreignKey: "roleId" });
Permission.belongsTo(Role, { foreignKey: "roleId" });

export default { User, Role, Permission };
