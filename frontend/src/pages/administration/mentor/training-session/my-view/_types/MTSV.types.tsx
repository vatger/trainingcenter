import { TableColumn } from "react-data-table-component";
import { UserModel } from "@/models/UserModel";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbList } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge/Badge";

function getColumns(): TableColumn<UserModel>[] {
    const navigate = useNavigate();

    return [
        {
            name: "CID",
            selector: row => row.id,
            sortable: true,
        },
        {
            name: "Name",
            selector: row => row.first_name + " " + row.last_name,
            sortable: true,
        },
        {
            name: "Bestanden",
            cell: row => {
                if (row.training_logs == null || row.training_logs.length == 0) {
                    return <Badge color={COLOR_OPTS.DEFAULT}>N/A</Badge>;
                }

                if (row.training_logs[0].TrainingSessionBelongsToUsers?.passed) {
                    return <Badge color={COLOR_OPTS.SUCCESS}>Ja</Badge>;
                }

                return <Badge color={COLOR_OPTS.DANGER}>Nein</Badge>;
            },
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <Button
                        className={"my-3"}
                        onClick={() => navigate(`/training/log/${row.training_logs?.[0].uuid}`)}
                        size={SIZE_OPTS.SM}
                        variant={"twoTone"}
                        color={COLOR_OPTS.PRIMARY}
                        icon={<TbList size={20} />}>
                        Log Ansehen
                    </Button>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
