import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useParams } from "react-router-dom";
import useApi from "@/utils/hooks/useApi";
import { TrainingLogModel } from "@/models/TrainingSessionBelongsToUser.model";
import { Card } from "@/components/ui/Card/Card";
import { MapArray } from "@/components/conditionals/MapArray";
import { LogTemplateElement } from "@/models/TrainingLogTemplateModel";
import { TLVLogTemplateElementPartial } from "@/pages/authenticated/training/training-log-view/_partials/TLVLogTemplateElement.partial";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TLVViewSkeleton } from "@/pages/authenticated/training/training-log-view/_skeletons/TLVView.skeleton";
import { Input } from "@/components/ui/Input/Input";
import { CommonRegexp, Config } from "@/core/Config";
import { TbCalendar, TbId, TbUser } from "react-icons/tb";
import React from "react";
import { Separator } from "@/components/ui/Separator/Separator";
import dayjs from "dayjs";

export function TrainingLogViewView() {
    const { uuid } = useParams();

    const {
        data: trainingLog,
        loading: loadingTrainingLog,
        setData,
    } = useApi<TrainingLogModel>({
        url: `/training-log/${uuid}`,
        method: "get",
        onLoad: trainingLog => {
            setData({ ...trainingLog, content: JSON.parse(trainingLog.content as any) });
        },
    });

    return (
        <>
            <PageHeader title={"Trainingslog Ansehen"} />

            <RenderIf
                truthValue={loadingTrainingLog}
                elementTrue={<TLVViewSkeleton />}
                elementFalse={
                    <Card>
                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                            <Input
                                type={"text"}
                                labelSmall
                                label={"Erstellt Von"}
                                value={`${trainingLog?.author?.first_name} ${trainingLog?.author?.last_name} (${trainingLog?.author_id})`}
                                preIcon={<TbUser size={20} />}
                                disabled
                            />
                            <Input
                                type={"text"}
                                labelSmall
                                label={"Erstellt Am"}
                                value={dayjs.utc(trainingLog?.createdAt).format(Config.DATETIME_FORMAT)}
                                preIcon={<TbCalendar size={20} />}
                                disabled
                            />
                        </div>

                        <Separator />

                        <MapArray
                            data={(trainingLog?.content ?? []) as LogTemplateElement[]}
                            mapFunction={(t: LogTemplateElement, index: number) => {
                                return <TLVLogTemplateElementPartial element={t} index={index} key={index} />;
                            }}
                        />
                    </Card>
                }
            />
        </>
    );
}
