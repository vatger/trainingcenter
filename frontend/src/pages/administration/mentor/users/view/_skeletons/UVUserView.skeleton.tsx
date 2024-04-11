import { Skeleton } from "../../../../../../components/ui/Skeleton/Skeleton";
import { Badge } from "../../../../../../components/ui/Badge/Badge";
import { COLOR_OPTS } from "../../../../../../assets/theme.config";
import { Card } from "../../../../../../components/ui/Card/Card";
import React from "react";
import { MapArray } from "../../../../../../components/conditionals/MapArray";

export function UVUserViewSkeleton() {
    return (
        <div>
            <Card header={"Allgemeine Informationen"} headerBorder headerExtra={<Badge color={COLOR_OPTS.PRIMARY}>Laden...</Badge>}>
                <div className={"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"}>
                    <MapArray
                        data={Array(6).fill(0)}
                        mapFunction={(value, index) => {
                            return (
                                <div key={index}>
                                    <Skeleton height={24} width={100} className={"mb-2"} />
                                    <Skeleton height={40} />
                                </div>
                            );
                        }}
                    />
                </div>

                <div className={"flex flex-col lg:flex-row mt-7"}>
                    <Skeleton height={36} width={222} />
                </div>
            </Card>

            <Card header={"Kurse"} className={"mt-7"} headerBorder headerExtra={<Badge color={COLOR_OPTS.PRIMARY}>Laden...</Badge>}>
                <Skeleton height={52} className={"mb-3"} />
                <div className={"grid grid-cols-1 gap-2"}>
                    <MapArray
                        data={Array(6).fill(0)}
                        mapFunction={(value, index) => {
                            return (
                                <div key={index}>
                                    <Skeleton height={20} />
                                </div>
                            );
                        }}
                    />
                </div>
            </Card>

            <Card header={"Mentorengruppen"} className={"mt-7"} headerBorder headerExtra={<Badge color={COLOR_OPTS.PRIMARY}>Laden...</Badge>}>
                <Skeleton height={52} className={"mb-3"} />
                <div className={"grid grid-cols-1 gap-2"}>
                    <MapArray
                        data={Array(6).fill(0)}
                        mapFunction={(value, index) => {
                            return (
                                <div key={index}>
                                    <Skeleton height={20} />
                                </div>
                            );
                        }}
                    />
                </div>
            </Card>
        </div>
    );
}
