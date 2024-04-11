export type TrainingLogTemplateModel = {
    id: number;
    name: string;
    content: object | object[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type LogTemplateElement = LogTemplateElementRating | LogTemplateElementTextarea | LogTemplateElementSection;
export type LogTemplateType = "rating" | "textarea" | "section";

export type LogTemplateElementRating = {
    type: LogTemplateType;
    max: number;
    title: string;
    subtitle?: string;

    disableText?: boolean;

    value?: number;
    text_content?: string;
};

export type LogTemplateElementTextarea = {
    type: LogTemplateType;
    title: string;
    subtitle?: string;

    text_content?: string;
};

export type LogTemplateElementSection = {
    type: LogTemplateType;
    title?: string;
};
