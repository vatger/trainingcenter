import {
    LogTemplateElement,
    LogTemplateElementRating,
    LogTemplateElementSection,
    LogTemplateElementTextarea,
    LogTemplateType,
} from "@/models/TrainingLogTemplateModel";
import { ProgressBar } from "@/components/ui/ProgressBar/ProgressBar";
import { Separator } from "@/components/ui/Separator/Separator";
import { RenderIf } from "@/components/conditionals/RenderIf";

function render(type: LogTemplateType, element: LogTemplateElement, index: number) {
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

export function LTTemplateElementPreviewPartial(props: { element: LogTemplateElement; index: number }) {
    return (
        <div className={"flex relative flex-col md:flex-row justify-between " + (props.index == 0 || props.element.type == "section" ? "" : "mt-6")}>
            <div className={"w-full"}>{render(props.element.type, props.element, props.index)}</div>
        </div>
    );
}
