import { FaChevronDown } from "react-icons/fa";
import React, { useContext, useRef } from "react";
import { MENU_ITEM_HEIGHT } from "@/assets/theme.config";
import { generateUUID } from "@/utils/helper/UUIDHelper";
import { RenderIf } from "../../conditionals/RenderIf";
import { useAuthSelector } from "@/app/features/authSlice";
import { useSideNavSelector } from "@/app/features/sideNavSlice";

type CollapsableMenuProps = {
    title: string;
    icon: any;
    children: any;
    disabled?: boolean;
    requiredPerm?: string;
};

export function CollapsableMenu(props: CollapsableMenuProps) {
    const uuid = useRef(generateUUID());

    function handleDropdownClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const target_id = e.currentTarget.getAttribute("data-id");
        const target_extended = e.currentTarget.getAttribute("data-dropdown-extended") == "true";

        if (target_extended) e.currentTarget.setAttribute("data-dropdown-extended", "false");
        else e.currentTarget.setAttribute("data-dropdown-extended", "true");

        const target_elem = document.getElementById(`${target_id}-dropdown`);
        const target_chevron = document.getElementById(`${target_id}-chevron`);

        if (target_elem == null || target_chevron == null) return;
        target_elem.style.height = target_extended ? "0" : (props.children.length ?? 1) * MENU_ITEM_HEIGHT + "px";

        target_chevron.style.transform = target_extended ? "rotate(0deg)" : "rotate(180deg)";
    }

    const { sideNavExtended } = useSideNavSelector();
    const userPermissions = useAuthSelector().userPermissions;

    return (
        <RenderIf
            truthValue={props.requiredPerm == null || userPermissions.indexOf(props.requiredPerm?.toUpperCase()) != -1}
            elementTrue={
                <ul>
                    <div className="menu-collapse">
                        <div
                            data-id={uuid.current}
                            data-dropdown-extended={"false"}
                            onClick={e => {
                                if (!props.disabled) {
                                    handleDropdownClick(e);
                                }
                            }}
                            className={`menu-collapse-item menu-collapse-item-transparent ${props.disabled ? "bg-gray-100" : ""}`}
                            id={`dropdown-${uuid.current}`}>
                            <span className="flex items-center">
                                <span className="text-2xl mr-2">{props.icon}</span>
                                {sideNavExtended && <span>{props.title}</span>}
                            </span>
                            <span className="text-lg mt-1 transition-transform" id={`${uuid.current}-chevron`} style={{ transform: "rotate(0deg)" }}>
                                <FaChevronDown size={12} />
                            </span>
                        </div>
                        <ul id={`${uuid.current}-dropdown`} className="ml-5 transition-all" style={{ opacity: 1, height: 0, overflow: "hidden" }}>
                            {props.children}
                        </ul>
                    </div>
                </ul>
            }
        />
    );
}
