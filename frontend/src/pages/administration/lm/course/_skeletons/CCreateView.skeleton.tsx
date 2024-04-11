import { Skeleton } from "../../../../../components/ui/Skeleton/Skeleton";
import { Separator } from "../../../../../components/ui/Separator/Separator";
import { Card } from "../../../../../components/ui/Card/Card";

export function CCreateViewSkeleton() {
    return (
        <Card>
            <Skeleton height={20} width={200} />
            <Skeleton height={40} className={"mt-2"} />

            <Separator />

            <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                <div>
                    <Skeleton height={20} width={200} className={"mt-5"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} className={"mt-5"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>
            </div>

            <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                <div>
                    <Skeleton height={20} width={200} className={"mt-5"} />
                    <Skeleton height={120} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} className={"mt-5"} />
                    <Skeleton height={120} className={"mt-2"} />
                </div>
            </div>

            <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                <div>
                    <Skeleton height={20} width={200} className={"mt-5"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} className={"mt-5"} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>
            </div>

            <Separator />

            <Skeleton height={20} width={200} className={"mt-5"} />
            <Skeleton height={40} className={"mt-2"} />
            <Skeleton height={36} width={240} className={"mt-2"} />

            <Skeleton height={20} width={200} className={"mt-5"} />
            <Skeleton height={40} className={"mt-2"} />
            <Skeleton height={36} width={240} className={"mt-2"} />

            <Separator />

            <Skeleton height={20} width={200} className={"mt-5"} />
            <Skeleton height={40} className={"mt-2"} />
            <Skeleton height={36} width={240} className={"mt-2"} />

            <Separator />

            <Skeleton height={44} width={170} className={"mt-5"} />
        </Card>
    );
}
