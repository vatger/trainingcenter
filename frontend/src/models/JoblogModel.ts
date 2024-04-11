export type JoblogModel = {
    id: number;
    uuid: string;
    attempts: number;
    status: "queued" | "failed" | "completed";
    payload?: string;
    job_type: "email";
    available_at: Date;
    last_executed: Date;
    createdAt: Date;
    updatedAt?: Date;
};
