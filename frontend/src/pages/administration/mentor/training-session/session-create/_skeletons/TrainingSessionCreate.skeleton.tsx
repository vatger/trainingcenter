import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Card } from "@/components/ui/Card/Card";
import { Separator } from "@/components/ui/Separator/Separator";

export function TrainingSessionCreateSkeleton() {
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
                </div>

                <Skeleton height={20} width={130} className={"mb-2"} />
                <Skeleton height={39} />

                <Separator />

                <Skeleton height={44} width={220} />
            </Card>

            <Card header={<Skeleton height={29} width={250} />} className={"mt-5"} headerBorder>
                <Skeleton height={20} width={130} className={"mb-2"} />
                <Skeleton height={39} />
                <Skeleton height={36} width={110} className={"mt-3"} />

                <Separator />

                <Skeleton height={220} />
            </Card>
        </>
    );
}
