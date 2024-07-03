import { Card } from "@/components/ui/Card/Card";
import { CourseModel } from "@/models/CourseModel";
import { EEnrolRequirementType, ICourseEnrolRequirement } from "@common/Course.model";
import { MapArray } from "@/components/conditionals/MapArray";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Alert } from "@/components/ui/Alert/Alert";
import { Dispatch, useState } from "react";
import { Badge } from "@/components/ui/Badge/Badge";
import { getAtcRatingShort } from "@common/AtcRatingHelper";
import { Button } from "@/components/ui/Button/Button";

interface ICVEnrolOptions {
    course?: CourseModel;
    setShowModal: Dispatch<boolean>;
}

export function CVEnrolOptionsPartial({ course, setShowModal }: ICVEnrolOptions) {
    function parseRequirements(requirement: ICourseEnrolRequirement) {
        switch (requirement.type) {
            case EEnrolRequirementType.EXACT_RATING:
                return (
                    <>
                        Das <Badge color={COLOR_OPTS.PRIMARY}>Rating</Badge> muss genau{" "}
                        <Badge color={COLOR_OPTS.PRIMARY}>{getAtcRatingShort(Number(requirement.value))}</Badge> entsprechen.
                    </>
                );

            case EEnrolRequirementType.MIN_RATING:
                return (
                    <>
                        Das <Badge color={COLOR_OPTS.PRIMARY}>Rating</Badge> muss mindestens{" "}
                        <Badge color={COLOR_OPTS.PRIMARY}>{getAtcRatingShort(Number(requirement.value))}</Badge> entsprechen.
                    </>
                );

            case EEnrolRequirementType.MAX_RATING:
                return (
                    <>
                        Das <Badge color={COLOR_OPTS.PRIMARY}>Rating</Badge> darf höchstens{" "}
                        <Badge color={COLOR_OPTS.PRIMARY}>{getAtcRatingShort(Number(requirement.value))}</Badge> entsprechen.
                    </>
                );

            case EEnrolRequirementType.MIN_HOURS_STATION:
                return (
                    <>
                        Es müssen mindestens <Badge color={COLOR_OPTS.PRIMARY}>{`${requirement.value} Stunden`}</Badge> auf der Station{" "}
                        <Badge color={COLOR_OPTS.PRIMARY}>{requirement.parameters["_atc_station_regex"]}</Badge> erbracht worden sein.
                    </>
                );
        }
    }

    return (
        <div className={"p-4"}>
            <RenderIf
                truthValue={course?.enrol_requirements?.length == 0}
                elementTrue={
                    <Alert type={TYPE_OPTS.WARNING} showIcon={true}>
                        Der Kurs besitzt aktuell keine Einschreibeoptionen. Sofern dieser auf aktiv geschaltet wird, können sich alle Mitglieder einschreiben.
                    </Alert>
                }
            />

            <ul className={"pl-3"}>
                <MapArray
                    data={course?.enrol_requirements ?? []}
                    mapFunction={(requirement: ICourseEnrolRequirement, index) => {
                        return (
                            <li key={index} className={"mb-3 list-disc"}>
                                {parseRequirements(requirement)}
                            </li>
                        );
                    }}
                />
            </ul>

            <Button onClick={() => setShowModal(true)}>Hinzufügen</Button>
        </div>
    );
}
