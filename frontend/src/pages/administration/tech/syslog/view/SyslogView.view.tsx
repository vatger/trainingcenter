import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import React from "react";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import useApi from "@/utils/hooks/useApi";
import { SyslogModel } from "@/models/SyslogModel";
import { RenderIf } from "@/components/conditionals/RenderIf";
import dayjs from "dayjs";
import { Config } from "@/core/Config";

export function SyslogViewView() {
    const { id } = useParams();

    const { data: syslog, loading } = useApi<SyslogModel>({
        url: `/administration/syslog/${id}`,
        method: "GET",
    });

    return (
        <>
            <PageHeader title={`Systemlog Ansehen`} />

            <Card
                header={"Informationen"}
                headerBorder
                headerExtra={
                    <Badge color={COLOR_OPTS.PRIMARY}>
                        <># {id}</>
                    </Badge>
                }>
                <div className={"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"}>
                    <Input label={"Benutzer"} labelSmall disabled value={syslog?.user_id ?? "N/A"} />

                    <Input label={"Methode"} labelSmall disabled value={syslog?.method} />

                    <Input label={"Request IP"} labelSmall disabled value={syslog?.remote_addr} />
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-5 mt-5"}>
                    <Input label={"Datum"} labelSmall disabled value={dayjs.utc(syslog?.createdAt).format(Config.DATETIME_FORMAT)} />

                    <Input label={"Pfad"} labelSmall disabled value={syslog?.path} />
                </div>

                <RenderIf
                    truthValue={syslog?.message != null}
                    elementTrue={<TextArea disabled label={"Nachricht"} labelSmall className={"mt-5"} value={syslog?.message}></TextArea>}
                />
            </Card>
        </>
    );
}
