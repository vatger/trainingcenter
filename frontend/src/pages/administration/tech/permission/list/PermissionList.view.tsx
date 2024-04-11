import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { PLRoleListPartial } from "./_partials/PLRoleList.partial";
import { PLPermListPartial } from "./_partials/PLPermList.partial";

export function PermissionListView() {
    return (
        <>
            <PageHeader title={"Rechteverwaltung"} hideBackLink />

            <PLRoleListPartial />
            <PLPermListPartial />
        </>
    );
}
