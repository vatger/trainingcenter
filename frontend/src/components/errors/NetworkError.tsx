import { Alert } from "../ui/Alert/Alert";
import { TYPE_OPTS } from "../../assets/theme.config";
import { AxiosError } from "axios";
import { NetworkErrorModal } from "./NetworkErrorModal";
import { useRef, useState } from "react";
import { generateUUID } from "../../utils/helper/UUIDHelper";
import { RenderIf } from "../conditionals/RenderIf";

type NetworkErrorProps = {
    error: AxiosError | string | undefined | null;
    onClose?: () => any;
    closeable?: boolean;
    custom_message?: string;
    className?: string;
};

export function NetworkError(props: NetworkErrorProps) {
    const error_uuid = useRef<string>(generateUUID());
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <RenderIf
                truthValue={typeof props.error == "string"}
                elementTrue={
                    <Alert
                        closeable={props.closeable ?? true}
                        onClose={() => {
                            props.onClose?.();
                        }}
                        className={"my-3 " + props.className}
                        rounded
                        type={TYPE_OPTS.DANGER}>
                        <>{props.error}</>
                    </Alert>
                }
                elementFalse={
                    <>
                        <Alert
                            closeable={props.closeable ?? true}
                            onClose={() => {
                                props.onClose?.();
                            }}
                            className={"my-3 " + props.className}
                            rounded
                            type={TYPE_OPTS.DANGER}>
                            <RenderIf
                                truthValue={props.custom_message != null}
                                elementTrue={<>{props.custom_message}</>}
                                elementFalse={
                                    <>
                                        Es ist ein Fehler aufgetreten. Klicke{" "}
                                        <span className={"underline hover:cursor-pointer"} onClick={() => setShowModal(true)}>
                                            hier
                                        </span>{" "}
                                        um mehr zu erfahren.
                                    </>
                                }
                            />
                        </Alert>
                        <RenderIf
                            truthValue={props.custom_message == null}
                            elementTrue={
                                <NetworkErrorModal
                                    error={(props.error as AxiosError) ?? ({} as AxiosError)}
                                    show={showModal}
                                    uuid={error_uuid.current}
                                    onClose={() => setShowModal(false)}
                                    title={`Netzwerk Fehler`}
                                />
                            }
                        />
                    </>
                }
            />
        </>
    );
}
