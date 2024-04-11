import { useEffect, useRef } from "react";
import { generateUUID } from "@/utils/helper/UUIDHelper";

export function useDropdown() {
    const dropdownUUID = useRef(generateUUID());

    function toggleDropdown(e: MouseEvent) {
        if (e.button !== 0) return;

        const click_div = document.getElementById(`dropdown-toggle-${dropdownUUID.current}`);
        const dropdown = document.getElementById(`dropdown-${dropdownUUID.current}`);
        if (dropdown == null || click_div == null) return;

        const showNotificationMenu = !dropdown.classList.contains("hidden");

        const target = e.target as Node;

        if (showNotificationMenu && click_div.contains(target)) {
            dropdown.classList.add("hidden");
            dropdown.classList.remove("dropdown-expand");
            return;
        }

        if (showNotificationMenu && !dropdown.contains(target) && !click_div.contains(target)) {
            dropdown.classList.add("hidden");
            dropdown.classList.remove("dropdown-expand");
            return;
        }

        if (!showNotificationMenu && click_div.contains(target)) {
            dropdown.classList.remove("hidden");
            dropdown.classList.add("dropdown-expand");
            return;
        }
    }

    useEffect(() => {
        document.addEventListener("click", toggleDropdown);
        return () => {
            document.removeEventListener("click", toggleDropdown);
        };
    }, []);

    return dropdownUUID;
}
