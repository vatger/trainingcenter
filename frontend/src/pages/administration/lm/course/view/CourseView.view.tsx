import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { CVSettingsSubpage } from "@/pages/administration/lm/course/view/_subpages/CVSettings.subpage";
import { CVMentorgroupsSubpage } from "@/pages/administration/lm/course/view/_subpages/CVMentorgroups.subpage";
import { CVUsersSubpage } from "@/pages/administration/lm/course/view/_subpages/CVUsers.subpage";
import { CVDangerSubpage } from "@/pages/administration/lm/course/view/_subpages/CVDanger.subpage";
import React from "react";
import { CVTrainingTypesSubpage } from "@/pages/administration/lm/course/view/_subpages/CVTrainingTypes.subpage";

// "Aktionen & Bedingungen",
const tabHeaders = ["Einstellungen", "Mentorgruppen", "Trainingstypen", "Teilnehmer", "Gefahrenbereich"];

export function CourseViewView() {
    const { uuid } = useParams();

    return (
        <>
            <PageHeader title={"Kurs Verwalten"} />

            <Card>
                <Tabs type={"underline"} tabHeaders={tabHeaders}>
                    <CVSettingsSubpage courseUUID={uuid} />
                    <CVMentorgroupsSubpage courseUUID={uuid} />
                    <CVTrainingTypesSubpage courseUUID={uuid} />
                    {/*<div></div>*/}
                    <CVUsersSubpage courseUUID={uuid} />
                    <CVDangerSubpage uuid={uuid} />
                </Tabs>
            </Card>
        </>
    );
}
