import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Button } from "@/components/ui/Button/Button";
import { TbArrowDown, TbArrowUp, TbTrash } from "react-icons/tb";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Dispatch } from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import {
    LogTemplateElement,
    LogTemplateElementRating,
    LogTemplateElementSection,
    LogTemplateElementTextarea,
    LogTemplateType,
} from "@/models/TrainingLogTemplateModel";

const borderClass: string =
    "border-dashed border-2 border-gray-100 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-400 transition-colors rounded-lg p-3";

export function LTTemplateElementPartial(props: {
    element: LogTemplateElement;
    content: LogTemplateElement[];
    setContent: Dispatch<LogTemplateElement[]>;
    index: number;
    length: number;
}) {
    function removeItem() {
        const newContent = props.content.filter((t: LogTemplateElement, index) => {
            return index != props.index;
        });

        props.setContent(newContent);
    }

    function moveItemUp() {
        const prevElem = props.content[props.index - 1];
        const currElem = props.content[props.index];

        const newContent = [...props.content];
        newContent[props.index] = prevElem;
        newContent[props.index - 1] = currElem;

        props.setContent(newContent);
    }

    function moveItemDown() {
        const nextElem = props.content[props.index + 1];
        const currElem = props.content[props.index];

        const newContent = [...props.content];
        newContent[props.index] = nextElem;
        newContent[props.index + 1] = currElem;

        props.setContent(newContent);
    }

    return (
        <div className={"flex relative flex-col md:flex-row justify-between " + (props.index == 0 ? "" : "mt-6") + " " + borderClass}>
            <div className={"flex flex-row md:flex-col justify-center md:pr-5"}>
                <Button
                    onClick={removeItem}
                    icon={<TbTrash size={20} />}
                    className={"w-[34px] h-[34px]"}
                    variant={"twoTone"}
                    color={COLOR_OPTS.DANGER}></Button>
            </div>
            <div className={"w-full"}>{render(props.element.type, props.element)}</div>
            <div className={"flex flex-row md:flex-col justify-center md:pl-5 md:mt-0 mt-5"}>
                <Button disabled={props.index == 0} onClick={moveItemUp} icon={<TbArrowUp size={20} />} className={"w-[34px] h-[34px]"}></Button>
                <Button
                    disabled={props.index == props.length - 1}
                    onClick={moveItemDown}
                    icon={<TbArrowDown size={20} />}
                    className={"w-[34px] h-[34px] ml-2 md:ml-0 md:mt-2"}></Button>
            </div>
        </div>
    );
}

function render(type: LogTemplateType, element: LogTemplateElement) {
    let elem;
    switch (type) {
        case "textarea":
            elem = element as LogTemplateElementTextarea;
            return (
                <div>
                    <h6 className={elem.subtitle == null ? "mb-2" : ""}>{elem.title}</h6>
                    {elem.subtitle && <p className={"mb-2"}>{elem.subtitle}</p>}
                    <div className={"input h-full input-wrapper input-disabled resize-none"}>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet.
                    </div>
                </div>
            );

        case "rating":
            elem = element as LogTemplateElementRating;
            return (
                <div className={"flex h-full flex-col xl:flex-row justify-between"}>
                    <div className={`flex flex-col w-full ${elem.disableText ? "" : "xl:w-1/2"} xl:min-w-[420px]`}>
                        <div className={"flex justify-between"}>
                            <h6 className={"mb-2"}>{elem.title}</h6>
                            <span>0 / {elem.max}</span>
                        </div>
                        <div>
                            <ProgressBar value={0} hidePercentage />
                        </div>
                        {elem.subtitle != null && (
                            <div className={"mt-2"}>
                                <p>{elem.subtitle}</p>
                            </div>
                        )}
                    </div>
                    <RenderIf
                        truthValue={!elem.disableText}
                        elementTrue={
                            <div className={"w-full mt-6 xl:mt-0 xl:ml-6"}>
                                <div className={"input h-full input-wrapper input-disabled resize-none "}>Optionaler Kommentar zu "{elem.title}"</div>
                            </div>
                        }
                    />
                </div>
            );

        case "section":
            elem = element as LogTemplateElementSection;
            return (
                <div>
                    <h4 className={"mb-2"}>{elem.title}</h4>
                </div>
            );
    }
}
