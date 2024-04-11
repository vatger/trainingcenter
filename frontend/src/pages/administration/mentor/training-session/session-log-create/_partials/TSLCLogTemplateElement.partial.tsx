import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Separator } from "@/components/ui/Separator/Separator";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TextArea } from "@/components/ui/Textarea/TextArea";
import React, { useState } from "react";
import { Input } from "@/components/ui/Input/Input";
import {
    LogTemplateElement,
    LogTemplateElementRating,
    LogTemplateElementSection,
    LogTemplateElementTextarea,
    LogTemplateType,
} from "@/models/TrainingLogTemplateModel";

function onValueChange<T>(map: Map<string, T>, uuid: string, value: T) {
    if (map.has(uuid)) {
        map.delete(uuid);
    }

    map.set(uuid, value);
}

function render(
    type: LogTemplateType | undefined,
    element: LogTemplateElement & { uuid: string },
    index: number,
    stringValues: Map<string, string>,
    progressValues: Map<string, number>
) {
    const [progressBarValue, setProgressBarValue] = useState<number>(0);

    let elem: any;
    switch (type) {
        case "textarea":
            elem = element as LogTemplateElementTextarea;
            return (
                <div>
                    <h6 className={elem.subtitle == null ? "mb-2" : ""}>{elem.title}</h6>
                    <TextArea
                        onChange={e => onValueChange<string>(stringValues, element.uuid, e.target.value)}
                        placeholder={elem.subtitle ? elem.subtitle : `Bewertung ${elem.title}`}
                    />
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
                                {progressBarValue} / {elem.max}
                            </span>
                        </div>
                        <div className={"flex flex-col h-full"}>
                            <ProgressBar value={(progressBarValue / elem.max) * 100} hidePercentage />
                            <Input
                                className={"mt-2"}
                                type={"number"}
                                labelSmall
                                value={progressBarValue.toString()}
                                onChange={e => {
                                    let val = Number(e.target.value);

                                    if (val == Number.NaN) {
                                        val = 0;
                                    }

                                    if (val > elem.max) {
                                        val = elem.max;
                                    }

                                    if (val < 0) {
                                        val = 0;
                                    }

                                    setProgressBarValue(val);
                                    onValueChange<number>(progressValues, element.uuid, val);
                                }}
                            />
                        </div>
                    </div>
                    <RenderIf
                        truthValue={!elem.disableText}
                        elementTrue={
                            <div className={"w-full mt-6 xl:mt-0 xl:ml-6"}>
                                <TextArea
                                    onChange={e => onValueChange<string>(stringValues, element.uuid, e.target.value)}
                                    placeholder={elem.subtitle ? elem.subtitle : `Bewertung ${elem.title}`}
                                />
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

        default:
            return (
                <div>
                    <h6 className={"mb-2"}>Bewertung</h6>

                    <TextArea onChange={e => onValueChange<string>(stringValues, element.uuid, e.target.value)} placeholder={`Bewertung`} />
                </div>
            );
    }
}

export function TSLCLogTemplateElementPartial(props: {
    element: LogTemplateElement & { uuid: string };
    index: number;
    stringValues: Map<string, string>;
    progressValues: Map<string, number>;
}) {
    return (
        <>
            <div className={"flex relative flex-col md:flex-row justify-between " + (props.index == 0 || props.element.type == "section" ? "" : "mt-6")}>
                <div className={"w-full"}>{render(props.element.type, props.element, props.index, props.stringValues, props.progressValues)}</div>
            </div>
        </>
    );
}
