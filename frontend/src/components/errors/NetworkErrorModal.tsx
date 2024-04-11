import { Modal } from "../ui/Modal/Modal";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { ConversionUtils } from "turbocommons-ts";
import { Button } from "../ui/Button/Button";
import { COLOR_OPTS } from "../../assets/theme.config";
import { TbCheck, TbCopy } from "react-icons/tb";
import { copyText } from "../../utils/helper/clipboard/ClipboardHelper";
import { Separator } from "../ui/Separator/Separator";
import { Accordion } from "../ui/Accordion/Accordion";
import { Config } from "@/core/Config";
import { useUserSelector } from "@/app/features/authSlice";
import dayjs from "dayjs";

export function NetworkErrorModal(props: { error: AxiosError; show: boolean; title: string; uuid: string; onClose: () => any }) {
    const user = useUserSelector();
    const [copied, setCopied] = useState<boolean>(false);

    const errorContainerRef = useRef<HTMLDivElement>(null);

    const errorObject = {
        user_id: user?.id ?? "n/a",
        axios: { ...props.error, stack: "" },
        date: dayjs.utc().unix(),
    };

    const base64Error = useRef<string>(ConversionUtils.stringToBase64(JSON.stringify(errorObject)));

    function copyError() {
        copyText(base64Error.current).then(() => {
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, Config.SHOW_SUCCESS_TIMEOUT);
        });
    }

    return (
        <Modal show={props.show} title={props.title} onClose={props.onClose}>
            <p>
                Es tut uns leid, es scheint ein Fehler aufgetreten zu sein. Wir haben das Fehlerprotokoll unten zur verfügung gestellt. Da es sich hierbei um
                einen Netzwerkfehler handelt können wir diesen eventuell nicht selber speichern. Falls der Fehler bestehen bleibt, melde Dich bitte bei unserem
                Tech Department (support@vatsim-germany.org) und nenne das unten stehende Fehlerprotokoll. Nur dann sind wir in der Lage Dir adäquat zu helfen!
            </p>

            <Separator />

            <Accordion title={"Fehlerprotokoll" + (props.error.status ? ` | ${props.error.status}` : "")}>
                <div
                    ref={errorContainerRef}
                    className={"side-nav-hide-scrollbar input input-disabled border-0 border-t p-2 rounded-none break-all overflow-y-scroll max-h-[30vh]"}>
                    {base64Error.current}
                </div>
            </Accordion>

            <div className={"w-full"}>
                <Button
                    onClick={() => copyError()}
                    className={"mt-3"}
                    variant={"twoTone"}
                    block
                    color={copied ? COLOR_OPTS.SUCCESS : COLOR_OPTS.PRIMARY}
                    icon={copied ? <TbCheck size={20} /> : <TbCopy size={20} />}>
                    {copied ? "Kopiert" : "Kopieren"}
                </Button>
            </div>
        </Modal>
    );
}
