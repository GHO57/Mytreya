import express from "express";
import {
    addVendorAvailabilitySlot,
    addVendorAvailabilitySlotBulk,
    getVendorsByCategory,
    removeVendorAvailabilitySlot,
    vendorApplication,
    vendorDashboard,
    viewAllAvailableSlots,
} from "../controllers/vendor.controllers";
import { uploadFileDisk } from "../middleware/uploadFile.middleware";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = express.Router();

//vendor application -- POST
router
    .route("/apply")
    .post(uploadFileDisk.single("proofOfCertification"), vendorApplication);

//add vendor availability slot -- POST
router.route("/availability-slot/add").post(addVendorAvailabilitySlot);

//add vendor availability slots bulk -- POST
router.route("/availability-slot/add-bulk").post(addVendorAvailabilitySlotBulk);

//remove vendor availability slot -- POST
router.route("/availability-slot/remove").post(removeVendorAvailabilitySlot);

//view all availability slots by vendor id
router.route("/availability-slot/").get(viewAllAvailableSlots);

//vendor dashboard
router.route("/dashboard").get(isAuthenticated, vendorDashboard);

//get vendors by category
router.route("/").get(getVendorsByCategory);
export default router;
