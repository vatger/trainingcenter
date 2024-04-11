import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React, { useEffect, useState } from "react";
import { RenderIf } from "@/components/conditionals/RenderIf";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useSettingsSelector } from "@/app/features/settingsSlice";
import { AxiosError } from "axios";
import { Alert } from "@/components/ui/Alert/Alert";
import { TYPE_OPTS } from "@/assets/theme.config";
import { Card } from "@/components/ui/Card/Card";
import useApi from "@/utils/hooks/useApi";

function findRatingTimes(data: any) {
    let times: any[] = [];

    const ratings = ["s1", "s2", "s3", "c1", "c3"];

    for (const key of Object.keys(data)) {
        const time = Math.round(Number(data[key]));

        if (!ratings.includes(key) || (time == 0 && key == "c3")) continue;

        times.push({
            name: key.toUpperCase(),
            time: time,
        });
    }

    return times;
}

export function RatingTimesPartial() {
    const colorScheme = useSettingsSelector().colorScheme;

    const [chartData, setChartData] = useState<any[]>([]);

    const { data, loadingError } = useApi<any>({
        url: "/statistics/rating-times",
        method: "get",
        onLoad: value => {
            setChartData(findRatingTimes(value));
        },
    });

    return (
        <Card header={"Lotsenstunden nach Rating"} headerBorder>
            <RenderIf
                truthValue={loadingError != null}
                elementTrue={
                    <Alert type={TYPE_OPTS.WARNING} showIcon rounded>
                        Es ist leider aktuell nicht möglich deine Lotsenstatistiken abzurufen. Versuche es später erneut.
                    </Alert>
                }
                elementFalse={
                    <RenderIf
                        truthValue={data == null}
                        elementTrue={
                            <div className={"flex justify-center mx-auto"}>
                                <Spinner size={35} />
                            </div>
                        }
                        elementFalse={
                            <ResponsiveContainer height={240} width={"100%"}>
                                <BarChart data={chartData}>
                                    <CartesianGrid opacity={colorScheme == "dark" ? 0.3 : 0.8} strokeDasharray="5 5" />
                                    <XAxis stroke={colorScheme == "dark" ? "white" : ""} dataKey="name" />
                                    <YAxis stroke={colorScheme == "dark" ? "white" : ""} />
                                    <Tooltip cursor={{ opacity: colorScheme == "dark" ? 0.1 : 0.4 }} />
                                    <Bar dataKey="time" name={"Zeit (Std)"} fill="rgb(99 102 241)" opacity={0.75} />
                                </BarChart>
                            </ResponsiveContainer>
                        }
                    />
                }
            />
        </Card>
    );
}
