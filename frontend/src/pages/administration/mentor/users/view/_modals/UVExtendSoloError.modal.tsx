import { Modal } from "@/components/ui/Modal/Modal";
import { UserModel, UserSoloModel } from "@/models/UserModel";
import { Input } from "@/components/ui/Input/Input";
import { getAtcRatingCombined } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Separator } from "@/components/ui/Separator/Separator";
import { Select } from "@/components/ui/Select/Select";
import dayjs from "dayjs";
import React, { Dispatch, FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { TbCheck, TbPlaylistAdd, TbTrash, TbX } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { AxiosResponse } from "axios";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import useApi from "@/utils/hooks/useApi";
import { MapArray } from "@/components/conditionals/MapArray";
import { TimeLineItem } from "@/components/ui/Timeline/TimeLine";
import StringHelper from "@/utils/helper/StringHelper";
import { Config } from "@/core/Config";
import { SoloExtensionError } from "@/pages/administration/mentor/users/view/_partials/UVSolo.partial";

export function UVExtendSoloErrorModal({
    show,
    onClose,
    soloExtensionError,
    user,
    setUser,
}: {
    show: boolean;
    onClose: () => any;
    soloExtensionError?: SoloExtensionError;
    user?: UserModel;
    setUser: Dispatch<UserModel>;
}) {
    return (
        <Modal show={show} onClose={onClose} title={"Solo Verlängern"}>
            <TimeLineItem
                color={soloExtensionError?.training_last_20_days ? "bg-emerald-500" : "bg-red-500"}
                avatarIcon={soloExtensionError?.training_last_20_days ? <TbCheck className={"m-[5px]"} size={19} /> : <TbX className={"m-[5px]"} size={19} />}
                showConnectionLine={false}>
                <div className={"flex justify-between w-full"}>
                    <p className="my-1 flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Innerhalb der letzten 20 Tage muss ein bestandenes Training stattgefunden haben
                        </span>
                    </p>
                </div>
            </TimeLineItem>

            <TimeLineItem
                color={soloExtensionError?.cpt_planned ? "bg-emerald-500" : "bg-red-500"}
                avatarIcon={soloExtensionError?.cpt_planned ? <TbCheck className={"m-[5px]"} size={19} /> : <TbX className={"m-[5px]"} size={19} />}
                showConnectionLine={false}>
                <div className={"flex justify-between w-full"}>
                    <p className="my-1 flex items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">CPT muss geplant sein!</span>
                    </p>
                </div>
            </TimeLineItem>
        </Modal>
    );
}
