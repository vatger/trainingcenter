import { Card } from "@/components/ui/Card/Card";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarEvent, TbCalendarPlus, TbId, TbUser } from "react-icons/tb";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Table } from "@/components/ui/Table/Table";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { UserModel } from "@/models/UserModel";
import TSCParticipantListTypes from "@/pages/administration/mentor/training-session/session-create/_types/TSCParticipantList.types";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TrainingSessionCreateSkeleton } from "@/pages/administration/mentor/training-session/session-create/_skeletons/TrainingSessionCreate.skeleton";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { Badge } from "@/components/ui/Badge/Badge";
import useApi from "@/utils/hooks/useApi";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import TrainingSessionCreateService from "@/pages/administration/mentor/training-session/session-create/_services/TrainingSessionCreate.service";
import { TrainingSessionCalendar } from "@/pages/administration/mentor/training-session/_components/TrainingSessionCalendar";

/**
 * Creates a new training session based on a training request. It loads all initial data and allows the mentor to add more people at will
 * @constructor
 */
export function TrainingSessionCreateFromRequestView() {
    const navigate = useNavigate();
    const { uuid: courseUUID } = useParams();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [participants, setParticipants] = useState<UserModel[]>([]);
    const [newParticipantID, setNewParticipantID] = useState<string>("");
    const [loadingUser, setLoadingUser] = useState<boolean>(false);

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

                        <Card
                            header={"Teilnehmer"}
                            headerBorder
                            className={"mt-5"}
                            headerExtra={
                                participants.length == 0 ? <Badge color={COLOR_OPTS.DANGER}>Mindestens ein Teilnehmer erforderlich</Badge> : undefined
                            }>
                            <Input
                                onChange={e => setNewParticipantID(e.target.value)}
                                value={newParticipantID}
                                label={"Benutzer Hinzufügen"}
                                description={
                                    "Benutzer, die nicht in diesem Kurs eingeschrieben sind werden nicht berücksichtigt und der Session entsprechend nicht hinzugefügt."
                                }
                                labelSmall
                                preIcon={<TbUser size={20} />}
                                placeholder={participants[0]?.id.toString() ?? "1373921"}
                            />

                            <Button
                                size={SIZE_OPTS.SM}
                                color={COLOR_OPTS.PRIMARY}
                                loading={loadingUser}
                                disabled={submitting}
                                variant={"twoTone"}
                                className={"mt-3"}
                                onClick={async () => {
                                    await TrainingSessionCreateService.addUser({
                                        participants: participants,
                                        setParticipants: setParticipants,
                                        newParticipantId: newParticipantID,
                                        setNewParticipantId: setNewParticipantID,
                                        setLoadingUser: setLoadingUser,
                                    });
                                }}>
                                Hinzufügen
                            </Button>

                            <Separator />

                            <Table paginate columns={TSCParticipantListTypes.getColumns(participants, setParticipants)} data={participants} />
                        </Card>

                        <TrainingSessionCalendar />
                    </>
                }
            />
        </>
    );
}
