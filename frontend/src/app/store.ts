import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import settingsReducer from "./features/settingsSlice";
import sideNavReducer from "./features/sideNavSlice";
import notificationReducer from "./features/notificationSlice";
import { getLoginLanguage, trySignIn } from "@/app/boot";

export const store = configureStore({
    reducer: {
        authReducer,
        settingsReducer,
        sideNavReducer,
        notificationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

trySignIn();
if (window.location.href.includes("/login")) {
    getLoginLanguage();
}
