import { TbActivityHeartbeat, TbLogout, TbSettings, TbUser } from "react-icons/tb";
import { MenuItem } from "../../ui/MenuItem/MenuItem";
import React, { useEffect, useRef, useState } from "react";
import { generateUUID } from "@/utils/helper/UUIDHelper";
import "./GenericHeaderAnimation.scss";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { Spinner } from "../../ui/Spinner/Spinner";
import { signOut, useAuthSelector, useUserSelector } from "@/app/features/authSlice";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { useDropdown } from "@/utils/hooks/useDropdown";

function getUserTitle() {
    const permissions = useAuthSelector().userPermissions;

    if (permissions.includes("TECH.VIEW")) {
        return "Administrator";
    }

    if (permissions.includes("ATD.VIEW")) {
        return "ATD";
    }

    if (permissions.includes("LM.VIEW")) {
        return "Leitender Mentor";
    }

    if (permissions.includes("MENTOR.VIEW")) {
        return "Mentor";
    }

    return "Trainee";
}

export function UserProfileHeader() {
    const user = useUserSelector();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const uuid = useDropdown();

    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    function handleLogout() {
        setLoggingOut(true);

        axiosInstance
            .post("/auth/logout")
            .then(res => {
                if (res.data.success) {
                    navigate("/login?logout");
                    dispatch(signOut());
                }
            })
            .catch(() => {
                setLoggingOut(false);
            });
    }

    return (
        <div>
            <div className="dropdown">
                <div className="dropdown-toggle" id={`dropdown-toggle-${uuid.current}`}>
                    <div className="header-action-item flex header-action-item-hoverable md:rounded-md items-center gap-2">
                        <div className={"header-action-item p-0 m-0 md:mr-2 mr-0"}>
                            <TbUser size={20} />
                        </div>
                        <div className="hidden md:block mr-1">
                            <div className="text-xs capitalize">{getUserTitle()}</div>
                            <div className="font-bold">{user?.first_name + " " + user?.last_name}</div>
                        </div>
                    </div>
                </div>

                {/* Dropdown */}
                <ul id={`dropdown-${uuid.current}`} className={"dropdown-menu bottom-end right-[-6px] sm:right-0 min-w-[220px] hidden"}>
                    <li className="menu-item-header">
                        <div className="py-2 px-3 flex items-center gap-2">
                            <div>
                                <div className="font-bold text-gray-900 dark:text-gray-100">{user?.first_name + " " + user?.last_name}</div>
                                <div className="text-xs">{user?.email}</div>
                            </div>
                        </div>
                    </li>
                    <li id="menu-item-16-GcfayYzLSI" className="menu-item-divider"></li>
                    <MenuItem href={"account/manage#profile"} icon={<TbUser size={20} />}>
                        Profile
                    </MenuItem>
                    <MenuItem href={"account/manage#settings"} icon={<TbSettings size={20} />}>
                        Settings
                    </MenuItem>
                    <MenuItem icon={<TbActivityHeartbeat size={20} />}>Activity</MenuItem>
                    <li id="menu-item-16-GcfayYzLSI" className="menu-item-divider"></li>
                    <MenuItem
                        disabled={loggingOut}
                        onClick={() => handleLogout()}
                        isNoLink
                        className={"text-danger"}
                        icon={loggingOut ? <Spinner size={20} className={"my-auto"} borderWidth={2} color={"rgb(239 68 68)"} /> : <TbLogout size={20} />}>
                        {loggingOut ? "Logging Out" : "Logout"}
                    </MenuItem>
                </ul>
            </div>
        </div>
    );
}
