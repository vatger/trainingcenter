import { UserModel } from "@/models/UserModel";
import { Card } from "@/components/ui/Card/Card";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbAdjustmentsCog, TbAlertTriangle, TbPlaylistAdd } from "react-icons/tb";
import { Button } from "@/components/ui/Button/Button";
import React, { Dispatch, useState } from "react";
import { Badge } from "@/components/ui/Badge/Badge";
import { UVAddSoloModal } from "@/pages/administration/mentor/users/view/_modals/UVAddSolo.modal";
import { Input } from "@/components/ui/Input/Input";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { UVUseKontingentSoloModal } from "@/pages/administration/mentor/users/view/_modals/UVUseKontingentSolo.modal";
import { UVExtendSoloErrorModal } from "@/pages/administration/mentor/users/view/_modals/UVExtendSoloError.modal";
import { Separator } from "@/components/ui/Separator/Separator";
import ToastHelper from "@/utils/helper/ToastHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosError } from "axios";
import useApi from "@/utils/hooks/useApi";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { UVDeleteSoloModal } from "@/pages/administration/mentor/users/view/_modals/UVDeleteSolo.modal";
import { useAuthSelector } from "@/app/features/authSlice";

export type SoloExtensionError = {
    cpt_planned: boolean;
    training_last_20_days: boolean;
};

