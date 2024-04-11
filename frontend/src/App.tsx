import "./assets/styles/app.scss";
import { SideNav } from "./components/template/SideNav";
import { ContentContainer } from "./components/template/ContentContainer";
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { LoginView } from "./pages/login/Login.view";
import { LoginOverlay } from "./pages/login/LoginOverlay";
import { LoginCallbackView } from "./pages/login/LoginCallbackView";
import { AxiosInterceptors } from "./utils/network/AxiosInterceptors";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "@/routers/Router";
import LocalStorageLibrary from "@/utils/library/LocalStorageLibrary";

LocalStorageLibrary.init();

const toastSettings: ToastContainerProps = {
    position: "top-right",
    progressClassName: "rt_progress",
    autoClose: 2500,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "light",
    limit: 6,
};

function App() {
    return (
        <LoginOverlay>
            <BrowserRouter>
                <AxiosInterceptors />
                <ToastContainer {...toastSettings} />

                <Routes>
                    <Route path={"/login"} element={<LoginView />} />
                    <Route path={"/login/callback"} element={<LoginCallbackView />} />

                    <Route
                        path={"*"}
                        element={
                            <div
                                className="App flex flex-auto absolute top-0 left-0 w-full min-w-0 h-[100dvh] min-h-[100dvh] max-h-[100dvh]"
                                style={{ backgroundColor: "white" }}>
                                <SideNav />

                                <ContentContainer>
                                    <Router />
                                </ContentContainer>
                            </div>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </LoginOverlay>
    );
}

export default App;
