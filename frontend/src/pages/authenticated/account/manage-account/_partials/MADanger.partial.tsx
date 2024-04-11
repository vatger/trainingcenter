import { ManageAccountElement } from "../../../../../components/ui/Account/ManageAccountElement";
import { Button } from "../../../../../components/ui/Button/Button";
import { COLOR_OPTS } from "../../../../../assets/theme.config";
import { TbLogout, TbTrash } from "react-icons/tb";

export function MADangerPartial() {
    return (
        <>
            <p>
                Viele der hier vorhandenen Einstellungen können gefährlich sein und eventuell zum Datenverlust führen. Sie können sich negativ auf Deine
                Ausbildung auswirken und benötigen deshalb immer eine weitere Bestätigung. Die Aktionen können <strong className={"underline"}>nicht</strong>{" "}
                rückgängig gemacht werden.
            </p>

            <ManageAccountElement
                break
                title={"Von allen Kursen abmelden"}
                element={
                    <Button
                        block
                        className={"ml-auto float-right w-full md:w-auto"}
                        icon={<TbLogout size={20} />}
                        variant={"twoTone"}
                        color={COLOR_OPTS.DANGER}>
                        Abmelden
                    </Button>
                }
            />

            <ManageAccountElement
                break
                title={"Konto Löschen"}
                hideBottomBorder
                element={
                    <Button block className={"ml-auto float-right w-full md:w-auto"} icon={<TbTrash size={20} />} variant={"twoTone"} color={COLOR_OPTS.DANGER}>
                        Löschen
                    </Button>
                }
            />
        </>
    );
}
