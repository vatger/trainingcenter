import { Dispatch, useState } from "react";
import { Modal } from "@/components/ui/Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbListNumbers, TbPlus, TbSection, TbTextDirectionLtr } from "react-icons/tb";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Input } from "@/components/ui/Input/Input";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { LogTemplateElement, LogTemplateElementRating, LogTemplateType } from "@/models/TrainingLogTemplateModel";

export function LTTemplateElementModal(props: {
    show: boolean;
    onClose: () => void;
    logTemplateElements: LogTemplateElement[];
    setLogTemplateElements: Dispatch<LogTemplateElement[]>;
}) {
    const [showingSecondPage, setShowingSecondPage] = useState<boolean>(false);
    const [selectedElement, setSelectedElement] = useState<LogTemplateType>("rating");
    const [element, setElement] = useState<LogTemplateElement>({} as LogTemplateElement);

    function addSelectedElement(elem: LogTemplateElement | undefined) {
        if (elem == null) return;

        if (elem.title == null || elem.title.length == 0) return;

        if (elem.type == "rating") {
            let e = elem as LogTemplateElementRating;
            if (e.max == null || isNaN(e.max) || Number(e.max <= 0)) return;
        }

        let templates = [...props.logTemplateElements];
        templates.push(elem);

        props.setLogTemplateElements(templates);
        setShowingSecondPage(false);
        setElement({} as LogTemplateElement);
        props.onClose();
    }

    return (
        <Modal
            show={props.show}
            title={"Logvorlagen-Element Hinzufügen"}
            onClose={() => {
                props.onClose();
                setShowingSecondPage(false);
            }}
            footer={
                <RenderIf
                    truthValue={showingSecondPage}
                    elementTrue={
                        <>
                            <Button
                                size={SIZE_OPTS.SM}
                                onClick={() => {
                                    setShowingSecondPage(false);
                                    setElement({} as LogTemplateElement);
                                }}
                                className={"sm:mr-3"}>
                                Zurück
                            </Button>
                            <Button
                                icon={<TbPlus size={18} />}
                                size={SIZE_OPTS.SM}
                                onClick={() => addSelectedElement(element)}
                                variant={"twoTone"}
                                color={COLOR_OPTS.PRIMARY}
                                className={"sm:mt-0 mt-3"}>
                                Hinzufügen
                            </Button>
                        </>
                    }
                    elementFalse={
                        <Button size={SIZE_OPTS.SM} variant={"plain"} color={COLOR_OPTS.DEFAULT} onClick={() => props.onClose()}>
                            Schließen
                        </Button>
                    }
                />
            }>
            <RenderIf
                truthValue={!showingSecondPage}
                elementTrue={renderSectionSelection(setSelectedElement, setShowingSecondPage)}
                elementFalse={
                    <>
                        {selectedElement == "section" && renderCreateSectionElement(setElement)}

                        {selectedElement == "textarea" && renderCreateTextAreaElement(element, setElement)}

                        {selectedElement == "rating" && renderCreateRatingElement(element, setElement)}
                    </>
                }
            />
        </Modal>
    );
}

function renderSectionSelection(setSelectedElement: Dispatch<LogTemplateType>, setShowingSecondPage: Dispatch<boolean>) {
    return (
        <>
            <div
                onClick={() => {
                    setSelectedElement("section");
                    setShowingSecondPage(true);
                }}
                className={
                    "border border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 transition-colors rounded p-3 hover:cursor-pointer"
                }>
                <div className={"flex"}>
                    <h6>Abschnitt</h6>
                    <TbSection size={18} className={"h6 ml-3"} />
                </div>
                <p>Ein Platzhalter, welches verschiedene Teile des Logs unterteilt.</p>
            </div>

            <div
                onClick={() => {
                    setSelectedElement("textarea");
                    setShowingSecondPage(true);
                }}
                className={
                    "border border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 transition-colors rounded p-3 hover:cursor-pointer mt-3"
                }>
                <div className={"flex"}>
                    <h6>Textfeld</h6>
                    <TbTextDirectionLtr size={18} className={"h6 ml-3"} />
                </div>
                <p>Ein einfaches Textfeld, welches von einem Mentor mit Text gefüllt wird.</p>
            </div>

            <div
                onClick={() => {
                    setSelectedElement("rating");
                    setShowingSecondPage(true);
                }}
                className={
                    "border border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 transition-colors rounded p-3 hover:cursor-pointer mt-3"
                }>
                <div className={"flex"}>
                    <h6>Bewertung</h6>
                    <TbListNumbers size={18} className={"h6 ml-3"} />
                </div>
                <p>Ein Feld, welches einen Wert von 0 - X annimmt. Zusätzlich kann ein kleiner Text dazu geschrieben - falls dies nicht deaktiviert wird.</p>
            </div>
        </>
    );
}

function renderCreateSectionElement(setElement: Dispatch<LogTemplateElement>) {
    return (
        <Input
            label={"Name"}
            regex={RegExp("^(?!\\s*$).+")}
            regexMatchEmpty
            regexCheckInitial
            description={"Name des Abschnitts"}
            labelSmall
            required
            onChange={e => setElement({ type: "section", title: e.target.value })}
        />
    );
}

function renderCreateTextAreaElement(element: LogTemplateElement, setElement: Dispatch<LogTemplateElement>) {
    return (
        <>
            <Input
                label={"Name"}
                description={"Name des Textfeldes"}
                labelSmall
                required
                regex={RegExp("^(?!\\s*$).+")}
                regexMatchEmpty
                regexCheckInitial
                onChange={e => setElement({ ...element, type: "textarea", title: e.target.value })}
            />

            <Input
                className={"mt-4"}
                label={"Beschreibung"}
                description={"Beschreibung des Textfeldes"}
                labelSmall
                onChange={e => setElement({ ...element, type: "textarea", subtitle: e.target.value })}
            />
        </>
    );
}

function renderCreateRatingElement(element: LogTemplateElement, setElement: Dispatch<LogTemplateElement>) {
    return (
        <>
            <Input
                label={"Name"}
                description={"Name des Textfeldes"}
                labelSmall
                required
                regex={RegExp("^(?!\\s*$).+")}
                regexMatchEmpty
                regexCheckInitial
                onChange={e => setElement({ ...element, type: "rating", title: e.target.value })}
            />

            <Input
                className={"mt-4"}
                label={"Beschreibung"}
                description={"Beschreibung des Textfeldes"}
                labelSmall
                onChange={e => setElement({ ...element, type: "rating", subtitle: e.target.value })}
            />

            <Input
                className={"mt-4"}
                label={"Maximaler Wert"}
                required
                regex={RegExp("^[1-9][0-9]*")}
                regexMatchEmpty
                regexCheckInitial
                type={"number"}
                description={"Maximaler Wert der Bewertungsskala (Mindestwert: 1)"}
                labelSmall
                onChange={e => setElement({ ...element, type: "rating", max: Number(e.target.value) })}
            />

            <Checkbox className={"mt-4"} checked={false} onChange={e => setElement({ ...element, type: "rating", disableText: e })}>
                Zusätzlichen Text deaktivieren
            </Checkbox>
        </>
    );
}
