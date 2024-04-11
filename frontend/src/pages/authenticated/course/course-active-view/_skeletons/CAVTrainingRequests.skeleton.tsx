import React from "react";
import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { TableSkeleton } from "@/components/ui/Skeleton/TableSkeleton";

export function CAVTrainingRequestsSkeleton() {
    return (
        <Card header={<Skeleton width={250} height={29} />} headerBorder className={"mt-5"}>
            <Skeleton height={16} className={"mb-2"} />
            <TableSkeleton colCount={4} rowCount={4} />
        </Card>
    );
}
