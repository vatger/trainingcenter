import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarEvent, TbClipboardPlus, TbId, TbRadar, TbRadio, TbWifi } from "react-icons/tb";
import dayjs from "dayjs";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { TbRefresh } from "react-icons/tb";
import { Separator } from "@/components/ui/Separator/Separator";
import FormHelper from "@/utils/helper/FormHelper";
import { RenderIf } from "@/components/conditionals/RenderIf";
import ToastHelper from "@/utils/helper/ToastHelper";
import { UserModel } from "@/models/UserModel";
import { Table } from "@/components/ui/Table/Table";
import TPVParticipantListTypes from "@/pages/administration/mentor/training-session/planned-view/_types/TPVParticipantList.types";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import { axiosInstance } from "@/utils/network/AxiosInstance";

export function MentorTrainingView() {
    const navigate = useNavigate();
    const { uuid } = useParams();

    const [participants, setParticipants] = useState<UserModel[]>([]);
    const [updating, setUpdating] = useState<boolean>(false);

    const { data: trainingSession, loading } = useApi<TrainingSessionModel>({
        url: `/administration/training-session/${uuid ?? "-1"}`,
        method: "get",
        onLoad: session => {
            setParticipants(session.users as UserModel[]);
        },
    });

    const { data: mentors, loading: loadingMentors } = useApi<UserModel[]>({
        url: `/administration/training-session/${uuid}/mentors`,
        method: "get",
    });

    function updateSessionDetails(e: FormEvent<HTMLFormElement>) {
        setUpdating(true);
        e.preventDefault();

        const data = FormHelper.getEntries(e.target);

        axiosInstance
            .patch(`/administration/training-session/${uuid}`, data)
            .then(res => {
                ToastHelper.success("Session-Informationen erfolgreich aktualisiert");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim aktuelisieren der Session-Informationen");
            })
            .finally(() => setUpdating(false));
    }

    return (
        <>
            <PageHeader title={"Geplantes Training"} />

            <RenderIf
                truthValue={loading || loadingMentors}
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
                            <form onSubmit={updateSessionDetails}>
                                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5"}>
                                    <Input
                                        label={"Datum"}
                                        type={"datetime-local"}
                                        name={"date"}
                                        disabled={trainingSession?.training_type?.type == "cpt"}
                                        labelSmall
                                        preIcon={<TbCalendarEvent size={20} />}
                                        value={dayjs.utc(trainingSession?.date).format("YYYY-MM-DD HH:mm")}
                                    />

                                    <RenderIf
                                        truthValue={trainingSession?.training_type?.type == "cpt"}
                                        elementTrue={
                                            <Input
                                                label={"Trainingsstation"}
                                                name={"training_station_id"}
                                                disabled={trainingSession?.training_type?.type == "cpt"}
                                                labelSmall
                                                preIcon={<TbRadar size={20} />}
                                                value={`${trainingSession?.training_station?.callsign.toUpperCase()} (${trainingSession?.training_station?.frequency.toFixed(
                                                    3
                                                )})`}
                                            />
                                        }
                                        elementFalse={
                                            <Select
                                                label={"Trainingsstation"}
                                                labelSmall
                                                name={"training_station_id"}
                                                defaultValue={trainingSession?.training_station?.id}
                                                disabled={
                                                    trainingSession?.training_type?.training_stations == null ||
                                                    trainingSession.training_type.training_stations.length == 0 ||
                                                    trainingSession.training_type.type == "cpt"
                                                }>
                                                <option value={"-1"}>N/A</option>
                                                <MapArray
                                                    data={trainingSession?.training_type?.training_stations ?? []}
                                                    mapFunction={(trainingStation: TrainingStationModel, index) => {
                                                        return (
                                                            <option key={index} value={trainingStation.id}>
                                                                {trainingStation.callsign.toUpperCase()} ({trainingStation.frequency.toFixed(3)})
                                                            </option>
                                                        );
                                                    }}
                                                />
                                            </Select>
                                        }
                                    />

                                    <Select
                                        label={"Mentor"}
                                        labelSmall
                                        description={
                                            trainingSession?.training_type?.type == "cpt"
                                                ? "CPT Beisitzer"
                                                : "Falls du nicht zur Session erscheinen kannst, kannst Du hier das Training an einen anderen Mentoren übertragen."
                                        }
                                        name={"mentor_id"}
                                        disabled={trainingSession?.training_type?.type == "cpt"}
                                        defaultValue={trainingSession?.mentor_id ?? "-1"}>
                                        <MapArray
                                            data={mentors ?? []}
                                            mapFunction={(mentor: UserModel, index) => {
                                                return (
                                                    <option key={index} value={mentor.id}>
                                                        {mentor.first_name} {mentor.last_name} ({mentor.id})
                                                    </option>
                                                );
                                            }}
                                        />
                                    </Select>
                                </div>

                                <Separator />

                                <div className={"flex lg:flex-row flex-col gap-3"}>
                                    <Button color={COLOR_OPTS.PRIMARY} variant={"twoTone"} icon={<TbRefresh size={20} />} type={"submit"} loading={updating}>
                                        Aktualisieren
                                    </Button>

                                    <Button
                                        color={COLOR_OPTS.PRIMARY}
                                        variant={"twoTone"}
                                        icon={<TbClipboardPlus size={20} />}
                                        type={"button"}
                                        disabled={updating}
                                        onClick={() => navigate("logs-create")}>
                                        Logs Erstellen
                                    </Button>
                                </div>
                            </form>
                        </Card>
                        <Card header={"Teilnehmer"} headerBorder className={"mt-5"}>
                            <Table paginate columns={TPVParticipantListTypes.getColumns()} data={participants} />
                        </Card>
                    </>
                }
            />
        </>
    );
}
