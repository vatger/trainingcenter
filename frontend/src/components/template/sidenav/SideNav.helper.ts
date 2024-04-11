import { MOBILE_MAX_WIDTH_PX } from "@/assets/theme.config";
import { store } from "@/app/store";
import { closeSidenav, openSideNav } from "@/app/features/sideNavSlice";

export function handleResize(prevWidth: number) {
    const iw = window.innerWidth;
    const pw = prevWidth;

    const navContainer = document.getElementById("nav-container");
    if (navContainer == null) return;

    const sideNavExtended = navContainer.hasAttribute("extended");

    if (sideNavExtended && iw - pw < 0 && iw < MOBILE_MAX_WIDTH_PX) {
        console.log("closing");
        navContainer.removeAttribute("extended");
        store.dispatch(closeSidenav());
        return;
    }

    if (!sideNavExtended && iw >= MOBILE_MAX_WIDTH_PX && pw < MOBILE_MAX_WIDTH_PX) {
        console.log("extending");
        navContainer.setAttribute("extended", "true");
        store.dispatch(openSideNav());
        return;
    }
}
