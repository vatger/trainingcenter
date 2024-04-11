import { useParams } from "react-router-dom";
import useApi from "@/utils/hooks/useApi";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { RenderIf } from "@/components/conditionals/RenderIf";
import React from "react";
import { JoblogModel } from "@/models/JoblogModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { TbCalendar, TbHttpOptions, TbId, TbListNumbers, TbStatusChange } from "react-icons/tb";

export function JoblogViewView() {
    const { id } = useParams();

    const {
        data: joblog,
        setData: setJobLog,
        loading,
    } = useApi<JoblogModel>({
        url: `/administration/joblog/${id}`,
        method: "GET",
        onLoad: log => {
            try {
                const json = JSON.parse(log.payload as string);
                setJobLog({ ...log, payload: json });
            } catch (e) {}
        },
    });

    return (
        <>
            <PageHeader title={`Joblog Ansehen`} />

            <RenderIf
                truthValue={loading}
                elementTrue={<>Loading...</>}
                elementFalse={
                    <Card
                        header={"Informationen"}
                        headerBorder
                        headerExtra={
                            <Badge color={COLOR_OPTS.PRIMARY}>
                                <># {id}</>
                            </Badge>
                        }>
                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                            <Input label={"UUID"} preIcon={<TbId size={20} />} labelSmall disabled value={joblog?.uuid} />

                            <Input label={"Typ"} preIcon={<TbHttpOptions size={20} />} labelSmall disabled value={joblog?.job_type} />

                            <Input label={"Status"} preIcon={<TbStatusChange size={20} />} labelSmall disabled value={joblog?.status} />

                            <Input label={"Versuche"} preIcon={<TbListNumbers size={20} />} labelSmall disabled value={joblog?.attempts?.toString()} />

                            <Input
                                label={"Scheduled Am"}
                                preIcon={<TbCalendar size={20} />}
                                labelSmall
                                disabled
                                value={dayjs.utc(joblog?.createdAt).format(Config.DATETIME_FORMAT)}
                            />

                            <Input
                                label={"Zuletzt Ausgeführt"}
                                preIcon={<TbCalendar size={20} />}
                                labelSmall
                                disabled
                                value={dayjs.utc(joblog?.last_executed).format(Config.DATETIME_FORMAT)}
                            />
                        </div>

                        <RenderIf
                            truthValue={joblog?.payload != null}
                            elementTrue={
                                <>
                                    <h6 className="text-sm mb-2 mt-5">Payload</h6>
                                    <pre className={"input input-disabled"}>{JSON.stringify(joblog?.payload, undefined, 4)}</pre>
                                </>
                            }
                        />
                    </Card>
                }
            />
        </>
    );
}
