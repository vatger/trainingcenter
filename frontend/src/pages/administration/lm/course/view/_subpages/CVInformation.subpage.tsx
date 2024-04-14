import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, ICON_SIZE_OPTS } from "@/assets/theme.config";
import { FiSave } from "react-icons/fi";
import { MapArray } from "@/components/conditionals/MapArray";
import { E_VATSIM_RATING, RATINGS_MAP } from "@/utils/helper/vatsim/AtcRatingHelper";
import { FormEvent, useState } from "react";
import useApi from "@/utils/hooks/useApi";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import FormHelper from "@/utils/helper/FormHelper";
import { ICourseInformation, ICourseInformationData } from "@models/CourseInformation";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import ToastHelper from "@/utils/helper/ToastHelper";
import { RenderIf } from "@/components/conditionals/RenderIf";

export default function CVInformationSubpage({ course_uuid }: { course_uuid?: string }) {
    const { data: endorsementGroups, loading: loadingEndorsementGroups } = useApi<EndorsementGroupModel[]>({
        url: "/administration/endorsement-group",
        method: "GET",
    });

    const {
        data: information,
        setData: setInformation,
        loading: loadingInformation,
    } = useApi<ICourseInformation>({
        url: `/administration/course/information/${course_uuid}`,
        method: "GET",
    });

    const [submitting, setSubmitting] = useState<boolean>(false);

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);

        const formData = FormHelper.getEntries(e.target);

        axiosInstance
            .post(`/administration/course/information/${course_uuid}`, formData)
            .then((res: AxiosResponse) => {
                const data = res.data as ICourseInformation;
                setInformation(data);
                ToastHelper.success("Kursinformationen erfolgreich aktualisiert");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Aktualisieren der Kursinformationen");
            })
            .then(() => {
                setSubmitting(false);
            });
    }

    return (
        <RenderIf
            truthValue={loadingEndorsementGroups || loadingInformation}
            elementTrue={<></>}
            elementFalse={
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label={"Ungefähre Dauer - Wert"}
                            labelSmall
                            className={"flex flex-col"}
                            inputClassName={"mt-auto"}
                            placeholder={"10"}
                            name={"duration_value"}
                            type={"number"}
                            description={"Gebe hier die ungefähre Dauer des Kurses an. Dies wird den Teilnehmern bei der Einschreibung angezeigt. (Optional)"}
                            value={information?.data?.duration?.toString() ?? ""}
                        />

                        <Select
                            label={"Ungefähre Dauer - Einheit"}
                            className={"flex flex-col"}
                            selectClassName={"mt-auto"}
                            name={"duration_unit"}
                            labelSmall
                            description={"Die Einheit wird zusammen mit der Dauer verwendet um Teilnehmern eine Sprachunabhängige Dauer anzuzeigen."}
                            defaultValue={information?.data?.duration_unit ?? "day"}>
                            <option value="day">Tag(e)</option>
                            <option value="week">Woche(n)</option>
                            <option value="month">Monat(e)</option>
                            <option value="year">Jahr(e)</option>
                        </Select>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Select
                            label={"Rating nach Abschluss"}
                            className={"flex flex-col"}
                            selectClassName={"mt-auto"}
                            name={"rating"}
                            labelSmall
                            description={"Falls zutreffend, kann hier ein Rating ausgewählt werden, welcher der Benutzer nach Abschluss des Kurses erhält."}
                            defaultValue={information?.data?.rating?.toString() ?? ""}>
                            <option value="">N/A</option>
                            <option value={E_VATSIM_RATING.S1}>
                                {RATINGS_MAP.get(E_VATSIM_RATING.S1)?.long} ({RATINGS_MAP.get(E_VATSIM_RATING.S1)?.short})
                            </option>
                            <option value={E_VATSIM_RATING.S2}>
                                {RATINGS_MAP.get(E_VATSIM_RATING.S2)?.long} ({RATINGS_MAP.get(E_VATSIM_RATING.S2)?.short})
                            </option>
                            <option value={E_VATSIM_RATING.S3}>
                                {RATINGS_MAP.get(E_VATSIM_RATING.S3)?.long} ({RATINGS_MAP.get(E_VATSIM_RATING.S3)?.short})
                            </option>
                            <option value={E_VATSIM_RATING.C1}>
                                {RATINGS_MAP.get(E_VATSIM_RATING.C1)?.long} ({RATINGS_MAP.get(E_VATSIM_RATING.C1)?.short})
                            </option>
                        </Select>

                        <Select
                            label={"Endorsement nach Abschluss"}
                            className={"flex flex-col"}
                            selectClassName={"mt-auto"}
                            name={"endorsement_id"}
                            labelSmall
                            description={
                                "Falls zutreffend, kann hier ein Endorsement ausgewählt werden, welches der Benutzer nach Abschluss des Kurses erhält."
                            }
                            defaultValue={information?.data?.endorsement_id?.toString() ?? ""}>
                            <option value="">N/A</option>
                            <MapArray
                                data={endorsementGroups ?? []}
                                mapFunction={(value: EndorsementGroupModel, index) => {
                                    return (
                                        <option key={index} value={value.id.toString()}>
                                            {value.name}
                                        </option>
                                    );
                                }}
                            />
                        </Select>
                    </div>

                    <Separator />

                    <Button loading={submitting} type={"submit"} variant={"twoTone"} color={COLOR_OPTS.PRIMARY} icon={<FiSave size={ICON_SIZE_OPTS.MD} />}>
                        Speichern
                    </Button>
                </form>
            }
        />
    );
}
