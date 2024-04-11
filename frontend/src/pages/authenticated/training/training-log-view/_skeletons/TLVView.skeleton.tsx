import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import React from "react";
import { Card } from "@/components/ui/Card/Card";

export function TLVViewSkeleton() {
    return (
        <>
            <Card>
                <Skeleton height={20} width={200} className={"mb-2"} />
                <Skeleton height={100} />

                <Skeleton height={20} width={200} className={"mb-2 mt-6"} />
                <Skeleton height={100} />

                <div className="progress-wrapper mt-6">
                    <div className="progress-inner">
                        <div className="progress-bg skeleton h-2 transition-all" style={{ width: `50%` }} />
                    </div>
                </div>

                <Skeleton height={20} width={200} className={"mb-2 mt-6"} />
                <Skeleton height={100} />
            </Card>
        </>
    );
}
