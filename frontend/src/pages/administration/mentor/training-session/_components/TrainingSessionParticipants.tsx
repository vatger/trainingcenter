import { Badge } from "@/components/ui/Badge/Badge";
import { COLOR_OPTS } from "@/assets/theme.config";
import { Separator } from "@/components/ui/Separator/Separator";
import { Table } from "@/components/ui/Table/Table";
import TSCParticipantListTypes from "@/pages/administration/mentor/training-session/session-create/_types/TSCParticipantList.types";
import { Card } from "@/components/ui/Card/Card";
import React, { Dispatch, useState } from "react";
import { UserFilter } from "@/components/ui/UserFilter/UserFilter";
import { IMinimalUser } from "@models/User";

interface ITrainingSessionParticipants {
    participants: IMinimalUser[];
    setParticipants: Dispatch<IMinimalUser[]>;
    submitting: boolean;
}

export function TrainingSessionParticipants({ participants, setParticipants, submitting }: ITrainingSessionParticipants) {
    function addUser(user: IMinimalUser) {
        setParticipants([...participants, user]);
    }

    return (
        <Card
            header={"Teilnehmer"}
            headerBorder
            className={"mt-5"}
            headerExtra={participants.length == 0 ? <Badge color={COLOR_OPTS.DANGER}>Mindestens ein Teilnehmer erforderlich</Badge> : undefined}>
            <UserFilter
                onUserSelect={addUser}
                removeIDs={participants.map(p => p.id)}
                description={
                    "Benutzer, die nicht in dem ausgewählten Kurs eingeschrieben sind werden nicht berücksichtigt und der Session entsprechend nicht hinzugefügt."
                }
            />

            <Separator />

            <Table paginate columns={TSCParticipantListTypes.getColumns(participants, setParticipants)} data={participants} />
        </Card>
    );
}
