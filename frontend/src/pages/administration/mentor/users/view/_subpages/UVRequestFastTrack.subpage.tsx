import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { FileUpload } from "@/components/ui/Upload/FileUpload";
import { FormEvent } from "react";
import { TbActivity, TbId, TbListCheck } from "react-icons/tb";
import { Input } from "@/components/ui/Input/Input";
import { Separator } from "@/components/ui/Separator/Separator";
import { useParams } from "react-router-dom";
import { Select } from "@/components/ui/Select/Select";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, TYPE_OPTS } from "@/assets/theme.config";
import { AxiosResponse } from "axios";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import { FastTrackRequestModel } from "@/models/FastTrackRequestModel";
import FastTrackListTypes from "../_types/UVFastTrackList.types";
import { Table } from "@/components/ui/Table/Table";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Alert } from "@/components/ui/Alert/Alert";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import useApi from "@/utils/hooks/useApi";
import ToastHelper from "@/utils/helper/ToastHelper";
import { E_VATSIM_RATING } from "@/utils/helper/vatsim/AtcRatingHelper";
import { useUploadHook } from "@/utils/hooks/useUploadHook";
import { Button } from "@/components/ui/Button/Button";
import FormHelper from "@/utils/helper/FormHelper";

export function RequestFastTrackView() {
    const { user_id } = useParams();

    const { uploadProgress, onUploadProgress, files, setFiles, resetUpload, isUploading } = useUploadHook();

    const {
        data: fastTracks,
        setData: setFastTracks,
        loading: loadingFTRequests,
    } = useApi<FastTrackRequestModel[]>({
        url: "/administration/fast-track/user",
        params: {
            user_id: user_id,
        },
        method: "get",
    });

    function createFastTrackRequest(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = FormHelper.getEntries(e.target);
        FormHelper.addFiles(formData, files);
        FormHelper.append(formData, "user_id", user_id);

        axiosInstance
            .post("/administration/fast-track", formData, {
                onUploadProgress: onUploadProgress,
                timeout: 50_000,
            })
            .then((res: AxiosResponse) => {
                const fastTrack = res.data as FastTrackRequestModel;
                setFastTracks([...(fastTracks ?? []), fastTrack]);
                ToastHelper.success("Fast-Track Request erfolgreich erstellt.");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Erstellen des Fast-Track Requests");
                resetUpload();
            });
    }

    return (
        <>
            <PageHeader title={"Fast-Track Beantragen"} />

            <Card
                header={"Fast-Track Requests"}
                className={"mb-7"}
                headerBorder
                headerExtra={<Badge color={COLOR_OPTS.PRIMARY}>{fastTracks?.length ?? "Laden..."}</Badge>}>
                <Table columns={FastTrackListTypes.getColumns()} data={fastTracks ?? []} loading={loadingFTRequests} paginationPerPage={5} />
            </Card>

            <Card header={"Fast-Track Request Erstellen"} headerBorder>
                <RenderIf
                    truthValue={fastTracks?.find(ft => ft.status != 4 && ft.status != 5) != null}
                    elementTrue={
                        <Alert type={TYPE_OPTS.DANGER} showIcon rounded>
                            Es gibt bereits einen aktiven Fast-Track Request. Warte bitte, bis dieser abgeschlossen ist, um einen neuen Request erstellen zu
                            können.
                        </Alert>
                    }
                    elementFalse={
                        <form onSubmit={createFastTrackRequest}>
                            <div className={"grid grid-cols-1 md:grid-cols-2 md:gap-5"}>
                                <Input type={"text"} labelSmall label={"Mitglied"} name={"user_id"} value={user_id} disabled preIcon={<TbId size={20} />} />
                                <Select
                                    label={"Rating"}
                                    className={"flex flex-col mt-5 md:mt-0"}
                                    labelSmall
                                    required
                                    name={"rating"}
                                    preIcon={<TbActivity size={20} />}>
                                    <option value={E_VATSIM_RATING.S2}>{"S2"}</option>
                                    <option value={E_VATSIM_RATING.S3}>{"S3"}</option>
                                </Select>
                            </div>

                            <div>
                                <div className={"mt-5"}>
                                    <TextArea
                                        label={"Kommentar"}
                                        description={"Weitere Informationen die für das ATD wichtig sein könnten (optional)"}
                                        labelSmall
                                        name={"description"}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <h6 className={"text-sm"}>Dateiupload</h6>
                            <FileUpload
                                accept={["jpg", "png"]}
                                isUploading={isUploading}
                                progress={uploadProgress}
                                success={uploadProgress == 100}
                                fileLimit={loadingFTRequests ? 0 : 1}
                                onFileChange={setFiles}
                                customButtonText={"Fast-Track Request Erstellen"}
                                customButtonIcon={<TbListCheck size={20} />}
                            />

                            <Button disabled={isUploading || files.length == 0} variant={"twoTone"} color={COLOR_OPTS.PRIMARY} type={"submit"}>
                                Erstellen
                            </Button>
                        </form>
                    }
                />
            </Card>
        </>
    );
}
