import { Route, Routes } from "react-router-dom";
import React from "react";
import { Overview } from "@/pages/authenticated/overview/Overview";
import { AdministrationRouter } from "@/routers/AdministrationRouter";
import { UserRouter } from "@/routers/UserRouter";

export function Router() {
    return (
        <Routes>
            <Route index path={"/"} element={<Overview />} />

            <Route path={"administration/*"} element={<AdministrationRouter />} />
            <Route path={"*"} element={<UserRouter />} />
        </Routes>
    );
}
