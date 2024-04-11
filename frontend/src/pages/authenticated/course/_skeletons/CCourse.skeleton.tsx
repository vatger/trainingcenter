import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export function CCourseSkeleton() {
    return (
        <Card
            className={"mb-5"}
            headerBorder
            header={<Skeleton className={"mb-2 md:mb-0 self-start"} height={30} width={300} />}
            headerExtra={<Skeleton height={30} width={200} />}
            footer={<Skeleton height={40} width={160} />}>
            <div className={"mt-3 w-full"}>
                <Skeleton height={30} className={"mb-3"} />
                <Skeleton height={30} className={"mb-3"} />
            </div>
        </Card>
    );
}
