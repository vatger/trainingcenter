import { TableColumn } from "react-data-table-component";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Button } from "@/components/ui/Button/Button";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Dispatch, useState } from "react";
import { UserSessionModel } from "@/models/UserSessionModel";
import { TbTrash } from "react-icons/tb";
import SessionService from "@/pages/login/_services/SessionService";
import ToastHelper from "@/utils/helper/ToastHelper";

function getColumns(sessions: UserSessionModel[], setSessions: Dispatch<UserSessionModel[]>): TableColumn<UserSessionModel>[] {
    const [deletingID, setDeletingID] = useState<number | undefined>(undefined);

    function deleteSession(sessionID: number) {
        setDeletingID(sessionID);
        SessionService.deleteSession(sessionID)
            .then(() => {
                const newSessions = sessions.filter(s => s.id != sessionID);
                setSessions(newSessions);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Löschen der Session");
            })
            .finally(() => setDeletingID(undefined));
    }

    return [
        {
            name: "Client",
            selector: row => row.client ?? "",
        },
        {
            name: "Browser UUID",
            selector: row => row.browser_uuid,
        },
        {
            name: "Erstellt",
            selector: row => dayjs(row.createdAt).format(Config.DATETIME_FORMAT + "Z"),
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        variant={"twoTone"}
                        color={COLOR_OPTS.DANGER}
                        size={SIZE_OPTS.SM}
                        icon={<TbTrash size={20} />}
                        disabled={deletingID != null}
                        loading={deletingID == row.id}
                        onClick={() => deleteSession(row.id)}>
                        Löschen
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
