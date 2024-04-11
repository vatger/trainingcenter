import { Skeleton } from "../../../../../components/ui/Skeleton/Skeleton";
import { Separator } from "../../../../../components/ui/Separator/Separator";
import { Card } from "../../../../../components/ui/Card/Card";

export function TTSkeleton() {
    return (
        <Card bordered>
            <Skeleton height={20} width={200} />
            <Skeleton height={40} className={"mt-2"} />

            <Skeleton height={20} width={200} className={"mt-5"} />
            <Skeleton height={40} className={"mt-2"} />

            <Separator />

            <Skeleton height={20} width={200} className={"mt-5"} />
            <Skeleton height={40} className={"mt-2"} />
            <div className={"flex mt-2"}>
                <Skeleton height={36} width={240} className={"mr-2"} />
                <Skeleton height={36} width={240} />
            </div>

            <Separator />

            <Skeleton height={44} width={170} className={"mt-5"} />
        </Card>
    );
}
