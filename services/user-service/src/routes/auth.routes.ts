import express from "express";
import { signupUser } from "../controllers/auth.controllers";

const router = express.Router();

//user signup route(email and password)
router.route("/signup").post(signupUser); //POST
