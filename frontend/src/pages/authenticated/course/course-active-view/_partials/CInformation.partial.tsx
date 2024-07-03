import { CAVRequestTrainingModal } from "../_modals/CAVRequestTraining.modal";
import { CourseModel } from "@/models/CourseModel";
import { Card } from "@/components/ui/Card/Card";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendar, TbCertificate, TbChevronsRight, TbClock, TbDoorExit, TbId } from "react-icons/tb";
import { getAtcRatingCombined } from "@common/AtcRatingHelper";
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
import { CGeneralInformationPartial } from "@/pages/authenticated/course/_partials/CGeneralInformation.partial";

type ActiveCourseInformationPartialProps = {
    showRequestTrainingModal: boolean;
    setShowRequestTrainingModal: Dispatch<boolean>;
    setTrainingRequests: Dispatch<TrainingRequestModel[]>;
    course?: CourseModel;
    loadingCourse: boolean;
    trainingRequests: TrainingRequestModel[];
};

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
                        <CGeneralInformationPartial loading={props.loadingCourse} course={props.course} showDuration />

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
