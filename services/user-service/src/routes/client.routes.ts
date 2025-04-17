import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import {
    clientDashboard,
    clientOnboarding,
} from "../controllers/client.controllers";

const router = express.Router();

router.route("/onboard").post(isAuthenticated, clientOnboarding);

router.route("/dashboard").get(isAuthenticated, clientDashboard);

export default router;
