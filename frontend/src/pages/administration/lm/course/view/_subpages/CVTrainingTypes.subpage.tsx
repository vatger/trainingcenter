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

export function CVTrainingTypesSubpage({ courseUUID }: { courseUUID: string | undefined }) {
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

    const [selectedTrainingType, setSelectedTrainingType] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function addTrainingType() {
        setIsSubmitting(true);
        const selectedTrainingTypeID = Number(selectedTrainingType);
        const newTrainingType = trainingTypes?.find(t => t.id == selectedTrainingTypeID);
        if (isNaN(selectedTrainingTypeID) || newTrainingType == null) {
            setIsSubmitting(false);
            return;
        }

        axiosInstance
            .post(`/administration/course/training-type/${courseUUID}`, {
                training_type_id: selectedTrainingTypeID,
            })
            .then(() => {
                ToastHelper.success("Trainingstyp erfolgreich hinzugefügt");
                setCourseTrainingTypes([...courseTrainingTypes!, newTrainingType]);
                setSelectedTrainingType(undefined);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Hinzufügen des Trainingstypen");
            })
            .finally(() => setIsSubmitting(false));
    }

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
                setSelectedTrainingType(undefined);
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Löschen des Trainingstypen");
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <>
            <RenderIf
                truthValue={loadingTrainingTypes}
                elementTrue={<CVTrainingTypesSkeleton />}
                elementFalse={
                    <>
                        <div className={"flex flex-col"}>
                            <Select
                                label={"Trainingstypen Hinzufügen"}
                                labelSmall
                                disabled={isSubmitting}
                                onChange={v => {
                                    if (v == "-1") {
                                        setSelectedTrainingType(undefined);
                                    }

                                    setSelectedTrainingType(v);
                                }}
                                value={selectedTrainingType ?? "-1"}>
                                <option value={"-1"} disabled>
                                    Trainingstypen Auswählen
                                </option>

                                <MapArray
                                    data={
                                        trainingTypes?.filter(t => {
                                            return !courseTrainingTypes?.find(cT => cT.id == t.id);
                                        }) ?? []
                                    }
                                    mapFunction={(trainingType: TrainingTypeModel, index) => {
                                        return (
                                            <option key={index} value={trainingType.id}>
                                                {trainingType.name}
                                            </option>
                                        );
                                    }}
                                />
                            </Select>
                        </div>

                        <Button
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            className={"mt-5"}
                            icon={<TbPlus size={20} />}
                            loading={isSubmitting}
                            size={SIZE_OPTS.SM}
                            onClick={addTrainingType}>
                            Hinzufügen
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
