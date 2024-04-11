import { TbBell, TbMailOpened } from "react-icons/tb";
import { useEffect, useState } from "react";
import { NotificationModel } from "@/models/NotificationModel";
import { MapArray } from "../../conditionals/MapArray";
import NotificationHelper from "../../../utils/helper/NotificationHelper";
import dayjs from "dayjs";
import { Tooltip } from "../../ui/Tooltip/Tooltip";
import { RenderIf } from "../../conditionals/RenderIf";
import ToastHelper from "../../../utils/helper/ToastHelper";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { useSettingsSelector } from "@/app/features/settingsSlice";
import { useDropdown } from "@/utils/hooks/useDropdown";
import { useAppDispatch } from "@/app/hooks";
import { clearUnreadNotifications, loadNotifications, setNotifications, useNotificationSelector } from "@/app/features/notificationSlice";

export function NotificationHeader() {
    const { language } = useSettingsSelector();
    const dispatch = useAppDispatch();
    const { unreadNotifications } = useNotificationSelector();
    const [markingAllRead, setMarkingAllRead] = useState<boolean>(false);

    const uuid = useDropdown();

    useEffect(() => {
        loadNotifications(dispatch);

        setInterval(() => {
            loadNotifications(dispatch);
        }, 1000 * 60 * 2);
    }, []);

    function markAllAsRead() {
        if (unreadNotifications.length == 0) return;

        setMarkingAllRead(true);

        axiosInstance
            .post("/notification/read/all")
            .then(() => {
                dispatch(clearUnreadNotifications());
            })
            .finally(() => {
                setMarkingAllRead(false);
            });
    }

    return (
        <div>
            <div className="dropdown">
                <div className="dropdown-toggle" id={`dropdown-toggle-${uuid.current}`}>
                    <div className="header-action-item header-action-item-hoverable flex items-center">
                        <TbBell size={20} />
                        <RenderIf
                            truthValue={unreadNotifications.length > 0}
                            elementTrue={<div className={"rounded-full w-[8px] h-[8px] bg-red-500 absolute top-[7px]"} />}
                        />
                    </div>
                </div>

                {/* Dropdown */}
                <ul
                    id={`dropdown-${uuid.current}`}
                    className="dropdown-menu bottom-end p-0 min-w-[300px] md:min-w-[340px] opacity-100 right-[-50px] sm:right-0 hidden">
                    <li className="menu-item-header">
                        <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
                            <h6>Notifications ({unreadNotifications.length})</h6>
                            <span className="tooltip-wrapper">
                                <Tooltip content={"Mark all as read"}>
                                    <Button
                                        icon={<TbMailOpened size={20} />}
                                        onClick={() => markAllAsRead()}
                                        shape={"circle"}
                                        loading={markingAllRead}
                                        size={SIZE_OPTS.SM}
                                        color={COLOR_OPTS.DEFAULT}
                                        className={"border-none"}></Button>
                                </Tooltip>
                            </span>
                        </div>
                    </li>
                    <div className="overflow-y-auto side-nav-hide-scrollbar min-h-[13rem] h-[30vh]">
                        <div className={"relative w-full h-full"}>
                            <div className={"absolute inset-0 overflow-y-auto side-nav-hide-scrollbar mr-0 mb-0"}>
                                <MapArray
                                    data={unreadNotifications}
                                    mapFunction={(n: NotificationModel, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className="relative flex px-4 py-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20 border-b border-gray-200 dark:border-gray-600">
                                                <div>
                                                    <span
                                                        className={`avatar avatar-circle avatar-sm flex justify-center ${NotificationHelper.getIconColorBySeverity(
                                                            n.severity
                                                        )}`}>
                                                        {NotificationHelper.getIconByString(20, n.icon, "m-auto")}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div>{NotificationHelper.convertNotificationContent(n, language)}</div>
                                                    <span className="text-xs">{dayjs(n.createdAt).fromNow()}</span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <li id="menu-item-16-4uY6FZ7s9M" className="menu-item-header">
                        <div className="flex justify-center border-t border-gray-200 dark:border-gray-600 px-4 py-2">
                            <Link
                                to={"/account/manage#notifications"}
                                className={"font-semibold cursor-pointer p-2 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"}>
                                View Notifications
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
