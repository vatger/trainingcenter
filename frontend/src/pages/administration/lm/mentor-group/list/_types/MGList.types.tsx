import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { Badge } from "../../../../../../components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "../../../../../../assets/theme.config";
import { Button } from "../../../../../../components/ui/Button/Button";
import { TbEye } from "react-icons/tb";
import { MentorGroupModel } from "../../../../../../models/MentorGroupModel";

function getColumns(navigate: NavigateFunction): (TableColumn<MentorGroupModel> & { searchable?: boolean })[] {
    return [
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
            searchable: true,
        },
        {
            name: "FIR",
            cell: row => (row.fir == null ? <Badge>{"N/A"}</Badge> : <Badge color={COLOR_OPTS.PRIMARY}>{row.fir.toUpperCase()}</Badge>),
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`${row.id}`)}
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
