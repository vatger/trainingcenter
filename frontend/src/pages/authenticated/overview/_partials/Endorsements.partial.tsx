import { Card } from "@/components/ui/Card/Card";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { Table } from "@/components/ui/Table/Table";
import EGSTypes from "@/pages/authenticated/overview/_types/EGS.types";
import { Modal } from "@/components/ui/Modal/Modal";
import { useState } from "react";
import { TableColumn } from "react-data-table-component";
import { TrainingStationModel } from "@/models/TrainingStationModel";
import SortHelper from "@/utils/helper/SortHelper";

interface EndorsementsT {
    endorsementGroups?: EndorsementGroupModel[];
    loading: boolean;
}

const tableColumns: TableColumn<TrainingStationModel>[] = [
    {
        name: "Callsign",
        selector: row => row.callsign,
        sortable: true,
        sortFunction: (a, b) => SortHelper.sortAtcStation(a.callsign, b.callsign),
    },
    {
        name: "Frequenz",
        selector: row => row.frequency.toFixed(3),
        sortable: true,
    },
];

export function EndorsementsPartial(props: EndorsementsT) {
    const [showStationModal, setShowStationModal] = useState<boolean>(false);
    const [selectedEndorsementGroup, setSelectedEndorsementGroup] = useState<EndorsementGroupModel | undefined>(undefined);

    return (
        <>
            <Card header={"Freigaben"} headerBorder className={"mt-5"}>
                <Table
                    columns={EGSTypes.getColumns(setShowStationModal, setSelectedEndorsementGroup)}
                    data={props.endorsementGroups ?? []}
                    loading={props.loading}
                />
            </Card>

            <Modal
                show={showStationModal}
                title={`Stationen | ${selectedEndorsementGroup?.name}`}
                onClose={() => {
                    setShowStationModal(false);
                    setSelectedEndorsementGroup(undefined);
                }}>
                <Table columns={tableColumns} data={selectedEndorsementGroup?.stations ?? []} defaultSortField={1} />
            </Modal>
        </>
    );
}
