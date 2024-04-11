import { Tabs } from "@/components/ui/Tabs/Tabs";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { MAProfilePartial } from "./_partials/MAProfile.partial";
import { MASettingsPartial } from "./_partials/MASettings.partial";
import { MADangerPartial } from "./_partials/MADanger.partial";
import React from "react";
import { Card } from "@/components/ui/Card/Card";
import { MANotificationsPartial } from "@/pages/authenticated/account/manage-account/_partials/MANotifications.partial";
import { MASignedInDevicesPartial } from "@/pages/authenticated/account/manage-account/_partials/MASignedInDevices.partial";

const tabHeaders = ["Profile", "Settings", "Notifications", "Angemeldete Geräte", "Gefahrenbereich"];

export function ManageAccountView() {
    return (
        <>
            <PageHeader
                title={"Account Verwalten"}
                breadcrumbs={<pre className={"bg-gray-200 mt-2 md:mt-0 dark:bg-gray-700 px-3 rounded text-gray-400"}>{"v" + APP_VERSION}</pre>}
                hideBackLink
            />
            <div className={"sm:hidden block"}>
                <pre className={"bg-gray-200 inline-block mt-[-15px] mb-7 md:mt-0 dark:bg-gray-700 px-3 rounded text-gray-400"}>{"v" + APP_VERSION}</pre>
            </div>

            <Card>
                <Tabs tabHeaders={tabHeaders} type={"underline"}>
                    <MAProfilePartial />
                    <MASettingsPartial />
                    <MANotificationsPartial />
                    <MASignedInDevicesPartial />
                    <MADangerPartial />
                </Tabs>
            </Card>
        </>
    );
}
