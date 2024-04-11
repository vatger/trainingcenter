export type SyslogModel = {
    id: number;
    user_id?: string;
    path: string;
    method: string;
    remote_addr?: string;
    message?: string;
    createdAt: Date;
    updatedAt?: Date;
};
