import { Modal } from "@/components/ui/Modal/Modal";
import { Select } from "@/components/ui/Select/Select";
import { Accordion } from "@/components/ui/Accordion/Accordion";
import { Table } from "@/components/ui/Table/Table";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { MapArray } from "@/components/conditionals/MapArray";
import React, { Dispatch, FormEvent, useState } from "react";
import { TableColumn } from "react-data-table-component";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import { UserModel } from "@/models/UserModel";
import { Separator } from "@/components/ui/Separator/Separator";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import FormHelper from "@/utils/helper/FormHelper";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import ToastHelper from "@/utils/helper/ToastHelper";
import { AxiosResponse } from "axios";
import SortHelper from "@/utils/helper/SortHelper";

const StationTableColumns: TableColumn<TrainingStationModel>[] = [
    {
        name: "Station",
        selector: row => row.callsign.toUpperCase(),
        sortable: true,
        sortFunction: (a, b) => SortHelper.sortAtcStation(a.callsign, b.callsign),
    },
    {
        name: "Frequenz",
        selector: row => row.frequency.toFixed(3),
        sortable: true,
    },
];

export function UVAddEndorsementModal({
    user,
    setUser,
    endorsementGroups,
    userEndorsementGroups,
    show,
    onClose,
}: {
    user?: UserModel;
    setUser: Dispatch<UserModel>;
    endorsementGroups: EndorsementGroupModel[];
    userEndorsementGroups?: EndorsementGroupModel[];
    show: boolean;
    onClose: () => any;
}) {
    const [selectedEndorsementGroup, setSelectedEndorsementGroup] = useState<EndorsementGroupModel | undefined>(undefined);
    const [submitting, setSubmitting] = useState<boolean>(false);

    function addEndorsement(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (selectedEndorsementGroup == null || user == null) return;
        setSubmitting(true);

        const formData = FormHelper.getEntries(e.target);
        FormHelper.set(formData, "user_id", user?.id);

        axiosInstance
            .post("/administration/endorsement", formData)
            .then((res: AxiosResponse) => {
                ToastHelper.success("Freigabe erfolgreich erstellt");
                const endorsements = res.data as EndorsementGroupModel[];
                setUser({ ...user, endorsement_groups: endorsements });

                onClose();
            })
            .catch(() => {
                ToastHelper.error("Fehler beim erstellen der Freigabe");
            })
            .finally(() => setSubmitting(false));
    }

    return (
        <form onSubmit={addEndorsement}>
            <Modal
                show={show}
                onClose={() => {
                    setSelectedEndorsementGroup(undefined);
                    onClose();
                }}
                title={"Freigabegruppe Hinzufügen"}
                footer={
                    <Button
                        icon={<TbPlus size={20} />}
                        disabled={selectedEndorsementGroup == null}
                        loading={submitting}
                        variant={"twoTone"}
                        type={"submit"}
                        color={COLOR_OPTS.PRIMARY}>
                        Hinzufügen
                    </Button>
                }>
                <Select
                    label={"Freigabegruppe Wählen"}
                    name={"endorsement_group_id"}
                    labelSmall
                    onChange={v => {
                        const endorsementGroupID = Number(v);
                        if (isNaN(endorsementGroupID) || endorsementGroupID == -1) return;

                        setSelectedEndorsementGroup(endorsementGroups.find(e => e.id == endorsementGroupID));
                    }}
                    defaultValue={"-1"}>
                    <option value="-1" disabled>
                        Freigabegruppe Auswählen
                    </option>
                    <MapArray
                        data={endorsementGroups.filter(eg => {
                            return userEndorsementGroups?.find(ueg => ueg.id == eg.id) == null;
                        })}
                        mapFunction={(endorsementGroup: EndorsementGroupModel, index: number) => {
                            return (
                                <option disabled={endorsementGroup.stations?.length == 0} key={index} value={endorsementGroup.id}>
                                    {endorsementGroup.name} {endorsementGroup.stations?.length == 0 ? " - Keine Stationen" : ""}
                                </option>
                            );
                        }}
                    />
                </Select>

                <Accordion
                    disabled={selectedEndorsementGroup == null || selectedEndorsementGroup?.stations?.length == 0}
                    className={"mt-3"}
                    title={`Stationen (${selectedEndorsementGroup?.stations?.length ?? 0})`}>
                    <div className={"p-3"}>
                        <Table persistTableHead={false} columns={StationTableColumns} defaultSortField={1} data={selectedEndorsementGroup?.stations ?? []} />
                    </div>
                </Accordion>
            </Modal>
        </form>
    );
}
