import express from "express";
import {
    getAllRoles,
    addRole,
    deleteRole,
    getAllPermissions,
    addPermission,
    deletePermission,
    assignPermission,
    getAllAssignedPermissions,
    getAllPermissionsByRoleId,
    revokePermissionFromRole,
} from "../controllers/admin.controllers";
import {
    checkPermission,
    isAuthenticated,
} from "../middleware/auth.middleware";

const router = express.Router();

/*
*
*
roles related routes ("/roles")
*
*
*/

//get all roles -- GET
router
    .route("/roles")
    .get(isAuthenticated, checkPermission("VIEW_ROLES"), getAllRoles);

//add new role -- POST
router
    .route("/roles")
    .post(isAuthenticated, checkPermission("CREATE_ROLE"), addRole);

//delete a role -- DELETE
router
    .route("/roles/:roleId")
    .delete(isAuthenticated, checkPermission("DELETE_ROLE"), deleteRole);

/*
*
*
permissions related routes ("/permissions")
*
*
*/

//get all permissions -- GET
router
    .route("/permissions")
    .get(
        isAuthenticated,
        checkPermission("VIEW_PERMISSIONS"),
        getAllPermissions,
    );

//add new permissions -- POST
router
    .route("/permissions")
    .post(isAuthenticated, checkPermission("CREATE_PERMISSION"), addPermission);

//delete permission -- DELETE
router
    .route("/permissions/:permissionId")
    .delete(
        isAuthenticated,
        checkPermission("DELETE_PERMISSION"),
        deletePermission,
    );

/*
*
*
role-permissions related routes ("/role-permissions")
*
*
*/

//assign permission to a role -- POST
router
    .route("/role-permissions")
    .post(
        isAuthenticated,
        checkPermission("ASSIGN_PERMISSION"),
        assignPermission,
    );

//get all assigned permissions -- GET
router
    .route("/role-permissions")
    .get(
        isAuthenticated,
        checkPermission("VIEW_ALL_ASSIGNED_PERMISSIONS"),
        getAllAssignedPermissions,
    );

//get all assigned permissions by role id
router
    .route("/role-permissions/:roleId")
    .get(
        isAuthenticated,
        checkPermission("VIEW_ASSIGNED_PERMISSIONS_BY_ROLE"),
        getAllPermissionsByRoleId,
    );

//revoke permission from role by roleid and permission id
router
    .route("/role-permissions/revoke")
    .post(
        isAuthenticated,
        checkPermission("REVOKE_PERMISSION"),
        revokePermissionFromRole,
    );

export default router;
