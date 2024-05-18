import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Separator } from "@/components/ui/Separator/Separator";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import React, { Dispatch, useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import {
    LogTemplateElement,
    LogTemplateElementRating,
    LogTemplateElementSection,
    LogTemplateElementTextarea,
    LogTemplateType,
} from "@/models/TrainingLogTemplateModel";
import { ParticipantStatus } from "@/pages/administration/mentor/training-session/session-log-create/TrainingSessionLogsCreate.view";
import { MapArray } from "@/components/conditionals/MapArray";

function LogTemplateTextArea({ element }: { element: LogTemplateElementTextarea }) {
    return (
        <div>
            <h6 className={element.subtitle == null ? "mb-2" : ""}>{element.title}</h6>
            {element.subtitle && <p className={"mb-2"}>{element.subtitle}</p>}

            <div className={"input input-textarea input-disabled"}>{!element.text_content?.length ? "N/A" : element.text_content}</div>
        </div>
    );
}

function LogTemplateRating({ element }: { element: LogTemplateElementRating }) {
    return (
        <div className={"flex h-full flex-col xl:flex-row justify-between"}>
            <div className={`flex flex-col w-full ${element.disableText ? "" : "xl:w-1/2"} xl:min-w-[420px]`}>
                <div className={"flex justify-between"}>
                    <h6 className={"mb-2"}>{element.title}</h6>
                    <span>
                        {element.value} / {element.max}
                    </span>
                </div>
                <div className={"flex flex-col h-full"}>
                    <ProgressBar value={((element.value ?? 0) / element.max) * 100} hidePercentage />
                    {element.subtitle != null && (
                        <div className={"mt-2"}>
                            <p>{element.subtitle}</p>
                        </div>
                    )}
                </div>
            </div>
            <RenderIf
                truthValue={!element.disableText}
                elementTrue={
                    <div className={"w-full mt-6 xl:mt-0 xl:ml-6"}>
                        <div className={"input input-textarea input-disabled"}>{!element.text_content?.length ? "N/A" : element.text_content}</div>
                    </div>
                }
            />
        </div>
    );
}

function LogTemplateSection({ element, index }: { element: LogTemplateElementSection; index: number }) {
    return (
        <RenderIf
            truthValue={index == 0}
            elementTrue={<h4 className={"mb-0 underline"}>{element.title}</h4>}
            elementFalse={
                <div className={"pt-4"}>
                    <Separator className={"mb-2"} />
                    <h4 className={"mb-2 underline"}>{element.title}</h4>
                </div>
            }
        />
    );
}

interface ILogTemplateElementReadOnly {
    logElement: LogTemplateElement;
    idx: number;
}

export function LogTemplateElementReadOnly({ logElement, idx }: ILogTemplateElementReadOnly) {
    function renderComponent(v: LogTemplateElement, idx: number) {
        switch (v.type) {
            case "textarea":
                return <LogTemplateTextArea element={v as LogTemplateElementTextarea} />;

            case "rating":
                return <LogTemplateRating element={v as LogTemplateElementRating} />;

            case "section":
                return <LogTemplateSection element={v as LogTemplateElementSection} index={idx} />;
        }
    }

    return (
        <div key={idx} className={"flex relative flex-col md:flex-row justify-between " + (idx == 0 || logElement.type == "section" ? "" : "mt-6")}>
            <div className={"w-full"}>{renderComponent(logElement, idx)}</div>
        </div>
    );
}
