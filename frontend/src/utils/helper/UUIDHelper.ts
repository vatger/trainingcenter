import { v4 as UUIDv4, validate as isUUIDValid } from "uuid";

export function validateUUID(uuid: string): boolean {
    return isUUIDValid(uuid);
}

export function generateUUID() {
    return UUIDv4();
}
