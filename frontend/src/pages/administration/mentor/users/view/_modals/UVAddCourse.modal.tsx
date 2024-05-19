import { CourseModel } from "@/models/CourseModel";
import { Modal } from "@/components/ui/Modal/Modal";
import useApi from "@/utils/hooks/useApi";
import { ModalProps } from "@/components/ui/Modal/Modal.props";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, ICON_SIZE_OPTS, SIZE_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { TbUserPlus } from "react-icons/tb";
import { FormEvent, useState } from "react";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import FormHelper from "@/utils/helper/FormHelper";
import { AxiosResponse } from "axios";
import ToastHelper from "@/utils/helper/ToastHelper";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Alert } from "@/components/ui/Alert/Alert";
import { UserModel } from "@/models/UserModel";

interface ICourseModal extends ModalProps {
    user?: UserModel;
    onCourseEnrolment: (c: CourseModel) => any;
}

export function UVAddCourseModal({ user, show, onClose, onCourseEnrolment }: ICourseModal) {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [coursesAvailableCount, setCoursesAvailableCount] = useState<number>(1);

    const { loading: loadingMentorableCourses, data: mentorableCourses } = useApi<CourseModel[]>({
        url: "/user/course/mentorable",
        method: "get",
        onLoad: mentorableCourses => {
            const num = mentorableCourses.filter(c => !user?.courses?.find(ci => ci.id == c.id)).length ?? 1;
            setCoursesAvailableCount(num);
        },
    });

    function enrolUser(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const formData = FormHelper.getEntries(e.target);
        FormHelper.append(formData, "user_id", user?.id);

        axiosInstance
            .post("/administration/user/enrol", FormHelper.toJSON(formData))
            .then((res: AxiosResponse) => {
                const data = res.data as CourseModel;
                ToastHelper.success("Benutzer wurde dem Kurs erfolgreich hinzugefügt");
                onClose?.();
                onCourseEnrolment(data);
                setCoursesAvailableCount(Math.min(coursesAvailableCount - 1, 0));
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Hinzufügen des Benutzers");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <form onSubmit={enrolUser}>
            <Modal
                show={show}
                onClose={onClose}
                title={"In Kurs einschreiben"}
                footer={
                    <Button
                        type={"submit"}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        size={SIZE_OPTS.MD}
                        loading={submitting}
                        disabled={loadingMentorableCourses || coursesAvailableCount == 0}
                        icon={<TbUserPlus size={ICON_SIZE_OPTS.MD} />}>
                        Einschreiben
                    </Button>
                }>
                <p>
                    Der Benutzer wird in den ausgewählten Kurs eingeschrieben. Es wird keine weitere Überprüfung geben, ob der Benutzer die Voraussetzungen des
                    Kurses erfüllt. Diese Option sollte daher nur im "Notfall", bzw. falls die Selbsteinschreibung deaktiviert worden ist, genutzt werden.
                </p>

                <RenderIf
                    truthValue={coursesAvailableCount > 0}
                    elementFalse={
                        <Alert type={TYPE_OPTS.DANGER} showIcon className={"mt-5"}>
                            Du bist keinem weiteren Kurs zugeordnet, in welchem der Benutzer noch nicht eingeschrieben ist. Du kannst diesen Benutzer daher in
                            keinen weiteren Kurs hinzufügen.
                        </Alert>
                    }
                    elementTrue={
                        <Select
                            className={"mt-5"}
                            label={"Kurs auswählen"}
                            loading={loadingMentorableCourses}
                            labelSmall
                            name={"course_id"}
                            defaultValue={"-1"}>
                            <MapArray
                                data={mentorableCourses ?? []}
                                mapFunction={(c, i) => {
                                    if (user?.courses?.find(ci => ci.id == c.id)) return;

                                    return (
                                        <option value={c.id} key={i}>
                                            {c.name}
                                        </option>
                                    );
                                }}
                            />
                        </Select>
                    }
                />
            </Modal>
        </form>
    );
}
