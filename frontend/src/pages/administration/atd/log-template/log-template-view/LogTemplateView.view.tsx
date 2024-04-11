import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "@/utils/hooks/useApi";
import { LogTemplateElement, TrainingLogTemplateModel } from "@/models/TrainingLogTemplateModel";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendarTime, TbEdit, TbEyeCheck, TbFilePlus, TbId, TbRefresh, TbTrash } from "react-icons/tb";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { FormEvent, useEffect, useState } from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { MapArray } from "@/components/conditionals/MapArray";
import { LTTemplateElementPreviewPartial } from "@/pages/administration/atd/log-template/_shared/_partials/LTTemplateElementPreview.partial";
import { LTTemplateElementPartial } from "@/pages/administration/atd/log-template/_shared/_partials/LTTemplateElement.partial";
import { LTTemplateElementModal } from "@/pages/administration/atd/log-template/_shared/_modals/LTTemplateElement.modal";
import FormHelper from "@/utils/helper/FormHelper";
import ToastHelper from "@/utils/helper/ToastHelper";
import { LTViewSkeleton } from "@/pages/administration/atd/log-template/_shared/_skeletons/LTView.skeleton";
import { LTVDeleteModal } from "@/pages/administration/atd/log-template/log-template-view/_modals/LTVDelete.modal";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { AxiosResponse } from "axios";
import { axiosInstance } from "@/utils/network/AxiosInstance";

export function LogTemplateViewView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: trainingLogTemplate,
        setData: setTrainingLogTemplate,
        loading: loadingTrainingLogTemplate,
    } = useApi<TrainingLogTemplateModel>({
        url: `/administration/training-log/template/${id}`,
        method: "get",
    });

    const [content, setContent] = useState<LogTemplateElement[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showingPreview, setShowingPreview] = useState<boolean>(false);

    const [addElementModalOpen, setAddElementModalOpen] = useState<boolean>(false);
    const [deleteTemplateModalOpen, setDeleteTemplateModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!loadingTrainingLogTemplate && trainingLogTemplate != null) {
            const trainingLogTemplateContent = trainingLogTemplate.content as LogTemplateElement[];
            setContent(trainingLogTemplateContent);
        }
    }, [trainingLogTemplate]);

    function updateTemplate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (id == null || trainingLogTemplate == null) {
            return;
        }

        setSubmitting(true);

        let formData = FormHelper.getEntries(e.target);
        FormHelper.set(formData, "content", content);

        axiosInstance
            .patch(`/administration/training-log/template/${id}`, formData)
            .then((res: AxiosResponse) => {
                const data = res.data as TrainingLogTemplateModel;

                ToastHelper.success("Logvorlage erfolgreich aktualisiert");
                setTrainingLogTemplate({ ...data, updatedAt: new Date() });
            })
            .catch(() => {
                ToastHelper.error("Fehler beim aktualisieren der Logvorlage");
            })
            .finally(() => {
                setSubmitting(false);
            });
    }

    return (
        <>
            <PageHeader title={"Logvorlage Verwalten"} />

            <RenderIf
                truthValue={loadingTrainingLogTemplate}
                elementTrue={<LTViewSkeleton />}
                elementFalse={
                    <>
                        <Card header={"Eigenschaften"} headerBorder>
                            <form onSubmit={updateTemplate}>
                                <Input
                                    name={"name"}
                                    type={"text"}
                                    maxLength={70}
                                    description={"Name der Logvorlage"}
                                    labelSmall
                                    placeholder={"Frankfurt Tower Sim Vorlage"}
                                    label={"Name"}
                                    required
                                    value={trainingLogTemplate?.name}
                                    regex={RegExp("^(?!\\s*$).+")}
                                    regexMatchEmpty
                                    regexCheckInitial
                                    preIcon={<TbId size={20} />}
                                />

                                <Input
                                    type={"text"}
                                    className={"mt-5"}
                                    labelSmall
                                    label={"Zuletzt Aktualisiert"}
                                    disabled
                                    value={dayjs.utc(trainingLogTemplate?.updatedAt ?? trainingLogTemplate?.createdAt).format(Config.DATETIME_FORMAT)}
                                    preIcon={<TbCalendarTime size={20} />}
                                />

                                <Separator />

                                <div className={"flex flex-col lg:flex-row"}>
                                    <Button
                                        loading={submitting}
                                        disabled={content.length == 0}
                                        type={"submit"}
                                        icon={<TbRefresh size={20} />}
                                        variant={"twoTone"}
                                        color={COLOR_OPTS.PRIMARY}>
                                        Logvorlage Aktualisieren
                                    </Button>

                                    <Button
                                        disabled={submitting}
                                        onClick={() => setDeleteTemplateModalOpen(true)}
                                        icon={<TbTrash size={20} />}
                                        className={"mt-4 lg:mt-0 lg:ml-4"}
                                        variant={"twoTone"}
                                        color={COLOR_OPTS.DANGER}>
                                        Logvorlage Löschen
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <Card className={"mt-5"} header={"Inhalt der Logvorlage"} headerBorder>
                            <RenderIf
                                truthValue={content.length == 0 || !Array.isArray(content)}
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
                                    disabled={submitting}
                                    icon={<TbFilePlus size={20} />}
                                    size={SIZE_OPTS.SM}
                                    variant={"twoTone"}
                                    color={COLOR_OPTS.PRIMARY}>
                                    Element hinzufügen
                                </Button>

                                <Button
                                    type={"button"}
                                    disabled={content.length == 0 || submitting}
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
                    </>
                }
            />

            <LTTemplateElementModal
                show={addElementModalOpen}
                onClose={() => setAddElementModalOpen(false)}
                logTemplateElements={content}
                setLogTemplateElements={setContent}
            />

            <LTVDeleteModal
                show={deleteTemplateModalOpen}
                onClose={() => setDeleteTemplateModalOpen(false)}
                logTemplate={trainingLogTemplate}
                navigate={navigate}
            />
        </>
    );
}
