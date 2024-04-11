import { TbArrowLeft, TbLock } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button/Button";
import { COLOR_OPTS } from "../../assets/theme.config";
import { ConversionUtils } from "turbocommons-ts";
import { RenderIf } from "../../components/conditionals/RenderIf";

export function Error403() {
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(window.location.search);
    const m = ConversionUtils.base64ToString(urlParams.get("m") ?? "");
    const s = urlParams.get("s") != null;

    return (
        <>
            <div className="container relative z-10 mx-auto h-full">
                <div className="h-full flex flex-col items-center justify-center">
                    <TbLock size={60} />
                    <div className="mt-6 text-center">
                        <h3 className="mb-2">Zugang verweigert | 403</h3>
                        <p className="text-base">Du hast keine Berechtigung auf diese Seite/Aktion zuzugreifen.</p>

                        <RenderIf truthValue={m.length > 0} elementTrue={<pre className={"mt-4"}>{m.toUpperCase()}</pre>} />

                        <Button
                            className={"mt-7"}
                            variant={"twoTone"}
                            color={COLOR_OPTS.PRIMARY}
                            icon={<TbArrowLeft size={20} />}
                            onClick={() => navigate(s ? -1 : -2)}>
                            Zurück
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
