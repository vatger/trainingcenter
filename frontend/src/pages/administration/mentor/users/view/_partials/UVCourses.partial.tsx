import { CourseModel } from "@/models/CourseModel";
import { useNavigate } from "react-router-dom";
import { Table } from "@/components/ui/Table/Table";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import React, { Dispatch, useState } from "react";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import UVTypes from "@/pages/administration/mentor/users/view/_types/UV.types";
import useApi from "@/utils/hooks/useApi";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { UVAddCourseModal } from "@/pages/administration/mentor/users/view/_modals/UVAddCourse.modal";
import { UserModel } from "@/models/UserModel";

export function UVCoursesPartial({ user, setUser, user_id }: { user: UserModel | undefined; setUser: Dispatch<UserModel>; user_id: string }) {
    const navigate = useNavigate();

    const [showCourseEnrolModal, setShowCourseEnrolModal] = useState<boolean>(false);

    return (
        <>
            <Card
                header={"Kurse"}
                className={"mt-7"}
                headerBorder
                headerExtra={
                    <Button
                        size={SIZE_OPTS.XS}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbPlus size={20} />}
                        onClick={() => setShowCourseEnrolModal(true)}>
                        In Kurs Einschreiben
                    </Button>
                }>
                <Table columns={UVTypes.getCoursesTableColumns(navigate, user_id)} paginate defaultSortField={1} data={user?.courses ?? []} />
            </Card>

            <UVAddCourseModal
                user={user}
                show={showCourseEnrolModal}
                onCourseEnrolment={c => {
                    if (user == null) return;

                    const newUser = structuredClone(user);

                    newUser.courses?.push({
                        ...c,
                        UsersBelongsToCourses: {
                            id: -1,
                            user_id: Number(user?.id),
                            course_id: c.id,
                            next_training_type: c.initial_training_type,
                            completed: false,
                            createdAt: new Date(),
                        },
                    });
                    setUser(newUser);
                }}
                onClose={() => setShowCourseEnrolModal(false)}
            />
        </>
    );
}
