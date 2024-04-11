import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { EGVSettingsSubpage } from "@/pages/administration/lm/endorsement-group/view/_subpages/EGVSettings.subpage";
import { EGVStationsSubpage } from "@/pages/administration/lm/endorsement-group/view/_subpages/EGVStations.subpage";
import { EGVUsersSubpage } from "@/pages/administration/lm/endorsement-group/view/_subpages/EGVUsers.subpage";
import { EGVDangerSubpage } from "@/pages/administration/lm/endorsement-group/view/_subpages/EGVDanger.subpage";

export function EndorsementGroupViewView() {
    return (
        <>
            <PageHeader title={"Freigabegruppe Verwalten"} />

            <Card>
                <Tabs tabHeaders={["Einstellungen", "Stationen", "Mitglieder", "Gefahrenbereich"]} type={"underline"}>
                    <EGVSettingsSubpage />
                    <EGVStationsSubpage />
                    <EGVUsersSubpage />
                    <EGVDangerSubpage />
                </Tabs>
            </Card>
        </>
    );
}
