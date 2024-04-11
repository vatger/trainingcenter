import { ReactElement } from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { AuthLoadingView } from "@/pages/login/_partials/AuthLoadingView";
import { useAuthSelector } from "@/app/features/authSlice";

export function LoginOverlay(props: { children: ReactElement | ReactElement[] }) {
    const user = useAuthSelector();

    return (
        <>
            <RenderIf truthValue={!user.signedIn && !window.location.href.includes("login")} elementTrue={<AuthLoadingView />} elementFalse={props.children} />
        </>
    );
}
