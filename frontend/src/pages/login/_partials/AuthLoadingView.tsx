import { Spinner } from "@/components/ui/Spinner/Spinner";
import vaccLogoDark from "../../../assets/img/vacc_logo_dark.png";
import vaccLogo from "../../../assets/img/vacc_logo.png";
import React from "react";
import hero from "@/assets/img/hero.jpg";

export function AuthLoadingView() {
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
                                        <div className="xl:min-w-[450px] px-8">
                                            <div className="mb-8">
                                                <h3 className="mb-1">Willkommen zurück</h3>
                                            </div>
                                            <div className={"mb-8"}>
                                                <p className={"xl:max-w-[500px]"}>Wir melden Dich gerade an. Gedulde Dich bitte ein paar Momente.</p>
                                            </div>
                                            <div>
                                                <Spinner size={50} />
                                            </div>
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
                </div>
            </div>
        </>
    );
}
