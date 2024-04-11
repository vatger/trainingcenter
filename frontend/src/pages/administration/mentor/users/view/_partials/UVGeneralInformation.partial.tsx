import { UserModel } from "@/models/UserModel";
import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS, SIZE_OPTS } from "@/assets/theme.config";
import { Input } from "@/components/ui/Input/Input";
import { getAtcRatingLong, getAtcRatingShort } from "@/utils/helper/vatsim/AtcRatingHelper";
import { Button } from "@/components/ui/Button/Button";
import { TbChevronsRight, TbNote } from "react-icons/tb";
import { Card } from "@/components/ui/Card/Card";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getPilotRatingLong, getPilotRatingShort } from "@/utils/helper/vatsim/PilotRatingHelper";
import { Separator } from "@/components/ui/Separator/Separator";

export function UVGeneralInformationPartial({ user }: { user?: UserModel }) {
    const navigate = useNavigate();

    return (
        <Card
            header={"Allgemeine Informationen"}
            headerBorder
            headerExtra={user?.user_data?.subdivision_code?.toLowerCase() !== "ger" ? <Badge color={COLOR_OPTS.PRIMARY}>Gast</Badge> : <></>}>
            <div className={"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"}>
                <Input label={"Name"} labelSmall disabled value={`${user?.first_name} ${user?.last_name} (${user?.id})`} />

                <Input
                    label={"ATC Rating"}
                    labelSmall
                    disabled
                    value={`${getAtcRatingShort(user?.user_data?.rating_atc ?? -1)} (${getAtcRatingLong(user?.user_data?.rating_atc ?? -1)})`}
                />

                <Input
                    label={"Piloten Rating"}
                    labelSmall
                    disabled
                    value={`${getPilotRatingShort(user?.user_data?.rating_pilot ?? -1)} (${getPilotRatingLong(user?.user_data?.rating_pilot ?? -1)})`}
                />

                <Input label={"Region"} labelSmall disabled value={`${user?.user_data?.region_name} (${user?.user_data?.region_code})`} />

                <Input label={"Division"} labelSmall disabled value={`${user?.user_data?.division_name} (${user?.user_data?.division_code})`} />

                <Input
                    label={"Subdivision"}
                    labelSmall
                    disabled
                    value={user?.user_data?.subdivision_code ? `${user?.user_data?.subdivision_name} (${user?.user_data?.subdivision_code})` : "N/A"}
                />
            </div>

            <Separator />

            <div className={"flex flex-col lg:flex-row"}>
                <Button
                    icon={<TbChevronsRight size={20} />}
                    size={SIZE_OPTS.SM}
                    onClick={() => navigate("fast-track")}
                    variant={"twoTone"}
                    color={COLOR_OPTS.PRIMARY}>
                    Fast-Track Beantragen
                </Button>

                <Button
                    className={"mt-3 lg:mt-0 lg:ml-3"}
                    icon={<TbNote size={20} />}
                    size={SIZE_OPTS.SM}
                    onClick={() => navigate("notes")}
                    variant={"twoTone"}
                    color={COLOR_OPTS.PRIMARY}>
                    Notizen
                </Button>
            </div>
        </Card>
    );
}
