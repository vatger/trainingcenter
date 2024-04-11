import { store } from "@/app/store";
import { signIn } from "@/app/features/authSlice";
import LoginService from "@/pages/login/_services/LoginService";
import { UserModel } from "@/models/UserModel";
import { Config } from "@/core/Config";
import { setLanguage, TLanguage } from "@/app/features/settingsSlice";
import LocalStorageLibrary from "@/utils/library/LocalStorageLibrary";

function trySignIn() {
    const user = store.getState().authReducer.user;
    if (user) return;

    LoginService.validateSession()
        .then((user: UserModel) => {
            store.dispatch(signIn(user));
            store.dispatch(setLanguage(user.user_settings?.language ?? "de"));
        })
        .catch(() => {
            if (window.location.href.toLowerCase().includes("/login")) {
                return;
            }

            window.location.replace(Config.APP_HOST + "/login");
        });
}

/**
 * Since we don't have access to the user at this point, we need to store
 * the language selection in Localstorage beforehand
 */
function getLoginLanguage() {
    const language = LocalStorageLibrary.getKey(Config.VATGER_LOGIN_LANGUAGE_NAME);
    if (language == null) return;

    store.dispatch(setLanguage(language as TLanguage));
}

export { trySignIn, getLoginLanguage };
