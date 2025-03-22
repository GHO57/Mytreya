import express from "express";
import {
    addVendorAvailabilitySlot,
    removeVendorAvailabilitySlot,
    vendorApplication,
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

//remove vendor availability slot -- POST
router.route("/availability-slot/remove").post(removeVendorAvailabilitySlot);

//view all availability slots by vendor id
router.route("/availability-slot/:vendorId").get(viewAllAvailableSlots);

export default router;
