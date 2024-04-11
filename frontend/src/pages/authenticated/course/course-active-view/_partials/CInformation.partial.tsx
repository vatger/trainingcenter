import { CAVRequestTrainingModal } from "../_modals/CAVRequestTraining.modal";
import { CourseModel } from "@/models/CourseModel";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendar, TbCertificate, TbChevronsRight, TbDoorExit, TbId } from "react-icons/tb";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Button } from "@/components/ui/Button/Button";
import React, { Dispatch, useState } from "react";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CWithdrawPartial } from "./CWithdraw.partial";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { CCourseInformationSkeleton } from "@/pages/authenticated/course/_skeletons/CCourseInformation.skeleton";

type ActiveCourseInformationPartialProps = {
    showRequestTrainingModal: boolean;
    setShowRequestTrainingModal: Dispatch<boolean>;
    setTrainingRequests: Dispatch<TrainingRequestModel[]>;
    course?: CourseModel;
    loadingCourse: boolean;
    trainingRequests: TrainingRequestModel[];
};

export function CInformationPartial(props: ActiveCourseInformationPartialProps) {
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
                                preIcon={<TbCertificate size={20} />}
                                label={"Rating nach Abschluss"}
                                labelSmall
                                disabled
                                value={getAtcRatingCombined(props.course?.information?.data?.rating_on_complete)}
                            />
                            <Input
                                preIcon={<TbCertificate size={20} />}
                                label={"Endorsement nach Abschluss"}
                                labelSmall
                                disabled
                                value={getAtcRatingCombined(props.course?.information?.data?.rating_on_complete)}
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
