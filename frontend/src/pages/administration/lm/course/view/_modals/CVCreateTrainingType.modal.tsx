import { Modal } from "@/components/ui/Modal/Modal";
import { Input } from "@/components/ui/Input/Input";
import { TbBook2, TbFilePlus, TbId, TbTemplate } from "react-icons/tb";
import { Select } from "@/components/ui/Select/Select";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import { Separator } from "@/components/ui/Separator/Separator";
import { MapArray } from "@/components/conditionals/MapArray";
import { TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { FormEvent, useState } from "react";
import useApi from "@/utils/hooks/useApi";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import ToastHelper from "@/utils/helper/ToastHelper";
import { useParams } from "react-router-dom";

interface ICreateTrainingTypeModal {
    show: boolean;
    onClose: () => any;
    onTrainingTypeCreated: (t: TrainingTypeModel) => any;
}

export function CVCreateTrainingTypeModal({ show, onClose, onTrainingTypeCreated }: ICreateTrainingTypeModal) {
    const { uuid } = useParams();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<string>("");

    const { data: trainingLogTemplates, loading: loadingTrainingLogTemplates } = useApi<TrainingLogTemplateModel[]>({
        url: "/administration/training-log/template/min",
        method: "get",
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const data = FormHelper.getEntries(e.target);
        FormHelper.set(data, "course_uuid", uuid);

        axiosInstance
            .post("/administration/training-type", data)
            .then((res: AxiosResponse) => {
                const data = res.data as TrainingTypeModel;
                ToastHelper.success("Trainingstyp erfolgreich erstellt");
                onTrainingTypeCreated(data);
                onClose();
            })
            .catch(() => {
                ToastHelper.error("Es ist ein Fehler beim Erstellen des Trainingtyps aufgetreten");
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <Modal show={show} title={"Trainingstyp Erstellen"} onClose={onClose}>
            <form onSubmit={e => handleSubmit(e)}>
                <div className={"grid md:gap-5"}>
                    <Input
                        name={"name"}
                        type={"text"}
                        maxLength={70}
                        description={"Name des Trainingtyps"}
                        labelSmall
                        placeholder={"Frankfurt Tower Sim Session"}
                        label={"Name"}
                        regex={RegExp("^(?!\\s*$).+")}
                        regexMatchEmpty
                        regexCheckInitial
                        required
                        preIcon={<TbId size={20} />}
                    />
                </div>

                <div className={"grid md:gap-5"}>
                    <Select
                        description={
                            "Bestimmt den Typen des Trainings. Wähle bitte hier das korrekte aus der untenstehenden Liste, da dies Auswirkungen auf andere Elemente der Seite hat."
                        }
                        label={"Typ"}
                        onChange={e => {
                            setSelectedType(e);
                        }}
                        className={"mt-5 flex flex-col"}
                        selectClassName={"mt-auto"}
                        labelSmall
                        required
                        defaultValue={"lesson"}
                        name={"type"}
                        preIcon={<TbBook2 size={20} />}>
                        <option value={"sim"}>Sim Session</option>
                        <option value={"lesson"}>Lesson</option>
                        <option value={"online"}>Online</option>
                        {/*<option value={"cpt"} disabled>CPT</option>*/}
                    </Select>
                </div>

                <TextArea
                    label={"Beschreibung"}
                    labelSmall
                    className={"mt-5"}
                    description={
                        "Optionale Beschreibung des Trainingstyps. Wird dem Benutzer bei der Anfrage angezeigt. Könnte bspw. weitere Voraussetzungen, wie das Bestehen eines Moodle-Kurses beinhalten."
                    }
                    name={"description"}
                />

                <Separator />

                <Select
                    labelSmall
                    label={"Logvorlage"}
                    disabled={selectedType == "cpt"}
                    description={
                        "Bei jedem Training von diesem Typen werden die Mentoren dazu aufgefordert ein Log mit der unten stehenden Vorlage auszuwählen. " +
                        "Falls dieses Feld leer gelassen wird, bekommen die Mentoren ein einfaches Textfeld, welches ausgefüllt werden kann."
                    }
                    name={"log_template_id"}
                    preIcon={<TbTemplate size={20} />}
                    defaultValue={"-1"}>
                    <option value={"-1"}>N/A</option>
                    <MapArray
                        data={trainingLogTemplates ?? []}
                        mapFunction={(trainingLogTemplate: TrainingLogTemplateModel, index: number) => {
                            return (
                                <option key={index} value={trainingLogTemplate.id}>
                                    {trainingLogTemplate.name}
                                </option>
                            );
                        }}
                    />
                </Select>

                <Separator />

                <Button type={"submit"} loading={isSubmitting} icon={<TbFilePlus size={20} />} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                    Trainingtypen Erstellen
                </Button>
            </form>
        </Modal>
    );
}
