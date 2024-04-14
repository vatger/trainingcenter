import { CAVRequestTrainingModal } from "../_modals/CAVRequestTraining.modal";
import { CourseModel } from "@/models/CourseModel";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendar, TbCertificate, TbChevronsRight, TbClock, TbDoorExit, TbId } from "react-icons/tb";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Button } from "@/components/ui/Button/Button";
import React, { Dispatch, useState } from "react";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CWithdrawPartial } from "./CWithdraw.partial";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { CCourseInformationSkeleton } from "@/pages/authenticated/course/_skeletons/CCourseInformation.skeleton";
import { ICourseInformationData } from "@models/CourseInformation";
import { TLanguage, useSettingsSelector } from "@/app/features/settingsSlice";
import genericTranslation from "@/assets/lang/generic.translation";

type ActiveCourseInformationPartialProps = {
    showRequestTrainingModal: boolean;
    setShowRequestTrainingModal: Dispatch<boolean>;
    setTrainingRequests: Dispatch<TrainingRequestModel[]>;
    course?: CourseModel;
    loadingCourse: boolean;
    trainingRequests: TrainingRequestModel[];
};

function getDuration(data: ICourseInformationData, language: TLanguage) {
    if (data == null || data.duration == null) return "Keine Angabe";

    const duration = data.duration;
    const unit = data?.duration_unit;

    return `${duration} ${genericTranslation.durations[unit ?? "day"][language]}`;
}

function getEndorsement(data?: ICourseInformationData) {
    if (data?.endorsement_id == null) return "Keine Angabe";

    return `${data.endorsement_id} (TODO: Name)`
}

export function CInformationPartial(props: ActiveCourseInformationPartialProps) {
    const language = useSettingsSelector().language;
    const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);

    return (
        <>
            <RenderIf
                truthValue={props.course != null}
                elementTrue={
                    <CAVRequestTrainingModal
                        show={props.showRequestTrainingModal}
                        onClose={() => props.setShowRequestTrainingModal(false)}
                        course={props.course}
                        trainingRequests={props.trainingRequests}
                        setTrainingRequests={props.setTrainingRequests}
                    />
                }
            />

            <RenderIf
                truthValue={props.loadingCourse}
                elementTrue={<CCourseInformationSkeleton />}
                elementFalse={
                    <Card header={"Allgemeine Informationen"} headerBorder headerExtra={<Badge color={COLOR_OPTS.PRIMARY}>Eingeschrieben</Badge>}>
                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                            <Input preIcon={<TbId size={20} />} labelSmall label={"Kurs Name"} disabled value={props.course?.name} />
                            <Input
                                preIcon={<TbCalendar size={20} />}
                                label={"Eingeschrieben am"}
                                labelSmall
                                disabled
                                value={dayjs.utc(props.course?.UsersBelongsToCourses?.createdAt).format(Config.DATETIME_FORMAT)}
                            />
                            <Input
                                labelSmall
                                preIcon={<TbClock size={20} />}
                                label={"Ungefähre Dauer"}
                                disabled
                                value={getDuration(props.course?.information?.data, language)}
                            />
                            <Input
                                preIcon={<TbCertificate size={20} />}
                                label={"Rating nach Abschluss"}
                                labelSmall
                                disabled
                                value={getAtcRatingCombined(props.course?.information?.data?.rating)}
                            />
                            <Input
                                labelSmall
                                preIcon={<TbCertificate size={20} />}
                                label={"Endorsement nach Abschluss (TODO)"}
                                disabled
                                value={getEndorsement(props.course?.information?.data)}
                            />
                        </div>

                        <div className={"flex mt-7 lg:flex-row flex-col"}>
                            <Button
                                className={"lg:mr-3"}
                                variant={"twoTone"}
                                size={SIZE_OPTS.SM}
                                onClick={() => setShowWithdrawModal(true)}
                                color={COLOR_OPTS.DANGER}
                                icon={<TbDoorExit size={20} />}>
                                Vom Kurs Abmelden
                            </Button>

                            <RenderIf
                                truthValue={
                                    props.trainingRequests.filter((tr: TrainingRequestModel) => tr.status == "requested" || tr.status == "planned").length == 0
                                }
                                elementTrue={
                                    <Button
                                        className={"mt-3 lg:mt-0"}
                                        loading={props.loadingCourse}
                                        disabled={props.course == null || props.course.UsersBelongsToCourses?.next_training_type == null}
                                        icon={<TbChevronsRight size={20} />}
                                        size={SIZE_OPTS.SM}
                                        onClick={() => props.setShowRequestTrainingModal(true)}
                                        variant={"twoTone"}
                                        color={COLOR_OPTS.PRIMARY}>
                                        Training Beantragen
                                    </Button>
                                }
                            />
                        </div>
                    </Card>
                }
            />

            <CWithdrawPartial show={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} course={props.course} />
        </>
    );
}
