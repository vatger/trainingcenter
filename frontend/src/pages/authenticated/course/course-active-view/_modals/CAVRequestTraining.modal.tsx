import { Modal } from "@/components/ui/Modal/Modal";
import { Input } from "@/components/ui/Input/Input";
import StringHelper from "../../../../../utils/helper/StringHelper";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { Separator } from "@/components/ui/Separator/Separator";
import { TbChecklist } from "react-icons/tb";
import { CourseModel } from "@/models/CourseModel";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { CAVTrainingModalSkeleton } from "../_skeletons/CAVTrainingModal.skeleton";
import { Dispatch, FormEvent, useState } from "react";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { Select } from "@/components/ui/Select/Select";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import FormHelper from "../../../../../utils/helper/FormHelper";
import { Alert } from "@/components/ui/Alert/Alert";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import useApi from "@/utils/hooks/useApi";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";

type RequestTrainingModalPartialProps = {
    show: boolean;
    onClose: () => any;
    course: CourseModel | undefined;
    trainingRequests: TrainingRequestModel[];
    setTrainingRequests: Dispatch<TrainingRequestModel[]>;
};

export function CAVRequestTrainingModal(props: RequestTrainingModalPartialProps) {
    const [submitting, setSubmitting] = useState<boolean>(false);

    const { data: nextTraining, loading: loadingNextTraining } = useApi<TrainingTypeModel>({
        url: `/training-type/${props.course?.UsersBelongsToCourses?.next_training_type}`,
        method: "get",
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const formData = FormHelper.getEntries(e.target);
        FormHelper.set(formData, "course_id", props.course?.id);
        FormHelper.set(formData, "training_type_id", nextTraining?.id);

        axiosInstance
            .post("/training-request", formData)
            .then((res: AxiosResponse) => {
                const trainingRequest = res.data as TrainingRequestModel;
                props.setTrainingRequests([...props.trainingRequests, trainingRequest]);
                props.onClose();
                ToastHelper.success("Training wurde erfolgreich beantragt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Beantragen des Trainings");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <Modal show={props.show} onClose={props.onClose} title={"Training Beantragen"}>
            <RenderIf
                truthValue={loadingNextTraining}
                elementTrue={<CAVTrainingModalSkeleton />}
                elementFalse={
                    <form onSubmit={handleSubmit}>
                        <Input disabled label={"Name"} labelSmall readOnly value={nextTraining?.name ?? ""} />

                        <Input disabled className={"mt-5"} label={"Typ"} readOnly labelSmall value={StringHelper.capitalize(nextTraining?.type) ?? ""} />

                        <RenderIf
                            truthValue={nextTraining?.type == "cpt"}
                            elementTrue={
                                <Alert className={"mt-5"} rounded showIcon type={TYPE_OPTS.DANGER}>
                                    Das aktuell zugewiesene Training ist ein CPT. Dieses kannst du nicht beantragen. Sollte das CPT noch nicht geplant worden
                                    sein (siehe unten in der Trainingshistorie), spreche bitte mit einem Mentoren.
                                </Alert>
                            }
                            elementFalse={
                                <>
                                    <TextArea
                                        className={"mt-5"}
                                        label={"Kommentar"}
                                        maxLength={150}
                                        description={"Optionaler Kommentar, bspw. zu deiner generellen Verfügbarkeit"}
                                        labelSmall
                                        name={"comment"}
                                    />

                                    <RenderIf
                                        truthValue={nextTraining?.training_stations != null && nextTraining.training_stations.length >= 1}
                                        elementTrue={
                                            <Select name={"training_station_id"} className={"mt-5"} label={"Station Auswählen"} labelSmall>
                                                <MapArray
                                                    data={nextTraining?.training_stations ?? []}
                                                    mapFunction={(station: TrainingStationModel, index: number) => {
                                                        return (
                                                            <option key={index} value={station.id}>
                                                                {station.callsign.toUpperCase() + " | " + station.frequency.toFixed(3)}
                                                            </option>
                                                        );
                                                    }}
                                                />
                                            </Select>
                                        }
                                    />

                                    <Separator />

                                    <div className={"flex justify-end"}>
                                        <Button
                                            loading={submitting}
                                            type={"submit"}
                                            variant={"twoTone"}
                                            icon={<TbChecklist size={20} />}
                                            color={COLOR_OPTS.PRIMARY}>
                                            Beantragen
                                        </Button>
                                    </div>
                                </>
                            }
                        />
                    </form>
                }
            />
        </Modal>
    );
}
