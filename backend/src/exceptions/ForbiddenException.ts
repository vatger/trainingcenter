export class ForbiddenException extends Error {
    public readonly error_: string;
    public readonly pageStay_: boolean;

    constructor(error: string, pageStay: boolean = false) {
        super();
        this.error_ = error;
        this.pageStay_ = pageStay;
    }

    public getPageStayAttribute(): boolean {
        return this.pageStay_;
    }
}
