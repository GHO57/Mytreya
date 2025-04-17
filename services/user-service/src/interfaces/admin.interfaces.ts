import { Role, Permission, RolePermission } from "../models";
import { Request } from "express";
/* Interfaces */

/*
*
*
roles related interfaces
*
*
*/

//get all roles interface -- RESPONSE
export interface IGetAllRolesResponse {
    success: boolean;
    count: number;
    roles: Role[];
}

//add new role interface -- REQUEST
export interface IAddRoleRequestBody {
    roleName: string;
}

//delete role interface -- PARAMS
export interface IDeleteRoleParams {
    roleId: string;
}

/*
*
*
permissions related interfaces
*
*
*/

//get all permissions interface -- RESPONSE
export interface IGetAllPermissionsResponse {
    success: boolean;
    count: number;
    permissions: Permission[];
}

//add new permission interface -- REQUEST
export interface IAddPermissionRequestBody {
    permissionName: string;
    description: string;
}

//delete permission interface -- PARAMS
export interface IDeletePermissionParams {
    permissionId: string;
}

/*
*
*
role-permissions related interfaces
*
*
*/

//assign permission to role interface -- REQUEST
export interface IAssignPermissionRequestBody {
    roleId: string;
    permissionId: string;
}

//get all assigned permission interface -- RESPONSE
export interface IGetAllAssignedPermissionsResponse {
    success: boolean;
    count: number;
    allAssignedPermissions: RolePermission[];
}

//get all assigned permission By Role id interface -- REQUEST
export interface IGetAllAssignedPermissionsByRoleRequestBody {
    roleId: string;
}

//get all assigned permission By Role id interface -- RESPONSE
export interface IGetAllAssignedPermissionsByRoleResponse {
    success: boolean;
    count: number;
    allPermissionsByRole: RolePermission[];
}

//revoke permission from role interface -- REQUEST
export interface IRevokePermissionRequestBody {
    roleId: string;
    permissionId: string;
}

/*
*
*
vendor applications related interfaces
*
*
*/

//approve vendor application interface -- POST
export interface IApproveVendorApplicationRequestBody {
    vendor_application_id: string;
}

//reject vendor application interface -- POST
export interface IRejectVendorApplicationRequestBody {
    vendor_application_id: string;
}

//get all vendor applications interface -- GET
export interface IGetAllVendorApplicationsRequestQuery {
    page: string;
    limit: string;
    status: string;
}

/*
 *
 *
 *
 *
 *
 */
