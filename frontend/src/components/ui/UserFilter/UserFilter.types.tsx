import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, ICON_SIZE_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbArrowRight } from "react-icons/tb";
import { IMinimalUser } from "@models/User";

function getColumns(onUserSelect: (u: IMinimalUser) => any): TableColumn<IMinimalUser>[] {
    return [
        {
            name: "CID",
            selector: row => row.id.toString(),
        },
        {
            name: "Name",
            selector: row => `${row.first_name} ${row.last_name}`,
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        size={SIZE_OPTS.SM}
                        icon={<TbArrowRight size={ICON_SIZE_OPTS.SM} />}
                        onClick={() => onUserSelect(row)}>
                        Auswählen
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
