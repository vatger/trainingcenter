import React from "react";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";

function statusToBadge(status?: number) {
    switch (status) {
        case 0:
            return <Badge color={COLOR_OPTS.PRIMARY}>Angefragt</Badge>;
        case 1:
            return <Badge color={COLOR_OPTS.PRIMARY}>ATSIM Angefordert</Badge>;
        case 2:
            return <Badge color={COLOR_OPTS.WARNING}>ATSIM Nicht Bestanden</Badge>;
        case 3:
            return <Badge color={COLOR_OPTS.PRIMARY}>Rating Beantragt</Badge>;
        case 4:
            return <Badge color={COLOR_OPTS.DANGER}>Abgelehnt</Badge>;
        case 5:
            return <Badge color={COLOR_OPTS.SUCCESS}>Abgeschlossen</Badge>;
    }
}

export default {
    statusToBadge,
};
