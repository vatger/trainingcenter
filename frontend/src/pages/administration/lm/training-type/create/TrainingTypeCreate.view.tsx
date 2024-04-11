import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { TbBook2, TbFilePlus, TbId, TbTemplate } from "react-icons/tb";
import { Select } from "@/components/ui/Select/Select";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { FormEvent, useState } from "react";
import FormHelper from "../../../../../utils/helper/FormHelper";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { useNavigate } from "react-router-dom";
import { MapArray } from "@/components/conditionals/MapArray";
import useApi from "@/utils/hooks/useApi";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";

export function TrainingTypeCreateView() {
    const navigate = useNavigate();

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

        axiosInstance
            .post("/administration/training-type", data)
            .then((res: AxiosResponse) => {
                const data = res.data as TrainingTypeModel;
                navigate("/administration/training-type/" + data.id + "?r");
                ToastHelper.success("Trainingstyp erfolgreich erstellt");
            })
            .catch(() => {
                ToastHelper.error("Es ist ein Fehler beim Erstellen des Trainingtyps aufgetreten");
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <>
            <PageHeader title={"Trainingstyp Erstellen"} />

            <Card>
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
            </Card>
        </>
    );
}
