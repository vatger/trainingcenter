import { Response } from "express";
import { User } from "../../models/User";

/**
 * Checks if a user has the specified permission.
 * If the permission is present, true is returned. **Else, a 403 response is returned** to the requesting client and false is returned
 * @param user
 * @param response
 * @param permission
 * @param pageStay - Determines whether the delta of the 403-page goes back one page (in case of XHR Same-Page requests) or 2 pages (in case of page change)
 */
function checkUserHasPermission(user: User, response: Response, permission: string, pageStay: boolean = false): boolean {
    if (!user.hasPermission(permission)) {
        response.status(403).send({ message: "Missing required permission", permission: permission.toUpperCase(), stay: pageStay });
        return false;
    }

    return true;
}

export default {
    checkUserHasPermission,
};
