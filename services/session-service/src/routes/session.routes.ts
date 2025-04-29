import express from "express";
import {
    assignClientWithAdmin,
    bookConsultationSession,
    confirmSessions,
    createClientSessionsInBulk,
    getAllClientSessions,
    getAllVendorSessions,
    getAvailableCounsellingAdminsByDate,
    getClientConsultationRequests,
    markAdminSessionCompleted,
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

router
    .route("/client/create-bulk")
    .post(isAuthenticated, createClientSessionsInBulk);

router.route("/client/confirm").post(isAuthenticated, confirmSessions);

router.route("/client/all").get(isAuthenticated, getAllClientSessions);

router
    .route("/client/book-consultation")
    .post(isAuthenticated, bookConsultationSession);

/*
*
*
vendor session related routes
*
*
*/

router.route("/vendor/all").get(isAuthenticated, getAllVendorSessions);

/*
*
*
admin related routes
*
*
*/

//get all client consultation requests -- GET
router
    .route("/admin/client-requests")
    .get(isAuthenticated, getClientConsultationRequests);

//get all counselling admins
router
    .route("/admin/counselling-admins")
    .get(isAuthenticated, getAvailableCounsellingAdminsByDate);

//assign expert to client
router
    .route("/admin/assign-expert")
    .post(isAuthenticated, assignClientWithAdmin);

//mark client-counsellingadmin session as completed -- POST
router.route("/admin/session/completed").post(markAdminSessionCompleted);

export default router;
