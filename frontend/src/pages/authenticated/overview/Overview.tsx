import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import React from "react";
import { RatingTimesPartial } from "@/pages/authenticated/overview/_partials/RatingTimes.partial";
import { Separator } from "@/components/ui/Separator/Separator";
import { NextTrainingsPartial } from "@/pages/authenticated/overview/_partials/NextTrainings.partial";
import { StatisticsPartial } from "@/pages/authenticated/overview/_partials/Statistics.partial";
import { EndorsementsPartial } from "@/pages/authenticated/overview/_partials/Endorsements.partial";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";

interface OverviewT {
    count: number;
    completedCount: number;
    upcomingSessions: TrainingSessionModel[];
    endorsementGroups: EndorsementGroupModel[];
}

export function Overview() {
    const { data, loading } = useApi<OverviewT>({
        url: "/overview",
        method: "get",
    });

    return (
        <>
            <PageHeader title={"VATSIM Germany Trainingcenter"} hideBackLink />

            <StatisticsPartial completedCount={data?.completedCount} count={data?.count} loading={loading} />

            <RatingTimesPartial />

            <Separator />

            <NextTrainingsPartial upcomingSessions={data?.upcomingSessions} loading={loading} />

            <EndorsementsPartial endorsementGroups={data?.endorsementGroups} loading={loading} />
        </>
    );
}
