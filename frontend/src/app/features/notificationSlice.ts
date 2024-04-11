import { NotificationModel } from "@/models/NotificationModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/network/AxiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { useAppSelector } from "@/app/hooks";
import { AppDispatch } from "@/app/store";

interface NotificationState {
    notifications: NotificationModel[];
    unreadNotifications: NotificationModel[];
    loadingNotifications: boolean;
}

const initialState: NotificationState = {
    notifications: [],
    unreadNotifications: [],
    loadingNotifications: true,
};

export const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<NotificationModel[]>) => {
            state.notifications = action.payload;
            state.unreadNotifications = action.payload.filter(n => !n.read);
            state.loadingNotifications = false;
        },
        clearUnreadNotifications: state => {
            state.notifications = state.notifications.map(n => ({ ...n, read: true }));
            state.unreadNotifications = [];
        },
    },
});

export function loadNotifications(dispatch: AppDispatch) {
    axiosInstance
        .get("/notification")
        .then((res: AxiosResponse) => {
            dispatch(setNotifications(res.data as NotificationModel[]));
        })
        .catch((err: AxiosError) => {
            console.error("Failed to update Notifications");
        });
}

export const useNotificationSelector = () => useAppSelector(store => store.notificationReducer);

export const { setNotifications, clearUnreadNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
