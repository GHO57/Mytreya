import express from "express";
import {
    addRecommendServices,
    addService,
    confirmPackage,
    createClientPackage,
    deleteRecommendedService,
    getAllServices,
    getPendingRecommendations,
    getRecommendedPackagesByUserId,
    getRecommendedPackagesForClient,
    getRecommendedServicesByPackageId,
} from "../controllers/pricing.controllers";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = express.Router();

/*
*
*
Common routes
*
*
*/

//get package details by package id
router.route("/packages/:packageId").get(getRecommendedServicesByPackageId);

/*
*
*
admin related pricing routes
*
*
*/

//create package for client by counselling admin
router.route("/admin/packages/recommended/create").post(createClientPackage);

//get all recommended packages by user id
router
    .route("/admin/packages/recommended/:userId")
    .get(isAuthenticated, getRecommendedPackagesByUserId);

//add service to package
router
    .route("/admin/services/recommended/create")
    .post(isAuthenticated, addRecommendServices);

//remove service from package
router
    .route("/admin/services/recommended/:userId")
    .delete(isAuthenticated, deleteRecommendedService);

//add pricing service
router.route("/admin/services/create").post(isAuthenticated, addService);

//get all pending recommendation respect to counselling admin
router
    .route("/admin/packages/pending")
    .get(isAuthenticated, getPendingRecommendations);

//get all services from pricings table
router.route("/admin/pricing-services").get(getAllServices);

/*
*
*
client related pricing routes
*
*
*/

//get recommended packages for client
router
    .route("/client/packages/recommended")
    .get(isAuthenticated, getRecommendedPackagesForClient);

//update package confirmation status
router
    .route("/client/packages/:packageId/confirm")
    .patch(isAuthenticated, confirmPackage);

export default router;
