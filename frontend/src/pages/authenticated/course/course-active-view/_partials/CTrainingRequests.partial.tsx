import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import React from "react";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import ActiveCourseTrainingRequestListTypes from "../_types/CAVTrainingRequestList.types";
import { useNavigate } from "react-router-dom";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CAVTrainingRequestsSkeleton } from "@/pages/authenticated/course/course-active-view/_skeletons/CAVTrainingRequests.skeleton";

type ActiveCourseTrainingRequestsPartialProps = {
    trainingRequests: TrainingRequestModel[];
    loading: boolean;
};

export function CTrainingRequestsPartial(props: ActiveCourseTrainingRequestsPartialProps) {
    const navigate = useNavigate();

    return (
        <RenderIf
            truthValue={props.loading}
            elementTrue={<CAVTrainingRequestsSkeleton />}
            elementFalse={
                <Card header={"Trainingsanfragen"} headerBorder className={"mt-5"}>
                    <p className={"text-xs mb-2"}>
                        Du bekommst zum Ablaufdatum eine E-Mail von uns, in der Du dein weiteres Interesse an diesem Training bestätigen musst. Falls dies nicht
                        innerhalb von 4 Wochen bestätigt wird, verfällt deine Anfrage automatisch.
                    </p>
                    <Table
                        paginate={false}
                        columns={ActiveCourseTrainingRequestListTypes.getColumns(navigate)}
                        data={props.trainingRequests.sort((a, b) => {
                            return a.status > b.status ? -1 : 1;
                        })}
                        loading={props.loading}
                    />
                </Card>
            }
        />
    );
}
