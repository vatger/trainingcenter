import { Skeleton } from "../../../../../components/ui/Skeleton/Skeleton";
import { Separator } from "../../../../../components/ui/Separator/Separator";

export function CAVTrainingModalSkeleton() {
    return (
        <>
            <Skeleton height={20} width={200} />
            <Skeleton height={40} className={"mt-2"} />

            <Skeleton height={20} width={200} className={"mt-5"} />
            <Skeleton height={40} className={"mt-2"} />

            <Separator />
        </>
    );
}

export function RequestTrainingModelFooterSkeleton() {
    return (
        <div className={"flex justify-end"}>
            <Skeleton height={44} width={180} />
        </div>
    );
}
