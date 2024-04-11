import { useState } from "react";
import { ManageAccountElement } from "@/components/ui/Account/ManageAccountElement";
import { Button } from "@/components/ui/Button/Button";
import { TbRepeat, TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import { useNavigate, useParams } from "react-router-dom";
import { EGVDeleteModal } from "@/pages/administration/lm/endorsement-group/view/_modals/EGVDelete.modal";

export function EGVDangerSubpage() {
    const { id } = useParams();
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <p>
                Viele der hier vorhandenen Einstellungen können gefährlich sein und eventuell zum Datenverlust führen. Sie können sich negativ auf die
                Ausbildungen anderer Mitglieder auswirken und benötigen deshalb immer eine weitere Bestätigung. Diese Aktionen können{" "}
                <strong className={"underline"}>nicht</strong> rückgängig gemacht werden.
            </p>

            <ManageAccountElement
                title={
                    <>
                        Freigabegruppe Löschen
                        <span className={"text-danger flex text-xs mt-1.5"}>
                            Die gesamte Freigabegruppe wird gelöscht. Dies hat zur folge, dass Mitglieder eventuell ihre Freigaben verlieren.
                        </span>
                    </>
                }
                hideBottomBorder
                element={
                    <Button
                        className={"ml-auto float-right"}
                        onClick={() => setShowModal(true)}
                        icon={<TbTrash size={20} />}
                        variant={"twoTone"}
                        color={COLOR_OPTS.DANGER}>
                        Löschen
                    </Button>
                }
            />

            <EGVDeleteModal id={id} show={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
