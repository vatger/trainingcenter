import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import React from "react";
import { Separator } from "@/components/ui/Separator/Separator";

export function EGVSettingsSkeleton() {
    return (
        <>
            <Skeleton className={"mb-2"} height={24} width={200} />
            <Skeleton height={39} />

            <Separator />

            <Skeleton className={"mb-2"} height={24} width={200} />
            <Skeleton height={39} />

            <Separator />

            <Skeleton className={"mt-7"} height={36} width={227} />
        </>
    );
}
