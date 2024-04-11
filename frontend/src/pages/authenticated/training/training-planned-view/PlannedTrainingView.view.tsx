import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarEvent, TbDoorExit, TbId, TbLink, TbListCheck, TbRadar, TbUsers } from "react-icons/tb";
import React, { useState } from "react";
import StringHelper from "../../../../utils/helper/StringHelper";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TPVWithdrawModal } from "./_modals/TPVWithdraw.modal";
import useApi from "@/utils/hooks/useApi";
import { TrainingSessionModel } from "@/models/TrainingSessionModel";
import { PlannedTrainingViewSkeleton } from "@/pages/authenticated/training/training-planned-view/_skeletons/PlannedTrainingView.skeleton";

export function PlannedTrainingView() {
    const navigate = useNavigate();
    const { uuid } = useParams();
    const { data: trainingSession, loading } = useApi<TrainingSessionModel>({
        url: `/training-session/${uuid}`,
        method: "get",
    });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

    return (
        <>
            <PageHeader title={"Session Verwalten"} />

            <RenderIf
                truthValue={loading}
                elementTrue={<PlannedTrainingViewSkeleton />}
                elementFalse={
                    <Card>
                        <Input
                            labelSmall
                            label={"Zuletzt aktualisiert"}
                            preIcon={<TbCalendarEvent size={20} />}
                            disabled
                            value={dayjs.utc(trainingSession?.updatedAt).format(Config.DATETIME_FORMAT)}
                        />

                        <Separator />

                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                            <Input labelSmall preIcon={<TbId size={20} />} label={"Kurs Name"} disabled value={trainingSession?.course?.name} />
                            <Input
                                labelSmall
                                preIcon={<TbId size={20} />}
                                label={"Training Typ"}
                                disabled
                                value={`${trainingSession?.training_type?.name} (${StringHelper.capitalize(trainingSession?.training_type?.type)})`}
                            />
                            <Input
                                labelSmall
                                preIcon={<TbRadar size={20} />}
                                label={"Station"}
                                disabled
                                value={
                                    trainingSession?.training_station?.callsign
                                        ? `${trainingSession?.training_station?.callsign.toUpperCase()} (${trainingSession?.training_station?.frequency?.toFixed(
                                              3
                                          )})`
                                        : "N/A"
                                }
                            />
                            <Input
                                labelSmall
                                preIcon={<TbCalendarEvent size={20} />}
                                label={"Datum"}
                                disabled
                                value={dayjs.utc(trainingSession?.date).format(Config.DATETIME_FORMAT)}
                            />
                        </div>

                        <Separator />

                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                            <Input
                                labelSmall
                                preIcon={<TbListCheck size={20} />}
                                label={"Mentor"}
                                disabled
                                inputError={trainingSession?.mentor == null}
                                hideInputErrorText
                                value={
                                    trainingSession?.mentor == null
                                        ? "N/A"
                                        : `${trainingSession?.mentor?.first_name} ${trainingSession?.mentor?.last_name} (${trainingSession?.mentor?.id})`
                                }
                            />
                            <Input
                                labelSmall
                                preIcon={<TbUsers size={20} />}
                                label={"Teilnehmer"}
                                disabled
                                value={trainingSession?.users?.length.toString() ?? "0"}
                            />
                        </div>

                        <RenderIf
                            truthValue={trainingSession?.user_passed == null && dayjs.utc(trainingSession?.date).isAfter(dayjs.utc())}
                            elementTrue={
                                <>
                                    <Separator />

                                    <Button
                                        variant={"twoTone"}
                                        loading={submitting}
                                        onClick={() => setShowWithdrawModal(true)}
                                        color={COLOR_OPTS.DANGER}
                                        icon={<TbDoorExit size={20} />}>
                                        Abmelden
                                    </Button>
                                </>
                            }
                        />

                        <RenderIf
                            truthValue={trainingSession?.completed == true}
                            elementTrue={
                                <>
                                    <Separator />

                                    <Button
                                        variant={"twoTone"}
                                        loading={submitting}
                                        onClick={() => navigate(`/course/completed/${trainingSession?.course?.uuid}`)}
                                        color={COLOR_OPTS.PRIMARY}
                                        icon={<TbLink size={20} />}>
                                        Zum Kurs
                                    </Button>
                                </>
                            }
                        />
                    </Card>
                }
            />

            <TPVWithdrawModal
                show={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
                setSubmitting={setSubmitting}
                submitting={submitting}
                trainingSession={trainingSession}
            />
        </>
    );
}
