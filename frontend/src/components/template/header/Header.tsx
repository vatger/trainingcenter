import { TbMenu2 } from "react-icons/tb";
import { UserProfileHeader } from "./UserProfileHeader";
import { SelectLanguageHeader } from "./SelectLanguageHeader";
import { NotificationHeader } from "./NotificationHeader";
import { toggleSidenav, useSideNavSelector } from "@/app/features/sideNavSlice";
import { useAppDispatch } from "@/app/hooks";

export function Header() {
    const { sideNavExtended } = useSideNavSelector();
    const dispatch = useAppDispatch();

    return (
        <header className="header border-b border-gray-200 dark:border-gray-700">
            <div className="header-wrapper h-16">
                <div className="header-action header-action-start">
                    <div className="header-action-item header-action-item-hoverable" onClick={() => dispatch(toggleSidenav())}>
                        <div className="text-2xl">
                            <TbMenu2 style={{ transform: sideNavExtended ? "rotate(0deg)" : "rotate(180deg)" }} size={20} />
                        </div>
                    </div>
                </div>
                <div className="header-action header-action-end">
                    <SelectLanguageHeader saveSelection />

                    <NotificationHeader />

                    <UserProfileHeader />
                </div>
            </div>
        </header>
    );
}
