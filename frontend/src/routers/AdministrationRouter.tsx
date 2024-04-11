import { Route, Routes, useLocation } from "react-router-dom";
import React from "react";
import { Error403 } from "@/pages/errors/403";
import { Error404 } from "@/pages/errors/404";
import { UserListView } from "@/pages/administration/mentor/users/list/UserList.view";
import { UserViewView } from "@/pages/administration/mentor/users/view/UserView.view";
import { RequestFastTrackView } from "@/pages/administration/mentor/users/view/_subpages/UVRequestFastTrack.subpage";
import { UVNotesSubpage } from "@/pages/administration/mentor/users/view/_subpages/UVNotes.subpage";
import { AdminCourseListView } from "@/pages/administration/lm/course/list/CourseList.view";
import { CourseCreateView } from "@/pages/administration/lm/course/create/CourseCreate.view";
import { CourseViewView } from "@/pages/administration/lm/course/view/CourseView.view";
import { UserCourseProgressView } from "@/pages/administration/mentor/user-course-progress/view/UserCourseProgress.view";
import { OpenTrainingRequestList } from "@/pages/administration/mentor/request/open-request-list/OpenTrainingRequestList";
import { OpenTrainingRequestView } from "@/pages/administration/mentor/request/open-request-view/OpenTrainingRequest.view";
import { MentorTrainingListView } from "@/pages/administration/mentor/training-session/planned-list/MentorTrainingList.view";
import { MentorTrainingView } from "@/pages/administration/mentor/training-session/planned-view/MentorTraining.view";
import { TrainingSessionLogsCreateView } from "@/pages/administration/mentor/training-session/session-log-create/TrainingSessionLogsCreate.view";
import { TrainingSessionCreateView } from "@/pages/administration/mentor/training-session/session-create/TrainingSessionCreate.view";
import { TrainingSessionCreateFromRequestView } from "@/pages/administration/mentor/training-session/session-create/TrainingSessionCreateFromRequest.view";
import { MentorGroupListView } from "@/pages/administration/lm/mentor-group/list/MentorGroupList.view";
import { MentorGroupCreateView } from "@/pages/administration/lm/mentor-group/create/MentorGroupCreate.view";
import { MentorGroupViewView } from "@/pages/administration/lm/mentor-group/view/MentorGroupView.view";
import { TrainingTypeListView } from "@/pages/administration/lm/training-type/list/TrainingTypeList.view";
import { TrainingTypeCreateView } from "@/pages/administration/lm/training-type/create/TrainingTypeCreate.view";
import { TrainingTypeViewView } from "@/pages/administration/lm/training-type/view/TrainingTypeView.view";
import { LogTemplateListView } from "@/pages/administration/atd/log-template/log-template-list/LogTemplateList.view";
import { LogTemplateViewView } from "@/pages/administration/atd/log-template/log-template-view/LogTemplateView.view";
import { LogTemplateCreateView } from "@/pages/administration/atd/log-template/log-template-create/LogTemplateCreate.view";
import { TrainingStationListView } from "@/pages/administration/atd/training-station/training-station-list/TrainingStationList.view";
import { ActionListView } from "@/pages/administration/lm/actions/list/ActionList.view";
import { EndorsementGroupListView } from "@/pages/administration/lm/endorsement-group/list/EndorsementGroupList.view";
import { EndorsementGroupCreateView } from "@/pages/administration/lm/endorsement-group/create/EndorsementGroupCreate.view";
import { EndorsementGroupViewView } from "@/pages/administration/lm/endorsement-group/view/EndorsementGroupView.view";
import { FastTrackListView } from "@/pages/administration/atd/fast-track/list/FastTrackList.view";
import { FastTrackViewView } from "@/pages/administration/atd/fast-track/view/FastTrackView.view";
import { SyslogListView } from "@/pages/administration/tech/syslog/list/SyslogList.view";
import { SyslogViewView } from "@/pages/administration/tech/syslog/view/SyslogView.view";
import { JoblogListView } from "@/pages/administration/tech/joblog/list/JoblogList.view";
import { JoblogViewView } from "@/pages/administration/tech/joblog/view/JoblogView.view";
import { PermissionListView } from "@/pages/administration/tech/permission/list/PermissionList.view";
import { RoleViewView } from "@/pages/administration/tech/permission/view/RoleView.view";
import { MyTrainingSessionListView } from "@/pages/administration/mentor/training-session/my-list/MyTrainingSessionList.view";
import { MyTrainingSessionView } from "@/pages/administration/mentor/training-session/my-view/MyTrainingSession.view";

