import { NavigateFunction } from "react-router-dom";
import { TableColumn } from "react-data-table-component";
import { UserModel } from "../../../../../../models/UserModel";
import { getAtcRatingShort } from "../../../../../../utils/helper/vatsim/AtcRatingHelper";
import { Button } from "../../../../../../components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "../../../../../../assets/theme.config";
import { TbEye } from "react-icons/tb";

export function getUserSearchTableColumns(navigate: NavigateFunction, userPermissions: string[], user?: UserModel): TableColumn<UserModel>[] {
    return [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
        },
        {
            name: "Name",
            selector: row => row.first_name + " " + row.last_name,
            sortable: true,
        },
        {
            name: "Rating",
            selector: row => getAtcRatingShort(row.user_data?.rating_atc ?? -2),
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`/administration/users/${row.id}`)}
                        disabled={user?.id === row.id && !userPermissions?.includes("mentor.acc.manage.own".toUpperCase())}
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
