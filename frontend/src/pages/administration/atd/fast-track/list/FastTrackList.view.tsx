import useApi from "@/utils/hooks/useApi";
import { FastTrackRequestModel } from "@/models/FastTrackRequestModel";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Card } from "@/components/ui/Card/Card";
import { Table } from "@/components/ui/Table/Table";
import FTLTypes from "@/pages/administration/atd/fast-track/_types/FTL.types";
import { Button } from "@/components/ui/Button/Button";
import { TbFilter, TbMailOpened } from "react-icons/tb";
import { Tooltip } from "@/components/ui/Tooltip/Tooltip";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Filter } from "@/components/ui/Filter/Filter";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";

export function FastTrackListView() {
    const { data: fastTrackRequests, loading: loadingFastTrackRequests } = useApi<FastTrackRequestModel[]>({
        url: "/administration/fast-track",
        method: "get",
    });

    const [showAll, setShowAll] = useState<boolean>(false);

    return (
        <>
            <PageHeader title={"Fast-Track Anfragen"} hideBackLink />

            <Card headerBorder>
                <Checkbox className={"mb-5"} onChange={e => setShowAll(e)}>
                    Alle Anfragen anzeigen
                </Checkbox>

                <Table
                    paginate
                    defaultSortField={4}
                    columns={FTLTypes.getColumns()}
                    data={fastTrackRequests?.filter(e => showAll || e.status < 4) ?? []}
                    loading={loadingFastTrackRequests}
                />
            </Card>
        </>
    );
}
