//model imports

import RecommendedPackage from "./RecommendedPackage.model";
import RecommendedService from "./RecommendedService.model";

//associations

RecommendedService.belongsTo(RecommendedPackage, { foreignKey: "packageId" });
RecommendedPackage.hasMany(RecommendedService, { foreignKey: "packageId" });

//exports
export { RecommendedPackage, RecommendedService };
