import { RenderIf } from "../../../../../components/conditionals/RenderIf";
import { MapArray } from "../../../../../components/conditionals/MapArray";
import { Skeleton } from "../../../../../components/ui/Skeleton/Skeleton";
import { TimeLine } from "../../../../../components/ui/Timeline/TimeLine";
import { Card } from "../../../../../components/ui/Card/Card";

const TIMELINE_COUNT = 3;

export function CAVTrainingHistorySkeleton() {
    return (
        <>
            <Card header={<Skeleton width={250} height={29} />} headerBorder className={"mt-5"}>
                <TimeLine>
                    <MapArray
                        data={Array(TIMELINE_COUNT).fill(0)}
                        mapFunction={(value: any, index: number) => {
                            return (
                                <li key={index} className="timeline-item">
                                    <div className="timeline-item-wrapper">
                                        <div className="timeline-item-media">
                                            <div className="timeline-item-media-content">
                                                <Skeleton className={"rounded-full"} height={29} width={29} />
                                            </div>
                                            <RenderIf truthValue={index != TIMELINE_COUNT - 1} elementTrue={<div className="timeline-connect"></div>} />
                                        </div>
                                        <div className="timeline-item-content">
                                            <div className={"flex justify-between w-full"}>
                                                <Skeleton width={150} height={21} />
                                                <Skeleton width={100} height={17} />
                                            </div>
                                            <div className="card mt-4">
                                                <Skeleton height={82} />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        }}
                    />
                </TimeLine>
            </Card>
        </>
    );
}
