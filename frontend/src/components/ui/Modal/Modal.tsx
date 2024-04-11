import { TbX } from "react-icons/tb";
import { RenderIf } from "../../conditionals/RenderIf";
import React, { useRef } from "react";
import { Separator } from "../Separator/Separator";
import { ModalProps } from "./Modal.props";

export function Modal(props: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        if (!modalRef.current?.contains(e.target as Node)) {
            props.onClose?.();
        }
    }

    return (
        <RenderIf
            truthValue={props.show}
            elementTrue={
                <>
                    <div
                        onClick={e => handleClick(e)}
                        className="dialog-backdrop-animation overflow-y-auto dialog-overlay dialog-overlay-after-open p-5 z-[120] box-content">
                        <div
                            ref={modalRef}
                            style={{ inset: "unset" }}
                            className={"dialog dialog-after-open dialog-animation box-content mt-2 w-full sm:w-[540px]"}
                            tabIndex={-1}
                            role="dialog"
                            aria-modal="true">
                            <div className="dialog-content">
                                <span
                                    onClick={() => props.onClose?.()}
                                    className="close-btn close-btn-default absolute z-10 right-6 transition-colors"
                                    role="button">
                                    <TbX size={20} />
                                </span>
                                <h5 className={"mb-0 text-left"}>{props.title}</h5>
                                <Separator className={"my-2"} />
                                <div>{props.children}</div>

                                <RenderIf
                                    truthValue={props.footer != null}
                                    elementTrue={
                                        <>
                                            <Separator />
                                            <div className={"w-full mt-4 flex justify-end sm:flex-row flex-col"}>{props.footer}</div>
                                        </>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    );
}
