import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Separator } from "@/components/ui/Separator/Separator";

export function MGVSettingsSkeleton() {
    return (
        <>
            <div>
                <Skeleton height={20} width={200} />
                <Skeleton height={16} width={300} className={"mt-1"} />
                <Skeleton height={40} className={"mt-2"} />
            </div>

            <div className={"mt-5"}>
                <Skeleton height={20} width={200} />
                <Skeleton height={16} width={300} className={"mt-1"} />
                <Skeleton height={40} className={"mt-2"} />
            </div>

            <Separator />

            <Skeleton height={44} width={250} />
        </>
    );
}
