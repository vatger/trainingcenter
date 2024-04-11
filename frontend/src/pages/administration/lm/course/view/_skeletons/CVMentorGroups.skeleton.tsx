import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export function CVMentorGroupsSkeleton() {
    return (
        <>
            <Skeleton width={150} height={20} className={"mb-2"} />
            <Skeleton height={39} />
            <Skeleton width={150} height={36} className={"mt-3"} />
        </>
    );
}
