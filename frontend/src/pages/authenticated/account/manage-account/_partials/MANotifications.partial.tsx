import { Table } from "@/components/ui/Table/Table";
import MANotificationListTypes from "@/pages/authenticated/account/manage-account/_types/MANotificationList.types";
import { NotificationModel } from "@/models/NotificationModel";
import { setNotifications, useNotificationSelector } from "@/app/features/notificationSlice";
import { Modal } from "@/components/ui/Modal/Modal";
import React, { useState } from "react";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { useAppDispatch } from "@/app/hooks";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import NotificationHelper from "@/utils/helper/NotificationHelper";
import { useSettingsSelector } from "@/app/features/settingsSlice";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Alert } from "@/components/ui/Alert/Alert";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { TbExternalLink, TbEye, TbEyeOff, TbTrash } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

export function MANotificationsPartial() {
    const dispatch = useAppDispatch();
    const { language } = useSettingsSelector();
    const { notifications, loadingNotifications } = useNotificationSelector();

    const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
    const [selectedNotification, setSelectedNotification] = useState<NotificationModel | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false);

    function deleteNotification(notificationID?: number) {
        if (!notificationID) return;
        setLoading(true);

        const formData = new FormData();
        FormHelper.set(formData, "notification_id", notificationID);

        axiosInstance
            .delete("/notification", { data: formData })
            .then(() => {
                const newNotifications = notifications.filter(n => n.id != notificationID);
                dispatch(setNotifications(newNotifications));
            })
            .catch(() => {
                ToastHelper.error("Fehler beim löschen der Benachrichtigung");
            })
            .finally(() => {
                setSelectedNotification(undefined);
                setShowNotificationModal(false);
                setLoading(false);
            });
    }

    function toggleRead(notificationID?: number) {
        if (!notificationID) return;
        setLoading(true);

        const formData = new FormData();
        FormHelper.set(formData, "notification_id", notificationID);

        axiosInstance
            .post("/notification/toggle", formData)
            .then(() => {
                const newNotifications = notifications.map(n => {
                    if (n.id === notificationID) {
                        return { ...n, read: !n.read };
                    }

                    return n;
                });

                dispatch(setNotifications(newNotifications));
            })
            .catch(() => {
                ToastHelper.error("Fehler beim aktualisieren der Benachrichtigung");
            })
            .finally(() => {
                setSelectedNotification(undefined);
                setShowNotificationModal(false);
                setLoading(false);
            });
    }

    return (
        <>
            <Table
                columns={MANotificationListTypes.getColumns(notifications, setShowNotificationModal, setSelectedNotification)}
                defaultSortField={1}
                paginate
                loading={loadingNotifications}
                data={notifications ?? []}
            />

            <Modal
                show={showNotificationModal}
                title={"Benachrichtigung"}
                onClose={() => {
                    setShowNotificationModal(false);
                    setSelectedNotification(undefined);
                }}
                footer={
                    <div className={"flex flex-col w-full"}>
                        <RenderIf
                            truthValue={selectedNotification?.read == true}
                            elementTrue={
                                <Button
                                    icon={<TbEyeOff size={20} />}
                                    loading={loading}
                                    variant={"twoTone"}
                                    onClick={() => toggleRead(selectedNotification?.id)}
                                    color={COLOR_OPTS.PRIMARY}>
                                    Als Ungelesen Markieren
                                </Button>
                            }
                            elementFalse={
                                <Button
                                    icon={<TbEye size={20} />}
                                    loading={loading}
                                    variant={"twoTone"}
                                    onClick={() => toggleRead(selectedNotification?.id)}
                                    color={COLOR_OPTS.PRIMARY}>
                                    Als Gelesen Markieren
                                </Button>
                            }
                        />

                        <Button
                            icon={<TbTrash size={20} />}
                            className={"mt-3"}
                            loading={loading}
                            variant={"twoTone"}
                            onClick={() => deleteNotification(selectedNotification?.id)}
                            color={COLOR_OPTS.DANGER}>
                            Löschen
                        </Button>
                    </div>
                }>
                <RenderIf
                    truthValue={selectedNotification == null}
                    elementTrue={
                        <Alert type={TYPE_OPTS.DANGER} showIcon>
                            Ein unerwarteter Fehler ist aufgetreten. Probiere es bitte erneut.
                        </Alert>
                    }
                    elementFalse={
                        <>
                            <Input
                                disabled
                                label={"Erstellt Am"}
                                labelSmall
                                value={dayjs.utc(selectedNotification?.createdAt).format(Config.DATETIME_FORMAT)}
                            />

                            <RenderIf
                                truthValue={selectedNotification?.link != null}
                                elementTrue={
                                    <div className={"flex"}>
                                        <Input disabled className={"mt-5 mr-2 flex-grow"} label={"Link"} labelSmall value={selectedNotification?.link} />

                                        <a className={"mt-auto"} href={selectedNotification?.link} target={"_self"}>
                                            <Button
                                                className={"w-auto h-[39px]"}
                                                variant={"twoTone"}
                                                color={COLOR_OPTS.PRIMARY}
                                                icon={<TbExternalLink size={20} />}
                                            />
                                        </a>
                                    </div>
                                }
                            />

                            <TextArea
                                className={"mt-5"}
                                disabled
                                label={"Nachricht"}
                                labelSmall
                                value={NotificationHelper.convertNotificationContent(selectedNotification, language)}
                            />
                        </>
                    }
                />
            </Modal>
        </>
    );
}
