import { Input } from "@/components/ui/Input/Input";
import { TbBook2, TbCirclePlus, TbEdit, TbId, TbTemplate, TbTrash } from "react-icons/tb";
import { Select } from "@/components/ui/Select/Select";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS } from "@/assets/theme.config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import React, { FormEvent, useState } from "react";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";
import { TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import FormHelper from "../../../../../../utils/helper/FormHelper";
import ToastHelper from "../../../../../../utils/helper/ToastHelper";
import useApi from "@/utils/hooks/useApi";
import { MapArray } from "@/components/conditionals/MapArray";
import { TTViewSettingsSkeleton } from "@/pages/administration/lm/training-type/_skeletons/TTViewSettings.skeleton";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";

type TrainingTypeViewSettingsSubpageProps = {
    trainingTypeID?: string;
};

export function TTVSettingsSubpage(props: TrainingTypeViewSettingsSubpageProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<string>("");

    const {
        data: trainingType,
        loading: loadingTrainingType,
        setData: setTrainingType,
    } = useApi<TrainingTypeModel>({
        url: `/administration/training-type/${props.trainingTypeID ?? "-1"}`,
        method: "get",
        onLoad: trainingType => {
            setSelectedType(trainingType.type);
        },
    });

    const { data: trainingLogTemplates, loading: loadingTrainingLogTemplates } = useApi<TrainingLogTemplateModel[]>({
        url: "/administration/training-log/template/min",
        method: "get",
    });

    function handleUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (props.trainingTypeID == null) {
            return;
        }

        setIsSubmitting(true);

        const data = FormHelper.getEntries(e.target);
        console.log(data);

        axiosInstance
            .patch(`/administration/training-type/${props.trainingTypeID}`, data)
            .then((res: AxiosResponse) => {
                const trainingType = res.data as TrainingTypeModel;
                setTrainingType(trainingType);
                ToastHelper.success("Trainingstyp erfolgreich aktualisiert");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim aktualisieren des Trainingstyps");
            })
            .finally(() => setIsSubmitting(false));
    }

    return (
        <RenderIf
            truthValue={loadingTrainingType || loadingTrainingLogTemplates}
            elementTrue={<TTViewSettingsSkeleton />}
            elementFalse={
                <form onSubmit={handleUpdate}>
                    <div className={"grid md:gap-5"}>
                        <Input
                            name={"name"}
                            type={"text"}
                            maxLength={70}
                            description={"Name des Trainingtyps"}
                            labelSmall
                            value={trainingType?.name}
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
                            className={"mt-5 flex flex-col"}
                            selectClassName={"mt-auto"}
                            labelSmall
                            required
                            defaultValue={trainingType?.type}
                            name={"type"}
                            preIcon={<TbBook2 size={20} />}
                            onChange={e => setSelectedType(e)}>
                            <option value={"lesson"}>Lesson</option>
                            <option value={"online"}>Online</option>
                            <option value={"sim"}>Sim Session</option>
                            {/*<option value={"cpt"}>CPT</option>*/}
                        </Select>
                    </div>

                    <Separator />

                    <Select
                        labelSmall
                        disabled={selectedType == "cpt"}
                        label={"Logvorlage"}
                        description={
                            "Bei jedem Training von diesem Typen werden die Mentoren dazu aufgefordert ein Log mit der unten stehenden Vorlage auszuwählen. " +
                            "Falls dieses Feld leer gelassen wird, bekommen die Mentoren ein einfaches Textfeld, welches ausgefüllt werden kann."
                        }
                        name={"log_template_id"}
                        preIcon={<TbTemplate size={20} />}
                        defaultValue={trainingType?.log_template_id ?? "-1"}>
                        <option value={"n/a"}>N/A</option>
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

                    <div className={"flex flex-col sm:flex-row"}>
                        <Button type={"submit"} loading={isSubmitting} icon={<TbEdit size={20} />} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                            {isSubmitting ? <>Änderungen werden gespeichert</> : <>Änderungen Speichern</>}
                        </Button>
                    </div>
                </form>
            }
        />
    );
}
