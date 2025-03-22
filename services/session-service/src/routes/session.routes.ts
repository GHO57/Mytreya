import express from "express";
import { createClientSession } from "../controllers/session.controllers";
const router = express.Router();

//create client session with vendor -- POST
router.route("/create").post(createClientSession);

export default router;
