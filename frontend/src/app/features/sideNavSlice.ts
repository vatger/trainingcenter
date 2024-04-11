import { createSlice } from "@reduxjs/toolkit";
import { useAppSelector } from "@/app/hooks";
import { MOBILE_MAX_WIDTH_PX } from "@/assets/theme.config";

interface SideNavState {
    sideNavExtended: boolean;
}

const initialState: SideNavState = {
    sideNavExtended: window.innerWidth > MOBILE_MAX_WIDTH_PX,
};

export const sideNavSlice = createSlice({
    name: "sideNav",
    initialState,
    reducers: {
        toggleSidenav: state => {
            console.log("TOGGLING");
            state.sideNavExtended = !state.sideNavExtended;
        },
        closeSidenav: state => {
            console.log("A");
            state.sideNavExtended = false;
        },
        openSideNav: state => {
            console.log("B");
            state.sideNavExtended = true;
        },
    },
});

export const useSideNavSelector = () => useAppSelector(store => store.sideNavReducer);

export const { toggleSidenav, closeSidenav, openSideNav } = sideNavSlice.actions;

export default sideNavSlice.reducer;
