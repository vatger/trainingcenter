import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Separator } from "@/components/ui/Separator/Separator";

export function MGVUsersSkeleton() {
    return (
        <>
            <div>
                <Skeleton height={20} width={200} />
                <Skeleton height={40} className={"mt-2"} />
            </div>

            <div className={"flex mt-3"}>
                <Skeleton height={20} width={20} />
                <Skeleton height={20} width={150} className={"ml-3"} />
            </div>
            <div className={"flex mt-3"}>
                <Skeleton height={20} width={20} />
                <Skeleton height={20} width={150} className={"ml-3"} />
            </div>

            <Skeleton height={36} width={100} className={"mt-5"} />
        </>
    );
}
