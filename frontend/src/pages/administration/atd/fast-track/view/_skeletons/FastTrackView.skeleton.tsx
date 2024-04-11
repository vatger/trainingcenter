import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Separator } from "@/components/ui/Separator/Separator";

export function FastTrackViewSkeleton() {
    return (
        <Card header={"Anfrage"} headerBorder>
            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
                <div>
                    <Skeleton height={20} width={200} className={"mb-2"} />
                    <Skeleton height={40} />
                </div>

                <div>
                    <Skeleton height={20} width={200} className={"mb-2"} />
                    <Skeleton height={40} />
                </div>

                <div>
                    <Skeleton height={20} width={200} className={"mb-2"} />
                    <Skeleton height={40} />
                </div>

                <div>
                    <Skeleton height={20} width={200} className={"mb-2"} />
                    <Skeleton height={40} />
                </div>

                <div>
                    <Skeleton height={20} width={200} className={"mb-2"} />
                    <Skeleton height={40} />
                </div>
            </div>

            <div className={"mt-5"}>
                <Skeleton height={20} width={200} className={"mb-2"} />
                <Skeleton height={110} />
            </div>

            <Separator />

            <div>
                <Skeleton height={20} width={200} className={"mb-2"} />
                <Skeleton height={40} />
            </div>

            <div className={"mt-5"}>
                <Skeleton height={20} width={200} className={"mb-2"} />
                <Skeleton height={110} />
            </div>

            <Separator />

            <Skeleton height={44} width={170} className={"mt-5"} />
        </Card>
    );
}
