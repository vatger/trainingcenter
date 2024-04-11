import { Separator } from "@/components/ui/Separator/Separator";
import React from "react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export function CVSettingsSkeleton() {
    return (
        <>
            <Skeleton height={20} width={130} />
            <Skeleton height={39} className={"mt-2"} />

            <Skeleton height={20} width={130} className={"mt-5"} />
            <Skeleton height={39} className={"mt-2"} />

            <Separator />

            <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={16} width={300} className={"mt-1"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={16} width={300} className={"mt-1"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={16} width={300} className={"mt-1"} />
                    <Skeleton height={150} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={16} width={300} className={"mt-1"} />
                    <Skeleton height={150} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={16} width={300} className={"mt-1"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={16} width={300} className={"mt-1"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>
            </div>

            <Separator />

            <Skeleton height={20} width={130} />
            <Skeleton height={39} className={"mt-2"} />

            <Skeleton height={20} width={130} className={"mt-5"} />
            <Skeleton height={39} className={"mt-2"} />

            <Separator />

            <Skeleton width={260} height={45} />
        </>
    );
}
