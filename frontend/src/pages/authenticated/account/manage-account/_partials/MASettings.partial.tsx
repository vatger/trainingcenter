import { ManageAccountElement } from "@/components/ui/Account/ManageAccountElement";
import { Select } from "@/components/ui/Select/Select";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import React, { useState } from "react";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { TbDownload, TbRefresh, TbRefreshOff } from "react-icons/tb";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import { UserModel } from "@/models/UserModel";
import dayjs from "dayjs";
import { setLanguage, TColorScheme, TLanguage, useSettingsSelector } from "@/app/features/settingsSlice";
import LocalStorageLibrary from "@/utils/library/LocalStorageLibrary";
import { updateData, useUserSelector } from "@/app/features/authSlice";
import { store } from "@/app/store";
import DownloadHelper from "@/utils/helper/DownloadHelper";

export function MASettingsPartial() {
    const user = useUserSelector();
    const { language, selectedColorScheme } = useSettingsSelector();

    const [submittingSettings, setSubmittingSettings] = useState<boolean>(false);

    // GDPR
    const [loadingGDPR, setLoadingGDPR] = useState<boolean>(false);

    // VATSIM Data synchronisation
    const [syncingData, setSyncingData] = useState<boolean>(false);
    const [dataSynchronisationDisabled, setDataSynchronisationDisabled] = useState<boolean>(dayjs.utc().diff(dayjs(user?.updatedAt), "minutes") < 30);
    const lastUserDataUpdateDate: Date = user?.updatedAt ?? new Date();

    function updateSettings(value: { language: string }) {
        setSubmittingSettings(true);

        axiosInstance
            .patch("/settings", value)
            .catch(() => {
                ToastHelper.error("Fehler beim speichern der Einstellungen");
            })
            .finally(() => setSubmittingSettings(false));
    }

    function downloadGDPR() {
        setLoadingGDPR(true);

        DownloadHelper.downloadFile("/gdpr", `gdpr-${user?.id}-${dayjs.utc().unix()}.json`)
            .catch(err => {
                console.log(err);
                ToastHelper.error("Fehler beim herunterladen deiner Daten");
            })
            .finally(() => setLoadingGDPR(false));
    }

    function updateUserData() {
        setSyncingData(true);
        axiosInstance
            .get("/user/update")
            .then((res: AxiosResponse) => {
                const user = res.data as UserModel;
                store.dispatch(updateData(user));
                setDataSynchronisationDisabled(true);
                ToastHelper.success("Daten erfolgreich synchronisiert");
            })
            .catch(() => {
                axiosInstance
                    .post("/auth/logout")
                    .then(res => {
                        if (res.data.success) {
                            window.location.replace("/login?refresh");
                        }
                    })
                    .catch(() => {
                        ToastHelper.error("Fehler beim Aktualisieren deiner Daten");
                    });
            })
            .finally(() => setSyncingData(false));
    }

    return (
        <>
            <ManageAccountElement
                title={"Language"}
                break
                element={
                    <div className={"w-full lg:w-1/2 float-right"}>
                        <Select
                            value={language}
                            onChange={(newLanguage: string) => {
                                store.dispatch(setLanguage(newLanguage as TLanguage));
                                updateSettings({ language: newLanguage });
                            }}
                            disabled={submittingSettings}>
                            <option value="de">German</option>
                            <option value="en">English</option>
                        </Select>
                    </div>
                }
            />

            <ManageAccountElement
                break
                title={
                    <>
                        Dark Mode
                        <span className={"flex text-xs mt-1.5"}>Diese Einstellung betrifft nur das aktuelle Gerät</span>
                    </>
                }
                element={
                    <div className={"w-full lg:w-1/2  float-right"}>
                        <Select onChange={value => LocalStorageLibrary.setColorTheme(value as TColorScheme)} value={selectedColorScheme}>
                            <option value="auto">Automatisch (Betriebssystem)</option>
                            <option value="dark">Dunkel</option>
                            <option value="light">Hell</option>
                        </Select>
                    </div>
                }
            />

            <ManageAccountElement
                break
                title={
                    <>
                        Vatsim Daten Synchronisieren
                        <RenderIf
                            truthValue={dataSynchronisationDisabled}
                            elementTrue={
                                <span className={"text-danger flex text-xs mt-1.5"}>
                                    Um {dayjs.utc(lastUserDataUpdateDate).add(30, "minutes").format("HH:mm")} UTC verfügbar
                                </span>
                            }
                        />
                    </>
                }
                element={
                    <Button
                        block
                        disabled={dataSynchronisationDisabled}
                        onClick={updateUserData}
                        loading={syncingData}
                        icon={dataSynchronisationDisabled ? <TbRefreshOff size={20} /> : <TbRefresh size={20} />}
                        className={"ml-auto float-right w-full md:w-auto"}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}>
                        {dataSynchronisationDisabled ? "Nicht Verfügbar" : "Jetzt Synchronisieren"}
                    </Button>
                }
            />
            <ManageAccountElement
                break
                hideBottomBorder
                title={
                    <>
                        Personenbezogene Daten Herunterladen
                        <span className={"flex text-xs mt-1.5"}>Gemäß Art. 15 Abs. 3 DSGVO</span>
                    </>
                }
                element={
                    <Button
                        onClick={downloadGDPR}
                        loading={loadingGDPR}
                        icon={<TbDownload size={20} />}
                        className={"ml-auto float-right w-full md:w-auto"}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}>
                        Herunterladen
                    </Button>
                }
            />
        </>
    );
}
