//model imports

import Pricing from "./Pricing.model";
import RecommendedPackage from "./RecommendedPackage.model";
import RecommendedService from "./RecommendedService.model";

//associations

Pricing.hasMany(RecommendedService, { foreignKey: "pricingId" });
RecommendedService.belongsTo(Pricing, { foreignKey: "pricingId" });

RecommendedService.belongsTo(RecommendedPackage, { foreignKey: "packageId" });
RecommendedPackage.hasMany(RecommendedService, { foreignKey: "packageId" });

//exports
export { Pricing, RecommendedPackage, RecommendedService };
