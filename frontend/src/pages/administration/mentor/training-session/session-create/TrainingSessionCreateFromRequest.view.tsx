import { Card } from "@/components/ui/Card/Card";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarEvent, TbCalendarPlus, TbId } from "react-icons/tb";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TrainingSessionCreateSkeleton } from "@/pages/administration/mentor/training-session/session-create/_skeletons/TrainingSessionCreate.skeleton";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import useApi from "@/utils/hooks/useApi";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import TrainingSessionCreateService from "@/pages/administration/mentor/training-session/session-create/_services/TrainingSessionCreate.service";
import { TrainingSessionParticipants } from "@/pages/administration/mentor/training-session/_components/TrainingSessionParticipants";
import { IMinimalUser } from "@models/User";

/**
 * Creates a new training session based on a training request. It loads all initial data and allows the mentor to add more people at will
 * @constructor
 */
export function TrainingSessionCreateFromRequestView() {
    const navigate = useNavigate();
    const { uuid: courseUUID } = useParams();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [participants, setParticipants] = useState<IMinimalUser[]>([]);

    const { data: trainingRequest, loading } = useApi<TrainingRequestModel>({
        url: `/administration/training-request/${courseUUID}`,
        method: "get",
        onLoad: trainingRequest => {
            if (trainingRequest.user != null) {
                let p = [...participants];
                p.push(trainingRequest.user);
                setParticipants(p);
            }
        },
    });

    return (
        <>
            <PageHeader title={"Trainingssession Erstellen"} />

            <RenderIf
                truthValue={loading}
                elementTrue={<TrainingSessionCreateSkeleton />}
                elementFalse={
                    <>
                        <form
                            onSubmit={async e => {
                                await TrainingSessionCreateService.createSession({
                                    event: e,
                                    setSubmitting: setSubmitting,
                                    participants: participants,
                                    navigate: navigate,
                                    fromRequest: true,
                                    trainingRequest: trainingRequest,
                                });
                            }}>
                            <Card header={"Training"} headerBorder>
                                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
                                    <Input label={"Kurs"} labelSmall preIcon={<TbId size={20} />} disabled readOnly value={trainingRequest?.course?.name} />
                                    <Input
                                        label={"Trainingstyp"}
                                        labelSmall
                                        preIcon={<TbId size={20} />}
                                        disabled
                                        readOnly
                                        value={`${trainingRequest?.training_type?.name} (${trainingRequest?.training_type?.type})`}
                                    />
                                </div>
                                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5"}>
                                    <Input
                                        label={"Datum"}
                                        type={"datetime-local"}
                                        name={"date"}
                                        labelSmall
                                        preIcon={<TbCalendarEvent size={20} />}
                                        value={dayjs().utc().format("YYYY-MM-DD HH:mm")}
                                    />
                                    <Select
                                        label={"Trainingsstation"}
                                        labelSmall
                                        name={"training_station_id"}
                                        defaultValue={trainingRequest?.training_type_id ?? "none"}
                                        disabled={
                                            trainingRequest?.training_type?.training_stations == null ||
                                            trainingRequest.training_type.training_stations.length == 0
                                        }>
                                        <option value={"none"}>N/A</option>
                                        <MapArray
                                            data={trainingRequest?.training_type?.training_stations ?? []}
                                            mapFunction={(trainingStation: TrainingStationModel, index) => {
                                                return (
                                                    <option key={index} value={trainingStation.id}>
                                                        {trainingStation.callsign.toUpperCase()}
                                                    </option>
                                                );
                                            }}
                                        />
                                    </Select>
                                </div>
                                <Separator />

                                <Button variant={"twoTone"} loading={submitting} color={COLOR_OPTS.PRIMARY} icon={<TbCalendarPlus size={20} />} type={"submit"}>
                                    Session Erstellen
                                </Button>
                            </Card>
                        </form>

                        <TrainingSessionParticipants participants={participants} setParticipants={setParticipants} submitting={submitting} />
                    </>
                }
            />
        </>
    );
}
