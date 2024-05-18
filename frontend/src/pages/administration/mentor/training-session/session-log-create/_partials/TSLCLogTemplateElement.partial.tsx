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

type IOnChangeFunc = (oldElem: LogTemplateElement, newElem: LogTemplateElement) => any;

function LogTemplateTextArea({ element, onChange }: { element: LogTemplateElementTextarea; onChange: IOnChangeFunc }) {
    return (
        <div>
            <h6 className={element.subtitle == null ? "mb-2" : ""}>{element.title}</h6>
            <TextArea
                onChange={e => onChange(element, { ...element, text_content: e.target.value })}
                placeholder={element.subtitle ? element.subtitle : `Bewertung ${element.title}`}
            />
        </div>
    );
}

function LogTemplateRating({ element, onChange }: { element: LogTemplateElementRating; onChange: IOnChangeFunc }) {
    const [progressBarValue, setProgressBarValue] = useState<number>(0);

    return (
        <div className={"flex h-full flex-col xl:flex-row justify-between"}>
            <div className={`flex flex-col w-full ${element.disableText ? "" : "xl:w-1/2"} xl:min-w-[420px]`}>
                <div className={"flex justify-between"}>
                    <h6 className={"mb-2"}>{element.title}</h6>
                    <span>
                        {progressBarValue} / {element.max}
                    </span>
                </div>
                <div className={"flex flex-col h-full"}>
                    <ProgressBar value={(progressBarValue / element.max) * 100} hidePercentage />
                    <Input
                        className={"mt-2"}
                        type={"number"}
                        min={0}
                        max={element.max}
                        labelSmall
                        value={progressBarValue.toString()}
                        onChange={e => {
                            let val = e.target.valueAsNumber;

                            if (isNaN(val)) {
                                val = 0;
                            } else {
                                // Clamp value to [0, max]
                                val = Math.min(Math.max(val, 0), element.max);
                            }

                            setProgressBarValue(val);
                            onChange(element, { ...element, value: val });
                        }}
                    />
                </div>
            </div>
            <RenderIf
                truthValue={!element.disableText}
                elementTrue={
                    <div className={"w-full mt-6 xl:mt-0 xl:ml-6"}>
                        <TextArea
                            onChange={e => onChange(element, { ...element, text_content: e.target.value })}
                            placeholder={element.subtitle ? element.subtitle : `Bewertung ${element.title}`}
                        />
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

interface ITSLCLogTemplateElementPartial {
    participantStatus: ParticipantStatus;
    participantStatusList: ParticipantStatus[];
    setParticipantValues: Dispatch<ParticipantStatus[]>;
}

export function TSLCLogTemplateElementPartial({ participantStatus, participantStatusList, setParticipantValues }: ITSLCLogTemplateElementPartial) {
    function handleChange(oldElem: LogTemplateElement, newElem: LogTemplateElement) {
        // Check if the old value exists
        const foundIndex = participantStatus.user_log.findIndex(l => l == oldElem);
        if (foundIndex == -1) return;

        const newParticipantStatusList = [...participantStatusList];

        for (const participant of newParticipantStatusList) {
            if (participant._uuid == participantStatus._uuid) {
                participant.user_log[foundIndex] = { ...newElem };
            }
        }

        setParticipantValues(newParticipantStatusList);
    }

    function renderComponent(v: LogTemplateElement, idx: number) {
        switch (v.type) {
            case "textarea":
                return <LogTemplateTextArea element={v as LogTemplateElementTextarea} onChange={handleChange} />;

            case "rating":
                return <LogTemplateRating element={v as LogTemplateElementRating} onChange={handleChange} />;

            case "section":
                return <LogTemplateSection element={v as LogTemplateElementSection} index={idx} />;
        }
    }

    return (
        <>
            <MapArray
                data={participantStatus.user_log}
                mapFunction={(v, idx) => {
                    return (
                        <div key={idx} className={"flex relative flex-col md:flex-row justify-between " + (idx == 0 || v.type == "section" ? "" : "mt-6")}>
                            <div className={"w-full"}>{renderComponent(v, idx)}</div>
                        </div>
                    );
                }}
            />
        </>
    );
}
