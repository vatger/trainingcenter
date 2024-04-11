import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import React from "react";
import { Separator } from "@/components/ui/Separator/Separator";

export function TTViewSettingsSkeleton() {
    return (
        <>
            <div>
                <Skeleton height={20} width={200} />
                <Skeleton height={16} width={300} className={"mt-1"} />
                <Skeleton height={40} className={"mt-2"} />
            </div>

            <div className={"mt-5"}>
                <Skeleton height={20} width={200} />
                <Skeleton height={16} width={300} className={"mt-1"} />
                <Skeleton height={40} className={"mt-2"} />
            </div>

            <Separator />

            <div>
                <Skeleton height={20} width={200} />
                <Skeleton height={16} width={300} className={"mt-1"} />
                <Skeleton height={40} className={"mt-2"} />
            </div>

            <Separator />

            <Skeleton width={260} height={45} />
        </>
    );
}
