import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useParams } from "react-router-dom";
import React from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { UVGeneralInformationPartial } from "./_partials/UVGeneralInformation.partial";
import { UVCoursesPartial } from "./_partials/UVCourses.partial";
import { UVUserViewSkeleton } from "./_skeletons/UVUserView.skeleton";
import { NetworkError } from "@/components/errors/NetworkError";
import { UVMentorGroupsPartial } from "./_partials/UVMentorGroups.partial";
import useApi from "@/utils/hooks/useApi";
import { UserModel } from "@/models/UserModel";
import { UVEndorsementsPartial } from "@/pages/administration/mentor/users/view/_partials/UVEndorsements.partial";
import { UVSoloPartial } from "@/pages/administration/mentor/users/view/_partials/UVSolo.partial";

export function UserViewView() {
    const { user_id } = useParams();

    const {
        loading: loadingUser,
        data: userData,
        setData: setUserData,
        loadingError,
    } = useApi<UserModel>({
        url: "/administration/user/data",
        method: "GET",
        params: {
            user_id: user_id,
        },
    });

    return (
        <>
            <PageHeader title={"Benutzer Verwalten"} />

            <RenderIf
                truthValue={loadingError != null}
                elementTrue={<NetworkError closeable={false} error={loadingError} />}
                elementFalse={
                    <RenderIf
                        truthValue={loadingUser}
                        elementTrue={<UVUserViewSkeleton />}
                        elementFalse={
                            <>
                                <UVGeneralInformationPartial user={userData} />
                                <UVSoloPartial user={userData} setUser={setUserData} />
                                <UVCoursesPartial courses={userData?.courses} user_id={user_id!} />
                                <UVEndorsementsPartial user={userData} setUser={setUserData} />
                                <RenderIf
                                    truthValue={(userData?.mentor_groups?.length ?? 0) > 0}
                                    elementTrue={<UVMentorGroupsPartial mentorGroups={userData?.mentor_groups ?? []} />}
                                />
                            </>
                        }
                    />
                }
            />
        </>
    );
}
