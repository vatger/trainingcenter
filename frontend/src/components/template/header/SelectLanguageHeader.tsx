import { BiCheck } from "react-icons/bi";
import { MenuItem } from "../../ui/MenuItem/MenuItem";
import { useContext, useEffect, useRef, useState } from "react";
import { generateUUID } from "@/utils/helper/UUIDHelper";

import "./GenericHeaderAnimation.scss";
import languageTranslation from "../../../assets/lang/language.translation";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";

import flagDe from "@/assets/img/flag_de.png";
import flagEn from "@/assets/img/flag_en.png";
import { setLanguage, useSettingsSelector } from "@/app/features/settingsSlice";
import { store } from "@/app/store";
import LocalStorageLibrary from "@/utils/library/LocalStorageLibrary";
import { Config } from "@/core/Config";
import { useDropdown } from "@/utils/hooks/useDropdown";

const flag_de = (
    <div className={"w-[20px] h-[20px] avatar-circle"}>
        <img className={"avatar-img avatar-circle"} alt={"German Flag"} src={flagDe} />
    </div>
);
const flag_en = (
    <div className={"w-[20px] h-[20px] avatar-circle"}>
        <img className={"avatar-img avatar-circle"} alt={"UK Flag"} src={flagEn} />
    </div>
);

export function SelectLanguageHeader({ saveSelection }: { saveSelection?: boolean }) {
    const { language } = useSettingsSelector();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const uuid = useDropdown();

    function updateSettings(value: { language: string }) {
        if (!saveSelection) return;

        setSubmitting(true);

        axiosInstance
            .patch("/settings", value)
            .catch(() => {
                ToastHelper.error("Fehler beim speichern der Einstellungen");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <div>
            <div className="dropdown">
                <div className="dropdown-toggle" id={`dropdown-toggle-${uuid.current}`}>
                    <div className="header-action-item header-action-item-hoverable flex items-center">
                        <span className="avatar avatar-circle w-[20px] h-[20px] min-w-[20px]" style={{ lineHeight: 24, fontSize: 12 }}>
                            {language == "en" ? flag_en : flag_de}
                        </span>
                    </div>
                </div>

                {/* Dropdown */}
                <ul id={`dropdown-${uuid.current}`} className={"dropdown-menu bottom-end right-[-94px] sm:right-0 min-w-[220px] hidden"}>
                    <MenuItem
                        disabled={submitting}
                        onClick={() => {
                            store.dispatch(setLanguage("de"));
                            updateSettings({ language: "de" });

                            if (window.location.href.includes("/login")) {
                                LocalStorageLibrary.setKey(Config.VATGER_LOGIN_LANGUAGE_NAME, "de");
                            }
                        }}
                        isNoLink
                        icon={flag_de}
                        icon_suffix={language == "de" ? <BiCheck size={20} /> : <></>}>
                        {languageTranslation.german[language]}
                    </MenuItem>
                    <MenuItem
                        disabled={submitting}
                        onClick={() => {
                            store.dispatch(setLanguage("en"));
                            updateSettings({ language: "en" });

                            if (window.location.href.includes("/login")) {
                                LocalStorageLibrary.setKey(Config.VATGER_LOGIN_LANGUAGE_NAME, "en");
                            }
                        }}
                        isNoLink
                        icon={flag_en}
                        icon_suffix={language == "en" ? <BiCheck size={20} /> : <></>}>
                        {languageTranslation.english[language]}
                    </MenuItem>
                </ul>
            </div>
        </div>
    );
}
