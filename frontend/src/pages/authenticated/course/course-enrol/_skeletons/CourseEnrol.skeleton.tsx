import React from "react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { MapArray } from "@/components/conditionals/MapArray";
import { Card } from "@/components/ui/Card/Card";
import { Separator } from "@/components/ui/Separator/Separator";

export function CourseEnrolSkeleton() {
    return (
        <Card header={<Skeleton height={29} width={250} />} headerBorder>
            <MapArray
                data={Array(4).fill(0)}
                mapFunction={(v, i) => {
                    return (
                        <div key={i} className={"flex mb-3"}>
                            <Skeleton circle={true} width={24} height={24} />
                            <Skeleton className={"ml-3"} height={24} width={500} />
                        </div>
                    );
                }}
            />

            <Skeleton className={"mt-5"} height={20} width={400} />

            <Separator />

            <Skeleton height={44} width={250} />
        </Card>
    );
}
