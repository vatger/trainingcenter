import { TableColumn } from "react-data-table-component";
import { EndorsementGroupModel } from "@/models/EndorsementGroupModel";
import { Dispatch } from "react";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbEye } from "react-icons/tb";

function getColumns(
    setShowStationModal: Dispatch<boolean>,
    setSelectedEndorsementGroup: Dispatch<EndorsementGroupModel>
): TableColumn<EndorsementGroupModel>[] {
    return [
        {
            name: "Gruppe",
            selector: row => row.name,
        },
        {
            name: "# Stationen",
            selector: row => row.stations?.length ?? 0,
        },
        {
            name: "Stationen",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => {
                            setShowStationModal(true);
                            setSelectedEndorsementGroup(row);
                        }}
                        size={SIZE_OPTS.SM}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbEye size={20} />}>
                        Ansehen
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
