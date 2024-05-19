import { Card } from "@/components/ui/Card/Card";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarEvent, TbCalendarPlus } from "react-icons/tb";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TrainingSessionCreateSkeleton } from "@/pages/administration/mentor/training-session/session-create/_skeletons/TrainingSessionCreate.skeleton";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import useApi from "@/utils/hooks/useApi";
import { CourseModel } from "@/models/CourseModel";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { Alert } from "@/components/ui/Alert/Alert";
import TrainingSessionCreateService from "@/pages/administration/mentor/training-session/session-create/_services/TrainingSessionCreate.service";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TrainingSessionParticipants } from "@/pages/administration/mentor/training-session/_components/TrainingSessionParticipants";
import { IMinimalUser } from "@models/User";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import ToastHelper from "@/utils/helper/ToastHelper";

interface ISessionParams {
    users: string | null;
    request_uuid: string | null;
}

function getURLParams(): ISessionParams {
    const url = new URL(window.location.toString());

    let users = url.searchParams.get("users");
    let request_uuid = url.searchParams.get("request_uuid");

    return {
        users: users,
        request_uuid: request_uuid,
    };
}

export function TrainingSessionCreateView() {
    const navigate = useNavigate();
    const params = getURLParams();

    const { data: courses, loading: loadingCourses } = useApi<CourseModel[]>({
        url: "/user/course/mentorable",
        method: "get",
    });

    const [submitting, setSubmitting] = useState<boolean>(false);

    const [courseUUID, setCourseUUID] = useState<string | undefined>(undefined);
    const [trainingTypeID, setTrainingTypeID] = useState<number | undefined>(undefined);
    const [participants, setParticipants] = useState<IMinimalUser[]>([]);

    const [loadingTrainingRequestData, setLoadingTrainingRequestData] = useState<boolean>(true);
    const [defaultRequestState, setDefaultRequestState] = useState<TrainingRequestModel | undefined>(undefined);

    // Load the initial session data (including course, training type and users...)
    useEffect(() => {
        if (params.users == null && params.request_uuid == null) {
            setLoadingTrainingRequestData(false);
            return;
        }

        let userPromise;
        let sessionPromise;

        if (params.users != null) {
            // Load the users here
            userPromise = axiosInstance.get("/administration/user/min", {
                params: {
                    users: params.users,
                },
            });
        }

        if (params.request_uuid != null) {
            // Load the session data
            sessionPromise = axiosInstance.get(`/administration/training-request/${params.request_uuid}`);
        }

        Promise.all([userPromise, sessionPromise])
            .then(results => {
                const users = results[0]!.data as IMinimalUser[];
                const request = results[1]!.data as TrainingRequestModel;

                setCourseUUID(request.course?.uuid);
                setTrainingTypeID(request.training_type_id);

                setDefaultRequestState(request);
                setParticipants(users);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Laden der Informationen aus den Trainingsanfragen. Versuche es bitte später erneut.");
            })
            .finally(() => setLoadingTrainingRequestData(false));
    }, []);

    return (
        <>
            <PageHeader title={"Trainingssession Erstellen"} hideBackLink />

            <RenderIf
                truthValue={loadingCourses || loadingTrainingRequestData}
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
                                        defaultValue={courseUUID ?? "none"}
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
                                        defaultValue={trainingTypeID ?? "none"}
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
                                        defaultValue={defaultRequestState?.training_station?.id ?? "none"}>
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
