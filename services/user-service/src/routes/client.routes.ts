import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { clientOnboarding } from "../controllers/client.controllers";

const router = express.Router();

router.route("/onboard").post(isAuthenticated, clientOnboarding);

export default router;
