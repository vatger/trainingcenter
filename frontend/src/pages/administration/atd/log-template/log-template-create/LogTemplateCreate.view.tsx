import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import { TbEdit, TbEyeCheck, TbFilePlus, TbId } from "react-icons/tb";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { MapArray } from "@/components/conditionals/MapArray";
import FormHelper from "../../../../../utils/helper/FormHelper";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { LogTemplateElement, TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import ToastHelper from "../../../../../utils/helper/ToastHelper";
import { LTTemplateElementPreviewPartial } from "@/pages/administration/atd/log-template/_shared/_partials/LTTemplateElementPreview.partial";
import { LTTemplateElementPartial } from "@/pages/administration/atd/log-template/_shared/_partials/LTTemplateElement.partial";
import { LTTemplateElementModal } from "@/pages/administration/atd/log-template/_shared/_modals/LTTemplateElement.modal";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";

export function LogTemplateCreateView() {
    const navigate: NavigateFunction = useNavigate();
    const [content, setContent] = useState<LogTemplateElement[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showingPreview, setShowingPreview] = useState<boolean>(false);

    const [addElementModalOpen, setAddElementModalOpen] = useState<boolean>(false);

    function createTemplate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        let formData = FormHelper.getEntries(e.target);
        FormHelper.set(formData, "content", content);

        axiosInstance
            .post("/administration/training-log/template", formData)
            .then((res: AxiosResponse) => {
                const data = res.data as TrainingLogTemplateModel;

                navigate("/administration/log-template/" + data.id + "?r");
                ToastHelper.success("Logvorlage erfolgreich erstellt");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen der Logvorlage");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <>
            <PageHeader title={"Logvorlage Erstellen"} />

            <Card header={"Eigenschaften"} headerBorder>
                <form onSubmit={createTemplate}>
                    <Input
                        name={"name"}
                        type={"text"}
                        maxLength={70}
                        description={"Name der Logvorlage"}
                        labelSmall
                        placeholder={"Frankfurt Tower Sim Vorlage"}
                        label={"Name"}
                        required
                        regex={RegExp("^(?!\\s*$).+")}
                        regexMatchEmpty
                        regexCheckInitial
                        preIcon={<TbId size={20} />}
                    />

                    <Separator />

                    <Button
                        loading={submitting}
                        disabled={content.length == 0}
                        type={"submit"}
                        icon={<TbFilePlus size={20} />}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}>
                        Logvorlage Erstellen
                    </Button>
                </form>
            </Card>

            <Card className={"mt-5"} header={"Inhalt der Logvorlage"} headerBorder>
                <RenderIf
                    truthValue={content.length == 0}
                    elementTrue={<>Kein Inhalt vorhanden</>}
                    elementFalse={
                        <MapArray
                            data={content}
                            mapFunction={(value: LogTemplateElement, index) => {
                                return (
                                    <RenderIf
                                        key={index}
                                        truthValue={showingPreview}
                                        elementTrue={<LTTemplateElementPreviewPartial element={value} index={index} key={index} />}
                                        elementFalse={
                                            <LTTemplateElementPartial
                                                element={value}
                                                content={content}
                                                setContent={setContent}
                                                index={index}
                                                length={content.length}
                                                key={index}
                                            />
                                        }
                                    />
                                );
                            }}
                        />
                    }
                />

                <Separator />

                <div className={"flex flex-col lg:flex-row"}>
                    <Button
                        onClick={() => setAddElementModalOpen(true)}
                        type={"button"}
                        icon={<TbFilePlus size={20} />}
                        size={SIZE_OPTS.SM}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}>
                        Element hinzufügen
                    </Button>

                    <Button
                        type={"button"}
                        disabled={content.length == 0}
                        onClick={() => setShowingPreview(!showingPreview)}
                        className={"mt-4 lg:mt-0 lg:ml-4"}
                        icon={showingPreview ? <TbEdit size={20} /> : <TbEyeCheck size={20} />}
                        size={SIZE_OPTS.SM}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}>
                        {showingPreview ? "Bearbeitungsmodus anzeigen" : "Vorschau anzeigen"}
                    </Button>
                </div>
            </Card>

            <LTTemplateElementModal
                show={addElementModalOpen}
                onClose={() => setAddElementModalOpen(false)}
                logTemplateElements={content}
                setLogTemplateElements={setContent}
            />
        </>
    );
}
