import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import React from "react";
import { Separator } from "@/components/ui/Separator/Separator";

export function LTViewSkeleton() {
    return (
        <>
            <Card header={"Eigenschaften"} headerBorder>
                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={16} width={300} className={"mt-1"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <Separator />

                <Skeleton width={260} height={45} />
            </Card>

            <Card className={"mt-5"} header={"Inhalt der Logvorlage"} headerBorder>
                <div>
                    <Skeleton height={100} />
                    <Skeleton height={100} className={"mt-6"} />
                    <Skeleton height={100} className={"mt-6"} />
                </div>

                <Separator />

                <div className={"flex flex-col lg:flex-row"}>
                    <Skeleton height={45} width={260} />
                    <Skeleton height={45} width={260} className={"mt-4 lg:mt-0 lg:ml-4"} />
                </div>
            </Card>
        </>
    );
}
