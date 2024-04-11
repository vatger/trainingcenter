import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarEvent, TbClipboardPlus, TbId, TbRadar, TbRefresh } from "react-icons/tb";
import dayjs from "dayjs";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { UserModel } from "@/models/UserModel";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Table } from "@/components/ui/Table/Table";
import React from "react";
import MTSVTypes from "@/pages/administration/mentor/training-session/my-view/_types/MTSV.types";

export function MyTrainingSessionView() {
    const { uuid } = useParams();

    const { data: trainingSession, loading } = useApi<TrainingSessionModel>({
        url: `/administration/training-session/${uuid}`,
        method: "get",
    });

    return (
        <>
            <PageHeader title={"Training Ansehen"} />

            <RenderIf
                truthValue={loading}
                elementTrue={<></>}
                elementFalse={
                    <>
                        <Card header={"Training"} headerBorder>
                            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
                                <Input label={"Kurs"} labelSmall preIcon={<TbId size={20} />} disabled readOnly value={trainingSession?.course?.name} />
                                <Input
                                    label={"Trainingstyp"}
                                    labelSmall
                                    preIcon={<TbId size={20} />}
                                    disabled
                                    readOnly
                                    value={`${trainingSession?.training_type?.name} (${trainingSession?.training_type?.type})`}
                                />
                            </div>
                            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5"}>
                                <Input
                                    label={"Datum"}
                                    type={"datetime-local"}
                                    disabled
                                    labelSmall
                                    preIcon={<TbCalendarEvent size={20} />}
                                    value={dayjs.utc(trainingSession?.date).format("YYYY-MM-DD HH:mm")}
                                />

                                <Input
                                    label={"Trainingsstation"}
                                    disabled
                                    labelSmall
                                    preIcon={<TbRadar size={20} />}
                                    value={
                                        trainingSession?.training_station
                                            ? `${trainingSession?.training_station?.callsign.toUpperCase()} (${trainingSession?.training_station?.frequency.toFixed(
                                                  3
                                              )})`
                                            : "N/A"
                                    }
                                />
                            </div>
                        </Card>
                        <Card header={"Teilnehmer"} headerBorder className={"mt-5"}>
                            <Table paginate columns={MTSVTypes.getColumns()} data={trainingSession?.users ?? []} />
                        </Card>
                    </>
                }
            />
        </>
    );
}
