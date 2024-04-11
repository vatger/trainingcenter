import { Card } from "../../../../../components/ui/Card/Card";
import React from "react";
import { Skeleton } from "../../../../../components/ui/Skeleton/Skeleton";

export function CAVInformationSkeleton(props: { className?: string }) {
    return (
        <>
            <Card
                header={<Skeleton width={250} height={28} />}
                headerBorder
                headerExtra={<Skeleton width={110} height={19} />}
                className={props.className ?? ""}>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                    <div>
                        <Skeleton className={"mb-2"} height={24} width={200} />
                        <Skeleton height={39} />
                    </div>
                    <div>
                        <Skeleton className={"mb-2"} height={24} width={200} />
                        <Skeleton height={39} />
                    </div>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mt-5"}>
                    <div>
                        <Skeleton className={"mb-2"} height={24} width={200} />
                        <Skeleton height={39} />
                    </div>
                    <div>
                        <Skeleton className={"mb-2"} height={24} width={200} />
                        <Skeleton height={39} />
                    </div>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mt-5"}>
                    <div>
                        <Skeleton className={"mb-2"} height={24} width={200} />
                        <Skeleton height={39} />
                    </div>
                </div>

                <Skeleton className={"mt-7"} height={36} width={227} />
            </Card>
        </>
    );
}
