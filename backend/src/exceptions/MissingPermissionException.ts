export class MissingPermissionException extends Error {
    public readonly permission_: string;
    public readonly pageStay_: boolean;

    constructor(permission: string, pageStay: boolean) {
        super();
        this.permission_ = permission;
        this.pageStay_ = pageStay;
    }

    public getMissingPermission(): string {
        return this.permission_;
    }

    public getPageStayAttribute(): boolean {
        return this.pageStay_;
    }
}
