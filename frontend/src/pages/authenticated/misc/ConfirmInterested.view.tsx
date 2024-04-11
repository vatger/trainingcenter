import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import useApi from "@/utils/hooks/useApi";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { TbCircleCheck, TbCircleX } from "react-icons/tb";
import { Card } from "@/components/ui/Card/Card";
import { TrainingRequestModel } from "@/models/TrainingRequestModel";
import dayjs from "dayjs";
import { Config } from "@/core/Config";
import { Link } from "react-router-dom";

export function ConfirmInterestedView() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    console.log(token);

    const { data, loading, loadingError } = useApi<TrainingRequestModel>({
        url: "/training-request/confirm-interest",
        data: {
            token: token,
        },
        method: "post",
    });

    return (
        <>
            <PageHeader title={"Weiteres Interesse Bestätigen"} hideBackLink />

            <Card>
                <RenderIf
                    truthValue={loading}
                    elementTrue={
                        <div className={"flex flex-col items-center"}>
                            <Spinner size={50} />
                            <p className={"mt-5"}>Warte bitte, bis deine Daten überprüft wurden...</p>
                        </div>
                    }
                    elementFalse={
                        <RenderIf
                            truthValue={loadingError == null}
                            elementTrue={
                                <div className={"flex flex-col items-center"}>
                                    <TbCircleCheck size={50} strokeWidth={1} className={"mx-auto text-success"} />
                                    <p className={"mt-5 text-center"}>
                                        Vielen Dank für das Bestätigen deiner Interesse. Die nächste Abfrage findet am{" "}
                                        <strong>{dayjs.utc(data?.expires).format(Config.DATE_FORMAT)}</strong> statt.
                                        <br />
                                        Du gelangst{" "}
                                        <Link to={`/training/request/${data?.uuid}?r`} className={"hover:underline hover:cursor-pointer text-primary"}>
                                            hier
                                        </Link>{" "}
                                        wieder zu deiner Anfrage.
                                    </p>
                                </div>
                            }
                            elementFalse={
                                <div className={"flex flex-col items-center"}>
                                    <TbCircleX size={50} strokeWidth={1} className={"mx-auto text-danger"} />
                                    <p className={"mt-5 text-center"}>
                                        Ein unbekannter Fehler ist aufgetreten. Versuche es bitte später erneut oder kontaktiere einen Mentoren.
                                    </p>
                                </div>
                            }
                        />
                    }
                />
            </Card>
        </>
    );
}
