import { UserDataModel, UserModel, UserSettingsModel } from "@/models/UserModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "@/app/hooks";
import { store } from "@/app/store";
import { setLanguage } from "@/app/features/settingsSlice";

interface AuthState {
    signedIn: boolean;
    user: UserModel | undefined;
    userSettings: UserSettingsModel | undefined;
    userData: UserDataModel | undefined;
    userPermissions: string[];
}

const initialState: AuthState = {
    signedIn: false,
    user: undefined,
    userSettings: undefined,
    userData: undefined,
    userPermissions: [],
};

export const authSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<UserModel>) => {
            state.user = action.payload;
            state.userSettings = action.payload.user_settings;
            state.userData = action.payload.user_data;

            const perms: string[] = [];
            action.payload.roles?.forEach(role => {
                role.permissions?.forEach(perm => {
                    perms.push(perm.name?.toUpperCase());
                });
            });
            state.userPermissions = perms;
            state.signedIn = true;
        },
        signOut: state => {
            state.user = undefined;
            state.userSettings = undefined;
            state.userData = undefined;
            state.userPermissions = [];
            state.signedIn = false;
        },
        updateData: (state, action: PayloadAction<UserModel>) => {
            state.user = action.payload;
        },
    },
    selectors: {
        getFullName: state => {
            if (!state.user) {
                return "N/A";
            }

            return `${state.user.first_name} ${state.user.last_name}`;
        },
    },
});

// ---------- Selectors ------------
//
export const useAuthSelector = () => useAppSelector(store => store.authReducer);
export const useUserSelector = () => useAppSelector(store => store.authReducer.user);
//
// ---------------------------------

export const { signIn, signOut, updateData } = authSlice.actions;
export const { getFullName } = authSlice.selectors;

export default authSlice.reducer;
