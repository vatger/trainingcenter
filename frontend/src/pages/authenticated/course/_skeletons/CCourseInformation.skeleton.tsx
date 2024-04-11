import { Card } from "@/components/ui/Card/Card";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";

export function CCourseInformationSkeleton() {
    return (
        <Card>
            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>

                <div>
                    <Skeleton height={20} width={200} />
                    <Skeleton height={40} className={"mt-2"} />
                </div>
            </div>
        </Card>
    );
}
