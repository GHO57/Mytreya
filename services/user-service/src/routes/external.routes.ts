import express from "express";
import {
    getAllCounsellingAdmins,
    getVendorId,
    isVendorAvailable,
    validUser,
    validVendor,
} from "../controllers/external.controllers";
const router = express.Router();

//check for valid vendor
router.route("/check-exist/vendor/:vendorId").get(validVendor);

//check for valid user
router.route("/check-exist/user/:userId").get(validUser);

//check whether vendor is available or not
router.route("/check-availability/vendor").post(isVendorAvailable);

//get vendor id by userId
router.route("/vendor/:userId").get(getVendorId);

//get all counselling admins
router.route("/admin/counselling-admins").get(getAllCounsellingAdmins);

export default router;
