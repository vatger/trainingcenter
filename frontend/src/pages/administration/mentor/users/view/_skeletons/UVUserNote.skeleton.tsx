import { Skeleton } from "../../../../../../components/ui/Skeleton/Skeleton";
import React from "react";
import { RenderIf } from "../../../../../../components/conditionals/RenderIf";
import { Separator } from "../../../../../../components/ui/Separator/Separator";

export function UVUserNoteSkeleton(props: { isFirst: boolean }) {
    return (
        <>
            <RenderIf truthValue={!props.isFirst} elementTrue={<Separator />} />

            <div className={"mb-3"}>
                <div className={"flex justify-between"}>
                    <div className={"flex flex-col"}>
                        <Skeleton height={24} width={240} />
                        <Skeleton className={"mt-1"} height={24} width={300} />
                    </div>
                    <div className={"flex flex-row"}>
                        <Skeleton className={"my-auto mr-2"} width={36} height={36} />
                        <Skeleton className={"my-auto"} width={36} height={36} />
                    </div>
                </div>
                <div className={"mt-5"}>
                    <Skeleton height={70} />
                </div>
            </div>
        </>
    );
}
