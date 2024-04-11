import vaccLogoDark from "../../assets/img/vacc_logo_dark.png";
import vaccLogo from "../../assets/img/vacc_logo.png";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Button } from "@/components/ui/Button/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { SelectLanguageHeader } from "@/components/template/header/SelectLanguageHeader";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { TbArrowRight, TbRefresh } from "react-icons/tb";
import LoginService from "./_services/LoginService";
import { UserModel } from "@/models/UserModel";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { APIResponseError } from "@/pages/login/_services/APIResponseError";
import { NetworkError } from "@/components/errors/NetworkError";
import { signIn } from "@/app/features/authSlice";
import hero from "@/assets/img/hero.jpg";
import { store } from "@/app/store";
import { setLanguage, TLanguage, useSettingsSelector } from "@/app/features/settingsSlice";
import loginTranslation from "@/assets/lang/login/login.translation";
import genericTranslation from "@/assets/lang/generic.translation";
import LocalStorageLibrary from "@/utils/library/LocalStorageLibrary";
import { Config } from "@/core/Config";

export function LoginCallbackView() {
    const navigate = useNavigate();
    const language = useSettingsSelector().language;

    const [rememberCheckboxState, setRememberCheckboxState] = useState<boolean>(false);
    const [loadingSignIn, setLoadingSignIn] = useState<boolean>(false);
    const [signInError, setSignInError] = useState<APIResponseError>(undefined);

    function login() {
        setLoadingSignIn(true);

        LoginService.handleLogin(rememberCheckboxState)
            .then((user: UserModel) => {
                store.dispatch(signIn(user));
                store.dispatch(setLanguage((user.user_settings?.language as TLanguage) ?? "de"));
                navigate("/");
            })
            .catch((err: AxiosError) => {
                setSignInError({
                    error: err,
                    custom: {
                        code: "ERR_SIGN_IN",
                        message: "Failed to log in",
                    },
                });
            })
            .finally(() => {
                setLoadingSignIn(false);
            });
    }

    return (
        <>
            <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
                <div className="h-full flex flex-auto flex-col justify-between">
                    <main className="h-full">
                        <div className="page-container relative h-full flex flex-auto flex-col">
                            <div className="grid lg:grid-cols-3 h-full">
                                <div
                                    className="bg-no-repeat bg-cover bg-center py-6 px-16 flex-col justify-end hidden lg:flex"
                                    style={{ backgroundImage: `url('${hero}')` }}>
                                    <div>
                                        <div className="mb-6 flex items-center gap-4">
                                            <span className="text-white">&copy; {new Date().getFullYear()} VATSIM Germany</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                                    <div className="xl:min-w-[450px] px-8">
                                        <RenderIf
                                            truthValue={signInError != null}
                                            elementTrue={
                                                <div className={"mb-5"}>
                                                    <NetworkError error={signInError?.error} closeable={false} />
                                                </div>
                                            }
                                        />

                                        <div className="mb-8">
                                            <h3 className="mb-1">
                                                {loadingSignIn
                                                    ? `${loginTranslation.logging_in_title[language]}...`
                                                    : `${loginTranslation.remain_logged_in_title[language]}?`}
                                            </h3>
                                        </div>
                                        <div className={"mb-6"}>
                                            <p className={"xl:max-w-[500px]"}>
                                                {loadingSignIn ? loginTranslation.logging_in_title[language] : loginTranslation.remain_logged_in_text[language]}
                                            </p>
                                        </div>

                                        <RenderIf
                                            truthValue={!loadingSignIn}
                                            elementTrue={
                                                <div>
                                                    <Checkbox checked={rememberCheckboxState} onChange={checked => setRememberCheckboxState(checked)}>
                                                        {loginTranslation.remain_logged_in_title[language]}
                                                    </Checkbox>
                                                </div>
                                            }
                                        />

                                        <div>
                                            <Button
                                                color={COLOR_OPTS.PRIMARY}
                                                variant={"twoTone"}
                                                className={"mt-8"}
                                                loading={loadingSignIn}
                                                block
                                                icon={signInError == null ? <TbArrowRight size={24} /> : <TbRefresh size={24} />}
                                                onClick={() => {
                                                    if (signInError != null) {
                                                        navigate("/login");
                                                        return;
                                                    }
                                                    setSignInError(undefined);
                                                    login();
                                                }}>
                                                {signInError == null ? genericTranslation.continue[language] : genericTranslation.retry[language]}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <div className={"absolute top-0 left-0 h-[100px] w-full"}>
                <div>
                    <div className="logo absolute m-4">
                        <a href={"https://vatsim-germany.org"} target={"_blank"}>
                            <img className={"w-[210px] hidden dark:block lg:block"} src={vaccLogoDark} alt="VATGER Logo" />
                            <img className={"w-[210px] dark:hidden lg:hidden"} src={vaccLogo} alt="VATGER Logo" />
                        </a>
                    </div>
                    <div className={"m-4 absolute float-right right-0"}>
                        <SelectLanguageHeader saveSelection={false} />
                    </div>
                </div>
            </div>

            <div className={"absolute bottom-0 right-0 pr-16 pb-6"}>
                <pre className={"mb-6 bg-gray-100 dark:bg-gray-700 px-3 rounded text-gray-400"}>{"v" + APP_VERSION}</pre>
            </div>
        </>
    );
}
