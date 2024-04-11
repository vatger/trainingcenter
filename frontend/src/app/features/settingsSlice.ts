import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "@/app/hooks";

export type TLanguage = "de" | "en";
export type TColorScheme = "dark" | "light";
export type TSelectedColorScheme = "auto" | "dark" | "light";

interface SettingsState {
    language: TLanguage;
    colorScheme: TColorScheme;
    selectedColorScheme: TSelectedColorScheme;
}

const initialState: SettingsState = {
    language: "de",
    colorScheme: "light",
    selectedColorScheme: "auto",
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setColorScheme: (state, action: PayloadAction<TColorScheme>) => {
            state.colorScheme = action.payload;
        },
        setSelectedColorScheme: (state, action: PayloadAction<TSelectedColorScheme>) => {
            state.selectedColorScheme = action.payload;
        },
        setLanguage: (state, action: PayloadAction<TLanguage>) => {
            state.language = action.payload;
        },
    },
});

export const useSettingsSelector = () => useAppSelector(store => store.settingsReducer);

export const { setColorScheme, setSelectedColorScheme, setLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;
