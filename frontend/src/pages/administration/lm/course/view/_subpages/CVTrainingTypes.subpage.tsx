import { Table } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { useState } from "react";
import { Separator } from "@/components/ui/Separator/Separator";
import { Select } from "@/components/ui/Select/Select";
import { TbPlus } from "react-icons/tb";
import useApi from "@/utils/hooks/useApi";
import { MapArray } from "@/components/conditionals/MapArray";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { CVTrainingTypesSkeleton } from "@/pages/administration/lm/course/view/_skeletons/CVTrainingTypes.skeleton";
import CVTrainingTypeListTypes from "@/pages/administration/lm/course/view/_types/CVTrainingTypeList.types";
import { useNavigate } from "react-router-dom";
import { CVCreateTrainingTypeModal } from "@/pages/administration/lm/course/view/_modals/CVCreateTrainingType.modal";

export function CVTrainingTypesSubpage({ courseUUID }: { courseUUID: string | undefined }) {
    const navigate = useNavigate();

    const {
        loading: loadingCourseTrainingTypes,
        data: courseTrainingTypes,
        setData: setCourseTrainingTypes,
    } = useApi<TrainingTypeModel[]>({
        url: `/administration/course/training-type/${courseUUID}`,
        method: "get",
    });

    const { loading: loadingTrainingTypes, data: trainingTypes } = useApi<TrainingTypeModel[]>({
        url: "/administration/training-type",
        method: "get",
    });

    const [showCreateTrainingTypeModal, setShowCreateTrainingTypeModal] = useState<boolean>(false);
    const [setSelectedTrainingType] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function removeTrainingType(trainingTypeID: number) {
        setIsSubmitting(true);

        axiosInstance
            .delete(`/administration/course/training-type/${courseUUID}`, {
                data: {
                    training_type_id: trainingTypeID,
                },
            })
            .then(() => {
                ToastHelper.success("Trainingstyp erfolgreich entfernt");
                setCourseTrainingTypes(courseTrainingTypes?.filter(t => t.id != trainingTypeID));
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Löschen des Trainingstypen");
            })
            .finally(() => setIsSubmitting(showCreateTrainingTypeModal));
    }

    return (
        <>
            <CVCreateTrainingTypeModal
                show={showCreateTrainingTypeModal}
                onClose={() => setShowCreateTrainingTypeModal(false)}
                onTrainingTypeCreated={t => {
                    setCourseTrainingTypes([...(courseTrainingTypes ?? []), t]);
                }}
            />

            <RenderIf
                truthValue={loadingTrainingTypes}
                elementTrue={<CVTrainingTypesSkeleton />}
                elementFalse={
                    <>
                        <Button
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbPlus size={20} />}
                            loading={isSubmitting}
                            size={SIZE_OPTS.SM}
                            onClick={() => setShowCreateTrainingTypeModal(true)}>
                            Trainingstyp Erstellen
                        </Button>
                    </>
                }
            />

            <Separator />

            <Table
                columns={CVTrainingTypeListTypes.getColumns(isSubmitting, removeTrainingType)}
                data={courseTrainingTypes ?? []}
                paginate
                loading={loadingCourseTrainingTypes}
            />
        </>
    );
}
