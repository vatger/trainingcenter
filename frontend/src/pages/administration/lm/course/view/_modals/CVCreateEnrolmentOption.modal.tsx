import { Modal } from "@/components/ui/Modal/Modal";
import { MapArray } from "@/components/conditionals/MapArray";
import { EEnrolRequirementType, EnrolRequirementOptions, ICourseEnrolRequirement, InputRequirement, SelectRequirement } from "@common/Course.model";
import { Select } from "@/components/ui/Select/Select";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { COLOR_OPTS, ICON_SIZE_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Separator } from "@/components/ui/Separator/Separator";
import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/Badge/Badge";
import { getAtcRatingShort } from "@common/AtcRatingHelper";
import FormHelper from "@/utils/helper/FormHelper";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { TbPlus } from "react-icons/tb";
import { CourseModel } from "@/models/CourseModel";

interface ICVEnrolOptions {
    show: boolean;
    onClose: () => any;
    onCreateRequirement: (r: ICourseEnrolRequirement) => any;
}

export function CVCreateEnrolmentOptionModal({ show, onClose, onCreateRequirement }: ICVEnrolOptions) {
    const [selectedEnrolmentOption, setSelectedEnrolmentOption] = useState<number | undefined>(undefined);

    function addEnrolOption(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (selectedEnrolmentOption == null) return;
        const option = EnrolRequirementOptions[selectedEnrolmentOption];
        if (option == null) return;

        const formData = FormHelper.getEntries(e.target);
        let newEnrolRequirement = {} as ICourseEnrolRequirement;
        newEnrolRequirement.parameters = {};

        newEnrolRequirement.type = Number(formData.get("_type")) as EEnrolRequirementType;

        switch (option.type) {
            case EEnrolRequirementType.MIN_RATING:
            case EEnrolRequirementType.MAX_RATING:
            case EEnrolRequirementType.EXACT_RATING: {
                newEnrolRequirement.value = Number(formData.get("enrol_value"));
                break;
            }

            case EEnrolRequirementType.MIN_HOURS_STATION: {
                newEnrolRequirement.value = formData.get("enrol_value") as string;

                for (const parameter of option.parameters) {
                    newEnrolRequirement.parameters[parameter.id] = formData.get(parameter.id) as string;
                }

                break;
            }

            default: {
                newEnrolRequirement.value = formData.get("_type") as string;
            }
        }

        onCreateRequirement(newEnrolRequirement);
    }

    function renderOptions() {
        if (selectedEnrolmentOption == null) return <></>;
        let option = EnrolRequirementOptions[selectedEnrolmentOption];
        if (option == null) return <></>;

        return (
            <>
                <input type={"hidden"} value={option.type} name={"_type"} />

                <div id={"enrol-option-input"} className={"mt-5"}>
                    <RenderIf
                        truthValue={option.value.type == "input"}
                        elementTrue={
                            <Input
                                label={(option as InputRequirement).value.label}
                                labelSmall
                                placeholder={(option as InputRequirement).value.input_placeholder}
                                name={"enrol_value"}></Input>
                        }
                    />

                    <RenderIf
                        truthValue={option.value.type == "select"}
                        elementTrue={
                            <Select label={(option as SelectRequirement).value.label} labelSmall name={"enrol_value"}>
                                <MapArray
                                    data={(option as SelectRequirement).value.select_options}
                                    mapFunction={(key: number, index) => {
                                        return (
                                            <option value={key} key={index}>
                                                {getAtcRatingShort((option as SelectRequirement).value.select_options[index])}
                                            </option>
                                        );
                                    }}
                                />
                            </Select>
                        }
                    />
                </div>

                <div id={"enrol-option-parameters"}>
                    <MapArray
                        data={option?.parameters ?? []}
                        mapFunction={(parameter: any, index) => {
                            return (
                                <div className={"mt-5"}>
                                    <RenderIf
                                        truthValue={parameter.input.type == "input"}
                                        elementTrue={
                                            <Input
                                                label={parameter.input.label}
                                                labelSmall
                                                name={parameter.id}
                                                description={parameter.input.description ?? null}
                                                placeholder={parameter.input.input_placeholder}
                                            />
                                        }
                                    />

                                    <RenderIf
                                        truthValue={parameter.input.type == "select"}
                                        elementTrue={
                                            <Select label={parameter.input.label} labelSmall name={parameter.id}>
                                                <MapArray
                                                    data={parameter.input.select_options}
                                                    mapFunction={(key: number, index) => {
                                                        return (
                                                            <option value={key} key={index}>
                                                                {getAtcRatingShort(parameter.input.select_options[index])}
                                                            </option>
                                                        );
                                                    }}
                                                />
                                            </Select>
                                        }
                                    />
                                </div>
                            );
                        }}
                    />
                </div>

                <Separator />

                <Button type={"submit"} color={COLOR_OPTS.PRIMARY} icon={<TbPlus size={ICON_SIZE_OPTS.SM} />} size={SIZE_OPTS.SM} variant={"twoTone"}>
                    Hinzufügen
                </Button>
            </>
        );
    }

    return (
        <Modal title={"Einschreibevoraussetzungen"} show={show} onClose={onClose}>
            <Select
                label={"Einschreibeoption hinzufügen"}
                labelSmall
                onChange={v => {
                    if (v == "-1") {
                        setSelectedEnrolmentOption(undefined);
                        return;
                    }

                    setSelectedEnrolmentOption(Number(v));
                }}
                defaultValue={"-1"}>
                <option value={"-1"}>Auswählen</option>
                <MapArray
                    data={EnrolRequirementOptions.filter(e => e.active)}
                    mapFunction={(requirement, index) => {
                        return (
                            <option value={index} key={index}>
                                {requirement.title}
                            </option>
                        );
                    }}
                />
            </Select>

            <form onSubmit={addEnrolOption}>{renderOptions()}</form>
        </Modal>
    );
}
