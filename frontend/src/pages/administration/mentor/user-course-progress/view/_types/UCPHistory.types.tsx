import { TableColumn } from "react-data-table-component";
import { UserTrainingSessionModel } from "@/models/TrainingSessionModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Button } from "@/components/ui/Button/Button";
import { TbEye } from "react-icons/tb";
import { TrainingLogModel } from "@/models/TrainingSessionBelongsToUser.model";
import { useNavigate } from "react-router-dom";
import { RenderIf } from "@/components/conditionals/RenderIf";

export function getColumns(training_logs: TrainingLogModel[]): TableColumn<UserTrainingSessionModel>[] {
    const navigate = useNavigate();

    return [
        {
            name: "Name",
            selector: row => row.training_type?.name ?? "N/A",
        },
        {
            name: "Mentor",
            selector: row => (row.mentor_id ? `${row.mentor?.first_name} ${row.mentor?.last_name} (${row.mentor_id})` : "N/A"),
        },
        {
            name: "Datum",
            selector: row => dayjs.utc(row.date).format(Config.DATETIME_FORMAT),
        },
        {
            name: "Resultat",
            cell: row => {
                if (row.training_session_belongs_to_users?.passed == null && row.training_session_belongs_to_users?.log_id == null) {
                    return <Badge color={COLOR_OPTS.DEFAULT}>Geplant</Badge>;
                }

                if (row.training_session_belongs_to_users?.passed) {
                    return <Badge color={COLOR_OPTS.SUCCESS}>Bestanden</Badge>;
                } else {
                    return <Badge color={COLOR_OPTS.DANGER}>Nicht Bestanden</Badge>;
                }
            },
        },
        {
            name: "Aktion",
            cell: row => {
                return (
                    <div className={"flex"}>
                        <Button
                            className={"my-3 ml-2"}
                            variant={"twoTone"}
                            disabled={row.training_session_belongs_to_users?.log_id == null}
                            onClick={() => {
                                const logUUID = training_logs.find(l => l.TrainingSessionBelongsToUsers?.training_session_id == row.id);
                                navigate(`/training/log/${logUUID?.uuid}`);
                            }}
                            size={SIZE_OPTS.SM}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbEye size={20} />}>
                            Log Ansehen
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export default {
    getColumns,
};