export function AdministrationRouter() {
    const location = useLocation();

    return (
        <Routes>
            <Route path={"users"}>
                <Route path={"list"} element={<UserListView />} />
                <Route path={"overview"} element={<h1>TBD</h1>} />

                <Route path={":user_id"}>
                    <Route path={""} element={<UserViewView />} />
                    <Route path={"fast-track"} element={<RequestFastTrackView />} />
                    <Route path={"notes"} element={<UVNotesSubpage />} />
                </Route>
            </Route>

            <Route path={"course"}>
                <Route path={""} element={<AdminCourseListView />} />
                <Route path={"create"} element={<CourseCreateView />} />
                <Route path={":uuid"} element={<CourseViewView />} />
            </Route>

            <Route path={"user-course-progress"}>
                <Route path={":course_uuid/:user_id"} element={<UserCourseProgressView />} />
            </Route>

            <Route path={"training-request"}>
                <Route path={"open"}>
                    <Route path={""} element={<OpenTrainingRequestList />} />
                    <Route path={":uuid"} element={<OpenTrainingRequestView />} />
                </Route>

                <Route path={"planned"}>
                    <Route path={""} element={<MentorTrainingListView />} />
                    <Route path={":uuid"} element={<MentorTrainingView />} />
                    <Route path={":uuid/logs-create"} element={<TrainingSessionLogsCreateView />} />
                </Route>
            </Route>

            <Route path={"training-session"}>
                <Route path={"my"} element={<MyTrainingSessionListView />} />
                <Route path={"my/:uuid"} element={<MyTrainingSessionView />} />
                <Route path={"create"} element={<TrainingSessionCreateView />} />
                <Route path={"create/:uuid"} element={<TrainingSessionCreateFromRequestView />} />
            </Route>

            <Route path={"mentor-group"}>
                <Route path={""} element={<MentorGroupListView />} />
                <Route path={"create"} element={<MentorGroupCreateView />} />
                <Route path={":id"} element={<MentorGroupViewView />} />
            </Route>

            <Route path={"training-type"}>
                <Route path={""} element={<TrainingTypeListView />} />
                <Route path={"create"} element={<TrainingTypeCreateView />} />
                <Route path={":id"} element={<TrainingTypeViewView />} />
            </Route>

            <Route path={"log-template"}>
                <Route path={""} element={<LogTemplateListView />} />
                <Route path={":id"} element={<LogTemplateViewView />} />
                <Route path={"create"} element={<LogTemplateCreateView />} />
            </Route>

            <Route path={"training-station"}>
                <Route path={""} element={<TrainingStationListView />} />
            </Route>

            <Route path={"action-requirement"}>
                <Route path={""} element={<ActionListView />} />
                <Route path={"create"} element={<></>} />
            </Route>

            <Route path={"endorsement-group"}>
                <Route path={""} element={<EndorsementGroupListView />} />
                <Route path={"create"} element={<EndorsementGroupCreateView />} />

                <Route path={":id"} element={<EndorsementGroupViewView />} />
            </Route>

            <Route path={"fast-track"}>
                <Route path={""} element={<FastTrackListView />} />
                <Route path={":id"} element={<FastTrackViewView />} />
            </Route>

            <Route path={"syslog"}>
                <Route path={""} element={<SyslogListView />} />
                <Route path={":id"} element={<SyslogViewView />} />
            </Route>

            <Route path={"joblog"}>
                <Route path={""} element={<JoblogListView />} />
                <Route path={":id"} element={<JoblogViewView />} />
            </Route>

            <Route path={"permission"}>
                <Route path={""} element={<PermissionListView />} />
                <Route path={"roles/:role_id"} element={<RoleViewView />} />
            </Route>

            <Route path={"403"} element={<Error403 />} />
            <Route path={"*"} element={<Error404 path={location.pathname} />} />
        </Routes>
    );
}
