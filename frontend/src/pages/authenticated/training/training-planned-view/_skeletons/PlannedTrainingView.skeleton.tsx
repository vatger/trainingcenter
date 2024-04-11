import { Card } from "@/components/ui/Card/Card";
import { Separator } from "@/components/ui/Separator/Separator";
import React from "react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export function PlannedTrainingViewSkeleton() {
    return (
        <Card>
            <div>
                <Skeleton height={20} width={130} className={"mb-2"} />
                <Skeleton height={39} />
            </div>

            <Separator />

            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                <div>
                    <Skeleton height={20} width={130} className={"mb-2"} />
                    <Skeleton height={39} />
                </div>

                <div>
                    <Skeleton height={20} width={130} className={"mb-2"} />
                    <Skeleton height={39} />
                </div>

                <div>
                    <Skeleton height={20} width={130} className={"mb-2"} />
                    <Skeleton height={39} />
                </div>

                <div>
                    <Skeleton height={20} width={130} className={"mb-2"} />
                    <Skeleton height={39} />
                </div>
            </div>

            <Separator />

            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                <div>
                    <Skeleton height={20} width={130} className={"mb-2"} />
                    <Skeleton height={39} />
                </div>

                <div>
                    <Skeleton height={20} width={130} className={"mb-2"} />
                    <Skeleton height={39} />
                </div>
            </div>

            <Separator />

            <Skeleton height={44} width={170} />
        </Card>
    );
}
