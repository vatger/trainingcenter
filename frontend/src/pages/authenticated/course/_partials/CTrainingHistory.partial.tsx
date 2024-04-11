import { RenderIf } from "@/components/conditionals/RenderIf";
import { Alert } from "@/components/ui/Alert/Alert";
import { COLOR_OPTS, SIZE_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { TimeLine, TimeLineItem } from "@/components/ui/Timeline/TimeLine";
import { MapArray } from "@/components/conditionals/MapArray";
import { UserTrainingSessionModel } from "@/models/TrainingSessionModel";
import { TbCalendarStats, TbClipboardList } from "react-icons/tb";
import { TrainingLogModel } from "@/models/TrainingSessionBelongsToUser.model";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import React from "react";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import StringHelper from "../../../../utils/helper/StringHelper";
import CAVTrainingHistoryHelper from "@/pages/authenticated/course/course-active-view/_helpers/CAVTrainingHistory.helper";
import { CAVTrainingHistorySkeleton } from "@/pages/authenticated/course/course-active-view/_skeletons/CAVTrainingHistory.skeleton";

export function CTrainingHistoryPartial({ trainingData, loading }: { trainingData: UserTrainingSessionModel[]; loading: boolean }) {
    const navigate = useNavigate();

    return (
        <RenderIf
            truthValue={loading}
            elementTrue={<CAVTrainingHistorySkeleton />}
            elementFalse={
                <Card header={"Trainingshistorie"} headerBorder className={"mt-5"}>
                    <RenderIf
                        truthValue={trainingData.length == 0}
                        elementTrue={
                            <Alert type={TYPE_OPTS.WARNING} rounded showIcon>
                                Du hast in diesem Kurs noch kein abgeschlossenes oder geplantes Training.
                            </Alert>
                        }
                        elementFalse={
                            <TimeLine>
                                <MapArray
                                    data={trainingData}
                                    mapFunction={(value: UserTrainingSessionModel, index: number) => {
                                        return (
                                            <TimeLineItem
                                                key={index}
                                                color={CAVTrainingHistoryHelper.getStatusColor(value)}
                                                avatarIcon={CAVTrainingHistoryHelper.getStatusBadge(value)}
                                                showConnectionLine={trainingData.length > 0 && index != trainingData.length - 1}>
                                                <div className={"flex justify-between w-full"}>
                                                    <p className="my-1 flex items-center">
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {`${value.training_type?.name} (${StringHelper.capitalize(value.training_type?.type) ?? "N/A"})`}
                                                        </span>
                                                    </p>
                                                    <p className={"items-center mt-1"}>
                                                        <span>{dayjs.utc(value.date).format(Config.DATETIME_FORMAT)}z</span>
                                                    </p>
                                                </div>

                                                <RenderIf
                                                    truthValue={value.training_session_belongs_to_users?.passed != null}
                                                    elementTrue={
                                                        <RenderIf
                                                            truthValue={value.training_session_belongs_to_users?.passed == true}
                                                            elementTrue={<p>Bestanden</p>}
                                                            elementFalse={<p>Nicht bestanden</p>}
                                                        />
                                                    }
                                                />

                                                <Button
                                                    variant={"twoTone"}
                                                    className={"mt-4 mr-2"}
                                                    icon={<TbCalendarStats size={20} />}
                                                    onClick={() => navigate(`/training/planned/${value.uuid}`)}
                                                    color={COLOR_OPTS.PRIMARY}
                                                    size={SIZE_OPTS.SM}>
                                                    Session Ansehen
                                                </Button>
                                                <RenderIf
                                                    truthValue={value.training_session_belongs_to_users?.log_id != null}
                                                    elementTrue={
                                                        <Link
                                                            to={`/training/log/${
                                                                value.training_logs?.find((log: TrainingLogModel) => {
                                                                    return value.training_session_belongs_to_users?.log_id == log.id;
                                                                })?.uuid ?? "-1"
                                                            }`}>
                                                            <Button
                                                                variant={"twoTone"}
                                                                className={"mt-4"}
                                                                icon={<TbClipboardList size={20} />}
                                                                color={COLOR_OPTS.PRIMARY}
                                                                size={SIZE_OPTS.SM}>
                                                                Log Ansehen
                                                            </Button>
                                                        </Link>
                                                    }
                                                />
                                            </TimeLineItem>
                                        );
                                    }}
                                />
                            </TimeLine>
                        }
                    />
                </Card>
            }
        />
    );
}
