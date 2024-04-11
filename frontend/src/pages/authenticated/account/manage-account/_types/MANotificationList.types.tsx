import { NotificationModel } from "@/models/NotificationModel";
import React, { Dispatch } from "react";
import { TableColumn } from "react-data-table-component";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import NotificationHelper from "@/utils/helper/NotificationHelper";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { useSettingsSelector } from "@/app/features/settingsSlice";
import { Button } from "@/components/ui/Button/Button";
import { TbEye, TbEyeOff, TbTrash } from "react-icons/tb";

function getColumns(
    notifications: NotificationModel[],
    setShowNotificationModal: Dispatch<boolean>,
    setSelectedNotification: Dispatch<NotificationModel>
): TableColumn<NotificationModel>[] {
    return [
        {
            name: "Status",
            cell: row => {
                if (!row.read) {
                    return <Badge color={COLOR_OPTS.DANGER}>Ungelesen</Badge>;
                }

                return <Badge color={COLOR_OPTS.SUCCESS}>Gelesen</Badge>;
            },
            sortable: true,
            sortFunction: (a, b) => (a.read && !b.read ? 1 : -1),
        },
        {
            name: "Erstellt Am",
            cell: row => dayjs.utc(row.createdAt).format(Config.DATETIME_FORMAT),
            sortable: true,
            sortFunction: (a, b) => {
                if (a.createdAt == null || b.createdAt == null) {
                    return 0;
                }

                return a.createdAt > b.createdAt ? 1 : -1;
            },
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            color={COLOR_OPTS.PRIMARY}
                            variant={"twoTone"}
                            icon={<TbEye size={20} />}
                            onClick={() => {
                                setSelectedNotification(row);
                                setShowNotificationModal(true);
                            }}
                            size={SIZE_OPTS.SM}>
                            Ansehen
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
