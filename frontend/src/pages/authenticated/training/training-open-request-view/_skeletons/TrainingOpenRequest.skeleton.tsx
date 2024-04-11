import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Separator } from "@/components/ui/Separator/Separator";
import React from "react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export function TrainingOpenRequestSkeleton() {
    return (
        <>
            <PageHeader title={"Trainingsanfrage Verwalten"} />

            <Card>
                <Skeleton height={20} width={200} className={"mt-5"} />
                <Skeleton height={40} className={"mt-2"} />

                <Skeleton height={20} width={200} className={"mt-5"} />
                <Skeleton height={40} className={"mt-2"} />

                <Separator />

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                    <div>
                        <Skeleton height={20} width={200} />
                        <Skeleton height={40} className={"mt-2"} />
                    </div>

                    <div>
                        <Skeleton height={20} width={200} />
                        <Skeleton height={40} className={"mt-2"} />
                    </div>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mt-5"}>
                    <div>
                        <Skeleton height={20} width={200} className={"mt-5"} />
                        <Skeleton height={40} className={"mt-2"} />
                    </div>

                    <div>
                        <Skeleton height={20} width={200} className={"mt-5"} />
                        <Skeleton height={40} className={"mt-2"} />
                    </div>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mt-5"}>
                    <div>
                        <Skeleton height={20} width={200} className={"mt-5"} />
                        <Skeleton height={40} className={"mt-2"} />
                    </div>

                    <div>
                        <Skeleton height={20} width={200} className={"mt-5"} />
                        <Skeleton height={40} className={"mt-2"} />
                    </div>
                </div>

                <div className={"mt-5"}>
                    <Skeleton height={20} width={200} className={"mt-10"} />
                    <Skeleton height={120} className={"mt-2"} />
                </div>

                <Separator />

                <div className={"flex lg:flex-row flex-col"}>
                    <Skeleton height={44} width={260} className={"mt-2 mr-3"} />
                    <Skeleton height={44} width={260} className={"mt-2"} />
                </div>
            </Card>
        </>
    );
}
