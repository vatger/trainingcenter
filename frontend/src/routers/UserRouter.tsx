import { Route, Routes, useLocation } from "react-router-dom";
import { Overview } from "@/pages/authenticated/overview/Overview";
import { ConfirmInterestedView } from "@/pages/authenticated/misc/ConfirmInterested.view";
import { ManageAccountView } from "@/pages/authenticated/account/manage-account/ManageAccount.view";
import { CourseListView } from "@/pages/authenticated/course/course-list/CourseList.view";
import { CourseView } from "@/pages/authenticated/course/course-view/Course.view";
import { CourseEnrolView } from "@/pages/authenticated/course/course-enrol/CourseEnrol.view";
import { ActiveCoursesListView } from "@/pages/authenticated/course/course-active-list/ActiveCoursesList.view";
import { ActiveCourseView } from "@/pages/authenticated/course/course-active-view/ActiveCourse.view";
import { TrainingOpenRequestListView } from "@/pages/authenticated/training/training-open-request-list/TrainingOpenRequestList.view";
import { TrainingOpenRequestViewView } from "@/pages/authenticated/training/training-open-request-view/TrainingOpenRequestView.view";
import { PlannedTrainingListView } from "@/pages/authenticated/training/training-planned-list/PlannedTrainingList.view";
import { PlannedTrainingView } from "@/pages/authenticated/training/training-planned-view/PlannedTrainingView.view";
import { TrainingLogViewView } from "@/pages/authenticated/training/training-log-view/TrainingLogView.view";
import React from "react";
import { Error403 } from "@/pages/errors/403";
import { Error404 } from "@/pages/errors/404";
import { CourseCompletedListView } from "@/pages/authenticated/course/course-completed-list/CourseCompletedList.view";
import { CourseCompletedView } from "@/pages/authenticated/course/course-completed-view/CourseCompleted.view";
import { TrainingCompletedListView } from "@/pages/authenticated/training/training-completed-list/TrainingCompletedList.view";

export function UserRouter() {
    const location = useLocation();

    return (
        <Routes>
            <Route path={"confirm-interest"} element={<ConfirmInterestedView />} />

            <Route path={"account"}>
                <Route path={"manage"} element={<ManageAccountView />} />
            </Route>

            <Route path={"course"}>
                <Route path={""} element={<CourseListView />} />
                <Route path={":uuid"} element={<CourseView />} />
                <Route path={":uuid/enrol"} element={<CourseEnrolView />} />

                <Route path={"active"}>
                    <Route path={""} element={<ActiveCoursesListView />} />
                    <Route path={":uuid"} element={<ActiveCourseView />} />
                </Route>

                <Route path={"completed"}>
                    <Route path={""} element={<CourseCompletedListView />} />
                    <Route path={":uuid"} element={<CourseCompletedView />} />
                </Route>
            </Route>

            <Route path={"training"}>
                <Route path={"request"}>
                    <Route path={"open"} element={<TrainingOpenRequestListView />} />
                    <Route path={":uuid"} element={<TrainingOpenRequestViewView />} />
                </Route>

                <Route path={"planned"}>
                    <Route path={""} element={<PlannedTrainingListView />} />
                    <Route path={":uuid"} element={<PlannedTrainingView />} />
                </Route>

                <Route path={"log"}>
                    <Route path={":uuid"} element={<TrainingLogViewView />} />
                </Route>

                <Route path={"completed"} element={<TrainingCompletedListView />} />
            </Route>

            <Route path={"403"} element={<Error403 />} />
            <Route path={"*"} element={<Error404 path={location.pathname} />} />
        </Routes>
    );
}
