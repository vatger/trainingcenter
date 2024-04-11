import { Card } from "@/components/ui/Card/Card";
import { getAtcRatingLong, getAtcRatingShort } from "@/utils/helper/vatsim/AtcRatingHelper";
import React from "react";
import { useUserSelector } from "@/app/features/authSlice";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import generalTranslation from "@/assets/lang/generic.translation";
import { useSettingsSelector } from "@/app/features/settingsSlice";
import useApi from "@/utils/hooks/useApi";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

interface StatisticsT {
    count?: number;
    completedCount?: number;
    loading: boolean;
}

export function StatisticsPartial(props: StatisticsT) {
    const user = useUserSelector();
    const language = useSettingsSelector().language;

    return (
        <>
            <div className={"hidden sm:grid grid-cols-1 md:grid-cols-3 gap-5 mb-5"}>
                <Card header={"ATC Rating"} headerBorder>
                    <h5 className={"text-secondary"}>
                        {getAtcRatingLong(user?.user_data?.rating_atc ?? -1)} ({getAtcRatingShort(user?.user_data?.rating_atc ?? -1)})
                    </h5>
                </Card>

                <Card header={"Subdivision"} headerBorder>
                    <div className="flex justify-between items-center">
                        <h5 className={"text-secondary"}>{user?.user_data?.subdivision_code}</h5>
                        <RenderIf
                            truthValue={user?.user_data?.subdivision_code?.toLowerCase() != "ger"}
                            elementTrue={<Badge color={COLOR_OPTS.PRIMARY}>{generalTranslation.guest[language]}</Badge>}
                            elementFalse={<Badge color={COLOR_OPTS.SUCCESS}>{generalTranslation.home[language]}</Badge>}
                        />
                    </div>
                </Card>

                <Card header={"Trainings"} headerBorder>
                    <RenderIf
                        truthValue={props.loading}
                        elementTrue={<Skeleton height={28} />}
                        elementFalse={
                            <div className="flex flex-row justify-between md:items-center">
                                <h5 className={"text-secondary"}>{props?.count}</h5>
                                <Badge color={COLOR_OPTS.PRIMARY}>{`${props?.completedCount} Abgeschlossen`}</Badge>
                            </div>
                        }
                    />
                </Card>
            </div>
        </>
    );
}
