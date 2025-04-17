import express from "express";
import {
    confirmSessions,
    createClientSession,
    createClientSessionsInBulk,
    getAllClientSessions,
    getAllVendorSessions,
} from "../controllers/session.controllers";
import { isAuthenticated } from "../middleware/auth.middleware";
const router = express.Router();

/*
*
*
client session related routes
*
*
*/

//create client session with vendor -- POST
router.route("/client/create").post(isAuthenticated, createClientSession);

router
    .route("/client/create-bulk")
    .post(isAuthenticated, createClientSessionsInBulk);

router.route("/client/confirm").post(isAuthenticated, confirmSessions);

router.route("/client/all").get(isAuthenticated, getAllClientSessions);

/*
*
*
vendor session related routes
*
*
*/

router.route("/vendor/all").get(isAuthenticated, getAllVendorSessions);

export default router;