export function UVSoloPartial({ user, setUser }: { user?: UserModel; setUser: Dispatch<UserModel> }) {
    const userPermissions = useAuthSelector().userPermissions;

    const { loading: loadingEndorsementGroups, data: mentorableEndorsementGroups } = useApi<EndorsementGroupModel[]>({
        url: "/administration/endorsement-group/mentorable",
        method: "get",
    });

    const [showDeleteSoloModal, setShowDeleteSoloModal] = useState<boolean>(false);

    const [showAddSoloModal, setShowAddSoloModal] = useState<boolean>(false);
    const [showUseKontingentSoloModal, setShowUseKontingentSoloModal] = useState<boolean>(false);

    const [soloExtensionError, setSoloExtensionError] = useState<SoloExtensionError | undefined>(undefined);
    const [showExtendSoloErrorModal, setShowExtendSoloErrorModal] = useState<boolean>(false);
    const [submittingExtension, setSubmittingExtension] = useState<boolean>(false);

    const daysTillSoloEnd = Math.min(
        dayjs.utc(user?.user_solo?.current_solo_end).startOf("day").diff(dayjs.utc(user?.user_solo?.current_solo_start).startOf("day"), "days"),
        Math.max(0, dayjs.utc(user?.user_solo?.current_solo_end).startOf("day").diff(dayjs.utc().startOf("day"), "day"))
    );

    const kontingent = 30 * ((user?.user_solo?.extension_count ?? 0) + 1) - (user?.user_solo?.solo_used ?? 0);

    function extendSolo() {
        if (user == null) {
            return;
        }

        // Send extension request to backend, if all good, then add 30 days to kontingent
        // If something failed, then show visual feedback as Modal
        setSoloExtensionError(undefined);
        setSubmittingExtension(true);

        axiosInstance
            .post("/administration/solo/extend", { trainee_id: user?.id })
            .then(() => {
                // Add 1 to the solo extension count :)
                const u = { ...user! };
                if (u.user_solo != null) {
                    u.user_solo.extension_count += 1;
                    setUser(u);
                }
                ToastHelper.success("Solo erfolgreich verlängert. Kontingent um 30 Tage erhöht.");
            })
            .catch((err: AxiosError) => {
                const error = err.response?.data as SoloExtensionError;
                ToastHelper.error("Fehler beim Verlängern der Solo");
                setSoloExtensionError(error);
                setShowExtendSoloErrorModal(true);
            })
            .then(() => setSubmittingExtension(false));
    }

    return (
        <>
            <Card
                header={"Solo"}
                headerBorder
                className={"mt-7"}
                headerExtra={
                    user?.user_solo == null ? (
                        <Badge color={COLOR_OPTS.WARNING}>Keine Solo hinterlegt</Badge>
                    ) : daysTillSoloEnd == 0 ? (
                        <div className={"flex"}>
                            <TbAlertTriangle className={"text-danger"} size={20} />
                            <Badge className={"ml-3"} color={COLOR_OPTS.DANGER}>
                                Abgelaufen, alle Freigaben entfernt
                            </Badge>
                        </div>
                    ) : undefined
                }>
                <RenderIf
                    truthValue={user?.user_solo == null}
                    elementTrue={
                        <Button
                            icon={<TbPlaylistAdd size={20} />}
                            size={SIZE_OPTS.SM}
                            onClick={() => {
                                setShowAddSoloModal(true);
                            }}
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}>
                            Solo Hinzufügen
                        </Button>
                    }
                    elementFalse={
                        <>
                            <div className={"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"}>
                                <Input
                                    label={"Start"}
                                    description={"Start der aktuellen Solophase"}
                                    labelSmall
                                    disabled
                                    value={dayjs.utc(user?.user_solo?.current_solo_start).format(Config.DATE_FORMAT)}
                                />
                                <Input
                                    label={"Ende"}
                                    description={"Ende der aktuellen Solophase"}
                                    labelSmall
                                    disabled
                                    inputError={dayjs.utc(user?.user_solo?.current_solo_end).isBefore(dayjs.utc())}
                                    hideInputErrorText
                                    value={dayjs.utc(user?.user_solo?.current_solo_end).format(Config.DATE_FORMAT)}
                                />
                                <Input
                                    label={"Verbleibend"}
                                    description={"Verbleibende Tage der aktuellen Solophase"}
                                    labelSmall
                                    hideInputErrorText
                                    inputError={daysTillSoloEnd < 7 && daysTillSoloEnd != 0}
                                    disabled
                                    value={`${daysTillSoloEnd} Tag(e)`}
                                />
                                <Input
                                    label={"Kontingent"}
                                    description={"Noch nicht verwendete Tage der Solophase"}
                                    labelSmall
                                    disabled
                                    value={`${kontingent} Tage`}
                                />
                                <Input
                                    label={"Verlängerungen"}
                                    description={"Anzahl der Verlängerungen"}
                                    labelSmall
                                    hideInputErrorText
                                    inputError={(user?.user_solo?.extension_count ?? 0) > 1}
                                    disabled
                                    value={user?.user_solo?.extension_count.toString()}
                                />
                                <Input
                                    label={"Vergeben durch"}
                                    description={"Mentor, der diese Solo vergeben hat"}
                                    labelSmall
                                    disabled
                                    value={`${user?.user_solo?.solo_creator?.first_name} ${user?.user_solo?.solo_creator?.last_name} (${user?.user_solo?.solo_creator?.id})`}
                                />
                            </div>

                            <Separator />

                            <div className={"flex flex-col lg:flex-row"}>
                                <RenderIf
                                    truthValue={kontingent > 0}
                                    elementTrue={
                                        <Button
                                            icon={<TbAdjustmentsCog size={20} />}
                                            size={SIZE_OPTS.SM}
                                            onClick={() => {
                                                setShowUseKontingentSoloModal(true);
                                            }}
                                            variant={"twoTone"}
                                            color={COLOR_OPTS.PRIMARY}>
                                            Kontingent Nutzen
                                        </Button>
                                    }
                                    elementFalse={
                                        <Button
                                            icon={<TbPlaylistAdd size={20} />}
                                            size={SIZE_OPTS.SM}
                                            onClick={extendSolo}
                                            loading={submittingExtension}
                                            variant={"twoTone"}
                                            color={COLOR_OPTS.PRIMARY}>
                                            Solo Verlängern
                                        </Button>
                                    }
                                />

                                <RenderIf
                                    truthValue={userPermissions.includes("ATD.SOLO.DELETE")}
                                    elementTrue={
                                        <Button
                                            icon={<TbAlertTriangle size={20} />}
                                            className={"mt-3 lg:mt-0 lg:ml-3"}
                                            size={SIZE_OPTS.SM}
                                            onClick={() => setShowDeleteSoloModal(true)}
                                            variant={"twoTone"}
                                            color={COLOR_OPTS.DANGER}>
                                            Solo Löschen
                                        </Button>
                                    }
                                />
                            </div>
                        </>
                    }
                />
            </Card>

            <UVAddSoloModal
                show={showAddSoloModal}
                endorsementGroups={mentorableEndorsementGroups}
                onClose={() => {
                    setShowAddSoloModal(false);
                }}
                user={user}
                setUser={setUser}
            />
            <UVDeleteSoloModal show={showDeleteSoloModal} onClose={() => setShowDeleteSoloModal(false)} user={user} setUser={setUser} />
            <UVUseKontingentSoloModal
                show={showUseKontingentSoloModal}
                endorsementGroups={mentorableEndorsementGroups}
                onClose={() => {
                    setShowUseKontingentSoloModal(false);
                }}
                user={user}
                setUser={setUser}
            />
            <UVExtendSoloErrorModal
                show={showExtendSoloErrorModal}
                onClose={() => {
                    setShowExtendSoloErrorModal(false);
                }}
                soloExtensionError={soloExtensionError}
                user={user}
                setUser={setUser}
            />
        </>
    );
}
