import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Separator } from "@/components/ui/Separator/Separator";

export function OpenTrainingRequestSkeleton() {
    return (
        <Card>
            <Skeleton height={20} width={130} className={"mb-2"} />
            <Skeleton height={39} />

            <Skeleton height={20} width={130} className={"mb-2 mt-5"} />
            <Skeleton height={39} />

            <Separator />

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

            <Skeleton height={20} width={130} className={"mb-2 mt-5"} />
            <Skeleton height={100} />

            <Separator />

            <div className={"flex flex-row"}>
                <Skeleton width={160} height={44} className={"mr-3"} />
                <Skeleton width={160} height={44} />
            </div>
        </Card>
    );
}
