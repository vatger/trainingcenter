import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { MGVSettingsSubpage } from "./_subpages/MGVSettings.subpage";
import React from "react";
import { MGVEndorsementGroupsSubpage } from "@/pages/administration/lm/mentor-group/view/_subpages/MGVEndorsementGroups.subpage";
import { MGVDangerSubpage } from "@/pages/administration/lm/mentor-group/view/_subpages/MGVDanger.subpage";
import { MGVUsersSubpage } from "@/pages/administration/lm/mentor-group/view/_subpages/MGVUsers.subpage";

export function MentorGroupViewView() {
    const { id: mentor_group_id } = useParams();

    return (
        <>
            <PageHeader title={"Mentorengruppe Verwalten"} />

            <Card>
                <Tabs tabHeaders={["Einstellungen", "Mitglieder", "Freigabegruppen", "Gefahrenbereich"]} type={"underline"}>
                    <MGVSettingsSubpage mentorGroupID={mentor_group_id} />
                    <MGVUsersSubpage mentorGroupID={mentor_group_id} />
                    <MGVEndorsementGroupsSubpage mentorGroupID={mentor_group_id} />
                    <MGVDangerSubpage />
                </Tabs>
            </Card>
        </>
    );
}
