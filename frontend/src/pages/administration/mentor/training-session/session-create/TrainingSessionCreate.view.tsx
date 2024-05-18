import { Card } from "@/components/ui/Card/Card";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarEvent, TbCalendarPlus, TbUser } from "react-icons/tb";
import dayjs from "dayjs";
import React, { FormEvent, useState } from "react";
import { Table } from "@/components/ui/Table/Table";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { UserModel } from "@/models/UserModel";
import TSCParticipantListTypes from "@/pages/administration/mentor/training-session/session-create/_types/TSCParticipantList.types";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TrainingSessionCreateSkeleton } from "@/pages/administration/mentor/training-session/session-create/_skeletons/TrainingSessionCreate.skeleton";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import useApi from "@/utils/hooks/useApi";
import { CourseModel } from "@/models/CourseModel";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { Alert } from "@/components/ui/Alert/Alert";
import TrainingSessionCreateService from "@/pages/administration/mentor/training-session/session-create/_services/TrainingSessionCreate.service";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { TrainingSessionCalendar } from "@/pages/administration/mentor/training-session/_components/TrainingSessionCalendar";
import { TrainingSessionParticipants } from "@/pages/administration/mentor/training-session/_components/TrainingSessionParticipants";
import { IMinimalUser } from "@models/User";

export function TrainingSessionCreateView() {
    const navigate = useNavigate();

    const { data: courses, loading: loadingCourses } = useApi<CourseModel[]>({
        url: "/administration/course/mentorable",
        method: "get",
    });

    const [submitting, setSubmitting] = useState<boolean>(false);

    const [courseUUID, setCourseUUID] = useState<string | undefined>(undefined);
    const [trainingTypeID, setTrainingTypeID] = useState<number | undefined>(undefined);
    const [participants, setParticipants] = useState<IMinimalUser[]>([]);

    return (
        <>
            <PageHeader title={"Trainingssession Erstellen"} hideBackLink />

            <RenderIf
                truthValue={loadingCourses}
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
                                    fromRequest: false,
                                });
                            }}>
                            <Card header={"Training"} headerBorder>
                                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
                                    <Select
                                        label={`Kurs Auswählen`}
                                        labelSmall
                                        name={"course_uuid"}
                                        defaultValue={"none"}
                                        onChange={value => {
                                            if (value == "none") {
                                                setCourseUUID(undefined);
                                                return;
                                            }
                                            setTrainingTypeID(undefined);
                                            setCourseUUID(value);
                                        }}>
                                        <option value={"none"}>N/A</option>
                                        <MapArray
                                            data={courses ?? []}
                                            mapFunction={(course: CourseModel, index) => {
                                                return (
                                                    <option key={index} value={course.uuid}>
                                                        {course.name}
                                                    </option>
                                                );
                                            }}
                                        />
                                    </Select>

                                    <Select
                                        label={"Trainingstyp Auswählen"}
                                        labelSmall
                                        disabled={courses?.find(c => c.uuid == courseUUID)?.training_types?.length == 0 || courseUUID == null}
                                        name={"training_type_id"}
                                        defaultValue={"none"}
                                        onChange={value => {
                                            if (value == "none") {
                                                setTrainingTypeID(undefined);
                                                return;
                                            }
                                            setTrainingTypeID(Number(value));
                                        }}>
                                        <option value={"none"}>N/A</option>
                                        <MapArray
                                            data={courses?.find(c => c.uuid == courseUUID)?.training_types ?? []}
                                            mapFunction={(trainingType: TrainingTypeModel, index) => {
                                                return (
                                                    <option key={index} value={trainingType.id}>
                                                        {trainingType.name}
                                                    </option>
                                                );
                                            }}
                                        />
                                    </Select>
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

                                    {/*
                                        Sorry to whoever has to maintain this :)
                                        Basically, what is going on here:
                                        1. We find the currently selected Course
                                        2. We find the currently selected Training type from this course
                                        3. We get the length of the training stations associated with this training type
                                    */}
                                    <Select
                                        label={"Trainingsstation Auswählen"}
                                        labelSmall
                                        disabled={
                                            courses?.find(c => c.uuid == courseUUID)?.training_types?.find(t => t.id == trainingTypeID)?.training_stations
                                                ?.length == 0 ||
                                            trainingTypeID == null ||
                                            courseUUID == null
                                        }
                                        name={"training_station_id"}
                                        defaultValue={"none"}>
                                        <option value={"none"}>N/A</option>
                                        <MapArray
                                            data={
                                                courses?.find(c => c.uuid == courseUUID)?.training_types?.find(t => t.id == trainingTypeID)
                                                    ?.training_stations ?? []
                                            }
                                            mapFunction={(trainingStation: TrainingStationModel, index) => {
                                                return (
                                                    <option key={index} value={trainingStation.id}>
                                                        {trainingStation.callsign} ({trainingStation.frequency.toFixed(3)})
                                                    </option>
                                                );
                                            }}
                                        />
                                    </Select>
                                </div>
                                <Separator />

                                <RenderIf
                                    truthValue={courses?.find(c => c.uuid == courseUUID)?.training_types?.find(t => t.id == trainingTypeID)?.type == "cpt"}
                                    elementTrue={
                                        <>
                                            <Alert className={"mb-5"} rounded showIcon type={TYPE_OPTS.DANGER}>
                                                <>
                                                    Du hast als Trainingstyp ein CPT ausgewählt. Dieses kannst du hier <strong>nicht</strong> erstellen. Wähle
                                                    links unter Mentoren, CPTs den entsprechenden Reiter aus um ein CPT Termin anzulegen.
                                                </>
                                            </Alert>
                                        </>
                                    }
                                    elementFalse={
                                        <Button
                                            variant={"twoTone"}
                                            disabled={
                                                courseUUID == null ||
                                                trainingTypeID == null ||
                                                courses?.find(c => c.uuid == courseUUID)?.training_types?.find(t => t.id == trainingTypeID)?.type == "cpt"
                                            }
                                            loading={submitting}
                                            color={COLOR_OPTS.PRIMARY}
                                            icon={<TbCalendarPlus size={20} />}
                                            type={"submit"}>
                                            Session Erstellen
                                        </Button>
                                    }
                                />
                            </Card>
                        </form>

                        <TrainingSessionParticipants participants={participants} setParticipants={setParticipants} submitting={submitting} />
                    </>
                }
            />
        </>
    );
}
