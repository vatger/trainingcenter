import { Button } from "@/components/ui/Button/Button";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { TbFilter, TbMailOpened } from "react-icons/tb";
import { Tooltip } from "@/components/ui/Tooltip/Tooltip";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { generateUUID } from "@/utils/helper/UUIDHelper";
import { Separator } from "@/components/ui/Separator/Separator";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";

export function Filter() {
    const filterUUID = useRef(generateUUID());
    const [hidden, setHidden] = useState<boolean>(false);

    // TODO: Complete and use at some point.

    return (
        <div className="dropdown">
            <Button color={COLOR_OPTS.PRIMARY} variant={"twoTone"} icon={<TbFilter size={20} />} onClick={() => setHidden(!hidden)}>
                Filter
            </Button>

            {/* Dropdown */}
            <ul
                id={`dropdown-${filterUUID.current}`}
                className={
                    "dropdown-menu bottom-end p-0 mt-1 min-w-[300px] md:min-w-[340px] opacity-100 right-[-50px] left-0 " +
                    (hidden ? "hidden" : "dropdown-expand")
                }>
                <li className="menu-item-header">
                    <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
                        <h6 className={"py-1"}>Filtereinstellungen</h6>
                    </div>
                </li>
                <div className="overflow-y-auto side-nav-hide-scrollbar min-h-[13rem] h-[30vh]">
                    <div className={"relative w-full h-full"}>
                        <div className={"absolute inset-0 overflow-y-auto side-nav-hide-scrollbar mr-0 mb-0"}>
                            <div className={"px-4 py-2"}>
                                <p className={"font-bold"}>Status:</p>
                                <div className={"flex flex-row flex-wrap"}>
                                    <Checkbox>Abgeschlossen</Checkbox>
                                    <Checkbox className={"ml-2"}>Angefragt</Checkbox>
                                    <Checkbox>Abgelehnt</Checkbox>
                                </div>
                            </div>

                            <Separator />
                        </div>
                    </div>
                </div>
            </ul>
        </div>
    );
}
