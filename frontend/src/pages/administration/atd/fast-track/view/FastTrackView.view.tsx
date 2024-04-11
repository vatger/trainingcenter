import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import useApi from "@/utils/hooks/useApi";
import { FastTrackRequestModel } from "@/models/FastTrackRequestModel";
import { useParams } from "react-router-dom";
import React, { FormEvent, useEffect, useState } from "react";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosResponse } from "axios";
import { Buffer } from "buffer";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Input } from "@/components/ui/Input/Input";
import { TbCalendar, TbDownload, TbId, TbRefresh } from "react-icons/tb";
import { getAtcRatingLong, getAtcRatingShort } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Select } from "@/components/ui/Select/Select";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import { Separator } from "@/components/ui/Separator/Separator";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, ICON_SIZE_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import FormHelper from "@/utils/helper/FormHelper";
import ToastHelper from "@/utils/helper/ToastHelper";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { FastTrackViewSkeleton } from "@/pages/administration/atd/fast-track/view/_skeletons/FastTrackView.skeleton";
import DownloadHelper from "@/utils/helper/DownloadHelper";

const magicNumbers = {
    jpg: "ffd8ffe0",
    png: "89504e47",
    gif: "47494638",
};

export function FastTrackViewView() {
    const { id } = useParams();

    const {
        data: fastTrackRequest,
        loading: loadingFastTrackRequest,
        setData: setFastTrackRequest,
    } = useApi<FastTrackRequestModel>({
        url: `/administration/fast-track/${id}`,
        method: "get",
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [downloadingAttachment, setDownloadingAttachment] = useState<boolean>(false);

    function updateFastTrack(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (id == null) {
            return;
        }
        setSubmitting(true);

        const data = FormHelper.getEntries(e.target);
        axiosInstance
            .patch(`/administration/fast-track/${id}`, data)
            .then((res: AxiosResponse) => {
                const data = res.data as FastTrackRequestModel;
                setFastTrackRequest(data);
                ToastHelper.success("Fast-Track Request erfolgreich aktualisiert");
            })
            .catch(() => {
                ToastHelper.error("Fehler beim Aktualisieren des Fast-Track Requests");
            })
            .finally(() => setSubmitting(false));
    }

    function downloadAttachment() {
        if (fastTrackRequest == null) return;
        setDownloadingAttachment(true);

        DownloadHelper.downloadFile(`/administration/fast-track/attachment/${id}`, fastTrackRequest.file_name, "arraybuffer").finally(() =>
            setDownloadingAttachment(false)
        );
    }

    return (
        <>
            <PageHeader title={"Fast-Track Ansehen"} />

            <RenderIf
                truthValue={loadingFastTrackRequest}
                elementTrue={<FastTrackViewSkeleton />}
                elementFalse={
                    <Card header={"Anfrage"} headerBorder>
                        <form onSubmit={updateFastTrack}>
                            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
                                <Input
                                    label={"Benutzer"}
                                    labelSmall
                                    preIcon={<TbId size={20} />}
                                    disabled
                                    readOnly
                                    value={`${fastTrackRequest?.user?.first_name} ${fastTrackRequest?.user?.last_name} (${fastTrackRequest?.user_id})`}
                                />

                                <Input
                                    label={"Angefragt von"}
                                    labelSmall
                                    preIcon={<TbId size={20} />}
                                    disabled
                                    readOnly
                                    value={`${fastTrackRequest?.requested_by_user?.first_name} ${fastTrackRequest?.requested_by_user?.last_name} (${fastTrackRequest?.requested_by_user_id})`}
                                />

                                <Input
                                    label={"Rating"}
                                    labelSmall
                                    preIcon={<TbId size={20} />}
                                    disabled
                                    readOnly
                                    value={`${getAtcRatingLong(fastTrackRequest?.rating ?? -5)} (${getAtcRatingShort(fastTrackRequest?.rating ?? -5)})`}
                                />

                                <Input
                                    label={"Angefragt Am"}
                                    labelSmall
                                    preIcon={<TbCalendar size={20} />}
                                    disabled
                                    readOnly
                                    value={dayjs.utc(fastTrackRequest?.createdAt).format(Config.DATETIME_FORMAT)}
                                />

                                <Input
                                    label={"Zuletzt Aktualisiert"}
                                    labelSmall
                                    preIcon={<TbCalendar size={20} />}
                                    disabled
                                    readOnly
                                    value={dayjs.utc(fastTrackRequest?.updatedAt).format(Config.DATETIME_FORMAT)}
                                />
                            </div>

                            <TextArea
                                className={"mt-5"}
                                label={"Kommentar"}
                                disabled
                                description={"Kommentar des Erstellers des Requests"}
                                labelSmall
                                value={fastTrackRequest?.comment ?? "N/A"}
                            />

                            <Button
                                onClick={() => downloadAttachment()}
                                icon={<TbDownload size={ICON_SIZE_OPTS.SM} />}
                                className={"mt-5"}
                                size={SIZE_OPTS.SM}
                                loading={downloadingAttachment}
                                variant={"twoTone"}
                                color={COLOR_OPTS.PRIMARY}>
                                Anhang Herunterladen
                            </Button>

                            <Separator />

                            <Select label={"Status"} labelSmall name={"status"} defaultValue={fastTrackRequest?.status}>
                                {/*
                                        STATUS:
                                        0 -> Requested, not uploaded to ATSIM
                                        1 -> Uploaded, Test requested
                                        2 -> Test failed, request retry
                                        3 -> Intro done, request rating
                                        4 -> Request denied
                                        5 -> Completed with success
                                    */}
                                <option value="0">Reqested, Not uploaded to ATSIM</option>
                                <option value="1">Uploaded, Test requested</option>
                                <option value="2">Test failed, request retry</option>
                                <option value="3">Intro done, request rating</option>
                                <option value="4">Request denied</option>
                                <option value="5">Completed</option>
                            </Select>

                            <TextArea className={"mt-5"} label={"Kommentar"} name={"comment"} labelSmall value={fastTrackRequest?.response} />

                            <Separator />

                            <Button icon={<TbRefresh size={20} />} type={"submit"} loading={submitting} variant={"twoTone"} color={COLOR_OPTS.PRIMARY}>
                                Aktualisieren
                            </Button>
                        </form>
                    </Card>
                }
            />
        </>
    );
}
