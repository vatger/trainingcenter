import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import { Card } from "@/components/ui/Card/Card";
import React, { useState } from "react";
import useApi from "@/utils/hooks/useApi";
import { TrainingTypeModel } from "@/models/TrainingTypeModel";

interface CalendarResponseT {
    date: string;
    training_type: TrainingTypeModel;
    course_name: string;
}

export function TrainingSessionCalendar() {
    const [events, setEvents] = useState<any[]>([]);

    useApi<CalendarResponseT[]>({
        url: "/administration/training-session/all-upcoming",
        method: "get",
        onLoad: data => {
            const evts = data?.map(d => ({
                title: `${d.training_type.name} | ${d.training_type.type}`,
                start: dayjs.utc(d.date).toDate(),
                end: dayjs.utc(d.date).add(2, "hours").toDate(),
            }));

            setEvents(evts);
        },
    });

    return (
        <Card className={"mt-5"}>
            <div style={{ height: 1000 }}>
                <Calendar
                    defaultDate={dayjs.utc().toDate()}
                    localizer={dayjsLocalizer(dayjs)}
                    formats={{
                        timeGutterFormat: "HH:mm",
                        eventTimeRangeFormat: ({ start, end }) => {
                            return `${dayjs.utc(start).format("HH:mm")} - ${dayjs.utc(end).format("HH:mm")}`;
                        },
                    }}
                    popup={true}
                    events={events}
                    views={[Views.WEEK, Views.DAY]}
                    defaultView={Views.WEEK}
                    step={60}
                />
            </div>
        </Card>
    );
}
