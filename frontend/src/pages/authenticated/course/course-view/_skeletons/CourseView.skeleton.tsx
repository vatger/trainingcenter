import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export function CourseViewSkeleton() {
    return (
        <>
            <Card header={<Skeleton height={29} width={250} />} headerBorder>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"}>
                    <div>
                        <Skeleton height={20} width={130} className={"mb-2"} />
                        <Skeleton height={39} />
                    </div>

                    <div>
                        <Skeleton height={20} width={130} className={"mb-2"} />
                        <Skeleton height={39} />
                    </div>

                    <div>
                        <Skeleton height={20} width={130} className={"mb-2"} />
                        <Skeleton height={39} />
                    </div>

                    <div>
                        <Skeleton height={20} width={130} className={"mb-2"} />
                        <Skeleton height={39} />
                    </div>
                </div>
            </Card>

            <Card header={<Skeleton height={29} width={250} />} className={"mt-7"} headerBorder>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"}>
                    <div>
                        <Skeleton height={20} width={130} className={"mb-2"} />
                        <Skeleton height={39} />
                    </div>

                    <div>
                        <Skeleton height={20} width={130} className={"mb-2"} />
                        <Skeleton height={39} />
                    </div>
                </div>
            </Card>
        </>
    );
}
