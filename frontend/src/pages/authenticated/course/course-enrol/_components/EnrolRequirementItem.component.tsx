import { TbCheck, TbX } from "react-icons/tb";
import React from "react";
import EnrolRequirementStringHelper from "@/pages/authenticated/course/course-enrol/_helper/EnrolRequirementStringHelper";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TbRefresh } from "react-icons/tb";

function getColor(passed?: boolean) {
    if (passed == null) {
        return "bg-gray-400";
    }

    return passed ? "bg-emerald-500" : "bg-red-500";
}

export function EnrolRequirementItemComponent({ action, passed }: { action: string; passed?: boolean }) {
    return (
        <div className={"flex mb-3"}>
            <span className={`avatar avatar-circle w-[24px] h-[24px] w-min-[24px] ${getColor(passed)}`} style={{ lineHeight: "24px", fontSize: "12px" }}>
                {passed == null && <TbRefresh className={"m-[5px]"} size={19} />}

                <RenderIf truthValue={passed != null && passed} elementTrue={<TbCheck className={"m-[5px]"} size={14} />} />

                <RenderIf truthValue={passed != null && !passed} elementTrue={<TbX className={"m-[5px]"} size={14} />} />
            </span>
            <p className={"my-auto ml-3"}>{EnrolRequirementStringHelper.getDescription(action)}</p>
        </div>
    );
}
