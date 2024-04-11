import { ManageAccountElement } from "../../../../../../components/ui/Account/ManageAccountElement";
import { Button } from "../../../../../../components/ui/Button/Button";
import { TbRepeat, TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "../../../../../../assets/theme.config";
import { useState } from "react";

export function MGVDangerSubpage(props: { uuid?: string }) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    function deleteMentorGroup() {
        alert("Deleting mentor_group, uuid: " + props.uuid);
    }

    return (
        <>
            <p>
                Viele der hier vorhandenen Einstellungen können gefährlich sein und eventuell zum Datenverlust führen. Sie können sich negativ auf die
                Ausbildungen anderer Mitglieder auswirken und benötigen deshalb immer eine weitere Bestätigung. Diese Aktionen können{" "}
                <strong className={"underline"}>nicht</strong> rückgängig gemacht werden.
            </p>

            <ManageAccountElement
                hideBottomBorder
                title={
                    <>
                        Mentorengruppe Löschen
                        <span className={"text-danger flex text-xs mt-1.5"}>
                            Die Mentorengruppe wird gelöscht. Dazu gehört u.A. auch die Zugehörigkeit zu einem Kurs. Falls ein Kurs nur dieser eine
                            Mentorengruppe zugewiesen ist, wird dieser gelöscht, da sonst niemand mehr in der Lage ist, diesen zu bearbeiten.
                        </span>
                    </>
                }
                element={
                    <Button
                        className={"ml-auto float-right"}
                        loading={isDeleting}
                        onClick={() => deleteMentorGroup()}
                        icon={<TbTrash size={20} />}
                        variant={"twoTone"}
                        color={COLOR_OPTS.DANGER}>
                        Löschen
                    </Button>
                }
            />
        </>
    );
}
