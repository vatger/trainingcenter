import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import React from "react";
import { Tabs } from "@/components/ui/Tabs/Tabs";
import { TTVSettingsSubpage } from "./_subpages/TTVSettings.subpage";
import { TTVTrainingStationsSubpage } from "@/pages/administration/lm/training-type/view/_subpages/TTVTrainingStations.subpage";

const tabHeaders = ["Einstellungen", "Trainingsstationen"];

export function TrainingTypeViewView() {
    const { id } = useParams();

    return (
        <>
            <PageHeader title={"Trainingstyp Verwalten"} />

            <Card>
                <Tabs type={"underline"} tabHeaders={tabHeaders}>
                    <TTVSettingsSubpage trainingTypeID={id} />
                    <TTVTrainingStationsSubpage trainingTypeID={id} />
                </Tabs>
            </Card>
        </>
    );
}
