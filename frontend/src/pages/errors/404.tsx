import { TbArrowLeft, TbZoomQuestion } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button/Button";
import { COLOR_OPTS } from "../../assets/theme.config";

export function Error404(props: { path: string }) {
    const navigate = useNavigate();

    return (
        <>
            <div className="container error-container relative z-10 mx-auto h-full overflow:hidden">
                <div className="h-full flex flex-col items-center justify-center">
                    <TbZoomQuestion size={60} />
                    <div className="mt-6 text-center">
                        <h3 className="mb-2">Seite nicht gefunden | 404</h3>
                        <p className="text-base">Diese Seite scheint nicht zu existieren.</p>

                        <pre className={"mt-4"}>{props.path}</pre>

                        <Button className={"mt-7"} variant={"twoTone"} color={COLOR_OPTS.PRIMARY} icon={<TbArrowLeft size={20} />} onClick={() => navigate(-1)}>
                            Zurück
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
