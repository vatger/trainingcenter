import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Separator } from "@/components/ui/Separator/Separator";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import React from "react";
import { Input } from "@/components/ui/Input/Input";
import {
    LogTemplateElement,
    LogTemplateElementRating,
    LogTemplateElementSection,
    LogTemplateElementTextarea,
    LogTemplateType,
} from "@/models/TrainingLogTemplateModel";

function render(type: LogTemplateType | undefined, element: LogTemplateElement, index: number) {
    let elem: any;
    switch (type) {
        case "textarea":
            elem = element as LogTemplateElementTextarea;
            return (
                <div>
                    <h6 className={elem.subtitle == null ? "mb-2" : ""}>{elem.title}</h6>
                    {elem.subtitle && <p className={"mb-2"}>{elem.subtitle}</p>}

                    <div className={"input input-textarea input-disabled"}>{elem.text_content}</div>
                </div>
            );

        case "rating":
            elem = element as LogTemplateElementRating;
            return (
                <div className={"flex h-full flex-col xl:flex-row justify-between"}>
                    <div className={`flex flex-col w-full ${elem.disableText ? "" : "xl:w-1/2"} xl:min-w-[420px]`}>
                        <div className={"flex justify-between"}>
                            <h6 className={"mb-2"}>{elem.title}</h6>
                            <span>
                                {elem.value} / {elem.max}
                            </span>
                        </div>
                        <div className={"flex flex-col h-full"}>
                            <ProgressBar value={(elem.value / elem.max) * 100} hidePercentage />
                            {elem.subtitle != null && (
                                <div className={"mt-2"}>
                                    <p>{elem.subtitle}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <RenderIf
                        truthValue={!elem.disableText}
                        elementTrue={
                            <div className={"w-full mt-6 xl:mt-0 xl:ml-6"}>
                                <div className={"input input-textarea input-disabled"}>{elem.text_content}</div>
                            </div>
                        }
                    />
                </div>
            );

        case "section":
            elem = element as LogTemplateElementSection;
            return (
                <RenderIf
                    truthValue={index == 0}
                    elementTrue={<h4 className={"mb-0 underline"}>{elem.title}</h4>}
                    elementFalse={
                        <div className={"pt-4"}>
                            <Separator className={"mb-2"} />
                            <h4 className={"mb-2 underline"}>{elem.title}</h4>
                        </div>
                    }
                />
            );
    }
}

export function TLVLogTemplateElementPartial(props: { element: LogTemplateElement; index: number }) {
    return (
        <>
            <div className={"flex relative flex-col md:flex-row justify-between " + (props.index == 0 || props.element.type == "section" ? "" : "mt-6")}>
                <div className={"w-full"}>{render(props.element.type, props.element, props.index)}</div>
            </div>
        </>
    );
}
