import SessionService from "@/pages/login/_services/SessionService";
import { Table } from "@/components/ui/Table/Table";
import MASignedInDevicesListTypes from "@/pages/authenticated/account/manage-account/_types/MASignedInDevicesList.types";
import { Config } from "@/core/Config";

export function MASignedInDevicesPartial() {
    const { userLoginSessions, setUserLoginSessions, loading } = SessionService.getUserSessions();

    return (
        <>
            <p>
                Die Browser UUID wird, zusammen mit weiteren Sicherheitsmaßnahmen, genutzt um dich und dein Gerät eindeutig identifizieren und authentifizieren
                zu können. Sollte dir einer dieser Clients / UUIDs unbekannt vorkommen, lösche sofort die entsprechende Session und melde dich bei uns, da dies
                bedeuten könnte, dass jemand anderes Zugriff auf dein Konto erhalten hat.
            </p>
            <p>
                Deine aktuelle Browser UUID lautet: <strong>{window.localStorage.getItem(Config.VATGER_BROWSER_TOKEN_NAME)}</strong>
            </p>
            <Table
                className={"mt-5"}
                columns={MASignedInDevicesListTypes.getColumns(userLoginSessions, setUserLoginSessions)}
                data={userLoginSessions}
                loading={loading}
            />
        </>
    );
}
