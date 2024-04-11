export type VatsimScopes = Array<"full_name" | "vatsim_details" | "email" | "country">;

export type VatsimOauthToken = {
    scopes: Array<string>;
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token?: string;
};

export type VatsimUserData = {
    data: {
        cid: number;
        personal: {
            name_first: string;
            name_last: string;
            name_full: string;
            email: string;
            country: {
                id: string;
                name: string;
            };
        };
        vatsim: {
            rating: {
                id: number;
                long: string;
                short: string;
            };
            pilotrating: {
                id: number;
                long: string;
                short: string;
            };
            division: {
                id: string;
                name: string;
            };
            region: {
                id: string;
                name: string;
            };
            subdivision: {
                id: string;
                name: string;
            };
        };
        oauth: {
            token_valid: string;
        };
    };
};
