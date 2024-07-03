import { E_VATSIM_RATING } from "./AtcRatingHelper";

export enum EEnrolRequirementType {
    MIN_RATING,
    EXACT_RATING,
    MAX_RATING,
    MIN_HOURS_STATION,
}

export interface ICourseEnrolRequirement {
    type: EEnrolRequirementType;
    value: string | number | null;
    parameters?: any;
}

interface BaseRequirement {
    type: EEnrolRequirementType;
    active: boolean;
    title: string;
    value: {
        type: string;
        label: string;
    };
}

export interface SelectRequirement extends BaseRequirement {
    value: {
        type: "select";
        select_options: E_VATSIM_RATING[];
        label: "ATC Rating";
    };
    parameters: {
        id: string;
        name: string;
        description: string;
        input: {
            type: string;
            input_type: string;
            input_placeholder: string;
            label: string;
            description: string;
        };
    }[];
}

export interface InputRequirement extends BaseRequirement {
    value: {
        type: "input";
        input_placeholder: string;
        label: "Mindeststunden";
    };
    parameters: {
        id: string;
        name: string;
        description: string;
        input: {
            type: string;
            input_placeholder: string;
            label: string;
            description: string;
        };
    }[];
}

type EnrolRequirement = SelectRequirement | InputRequirement;

export const EnrolRequirementOptions: EnrolRequirement[] = [
    {
        type: EEnrolRequirementType.MIN_RATING,
        active: true,
        title: "Mindestrating",
        value: {
            type: "select",
            select_options: [E_VATSIM_RATING.OBS, E_VATSIM_RATING.S1, E_VATSIM_RATING.S2, E_VATSIM_RATING.S3, E_VATSIM_RATING.C1],
            label: "ATC Rating",
        },
        parameters: [],
    },
    {
        type: EEnrolRequirementType.MAX_RATING,
        active: true,
        title: "Höchstrating",
        value: {
            type: "select",
            select_options: [E_VATSIM_RATING.OBS, E_VATSIM_RATING.S1, E_VATSIM_RATING.S2, E_VATSIM_RATING.S3, E_VATSIM_RATING.C1],
            label: "ATC Rating",
        },
        parameters: [],
    },
    {
        type: EEnrolRequirementType.EXACT_RATING,
        active: true,
        title: "Rating Entspricht",
        value: {
            type: "select",
            select_options: [E_VATSIM_RATING.OBS, E_VATSIM_RATING.S1, E_VATSIM_RATING.S2, E_VATSIM_RATING.S3, E_VATSIM_RATING.C1],
            label: "ATC Rating",
        },
        parameters: [],
    },
    {
        type: EEnrolRequirementType.MIN_HOURS_STATION,
        active: false,
        title: "Mindeststunden einer Position",
        value: {
            type: "input",
            input_placeholder: "10",
            label: "Mindeststunden",
        },
        parameters: [
            {
                id: "_atc_station_regex",
                name: "ATC-Station",
                description: "Regex erlaubt",
                input: {
                    type: "input",
                    input_placeholder: "EDDF_*_TWR",
                    label: "Station",
                    description: "Regex erlaubt",
                },
            },
        ],
    },
];
