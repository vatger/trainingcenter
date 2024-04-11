import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { Badge } from "../../../../../../components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "../../../../../../assets/theme.config";
import { Button } from "../../../../../../components/ui/Button/Button";
import { TbEye } from "react-icons/tb";
import { TrainingTypeModel } from "../../../../../../models/TrainingTypeModel";
import StringHelper from "../../../../../../utils/helper/StringHelper";

function getColumns(navigate: NavigateFunction): (TableColumn<TrainingTypeModel> & { searchable?: boolean })[] {
    return [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
        },
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
            searchable: true,
        },
        {
            name: "Typ",
            cell: row => {
                if (row.type == "cpt") return <Badge color={COLOR_OPTS.DANGER}>{row.type.toUpperCase()}</Badge>;

                return <Badge color={COLOR_OPTS.PRIMARY}>{StringHelper.capitalize(row.type)}</Badge>;
            },
            sortable: true,
            sortFunction: (a, b) => {
                return a.type.localeCompare(b.type);
            },
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
