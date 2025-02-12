import express from "express";
import {
    addRole,
    deleteRole,
    getAllRoles,
} from "../controllers/admin.controllers";

const router = express.Router();

//get all roles -- GET
router.route("/roles").get(getAllRoles);

//add new role -- POST
router.route("/roles").post(addRole);

//delete a role -- DELETE
router.route("/roles/:roleId").delete(deleteRole);

export default router;
