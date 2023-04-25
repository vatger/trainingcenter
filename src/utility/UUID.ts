import { validate as isUUIDValid } from "uuid";
import { v4 as UUIDv4 } from "uuid";

export function validateUUID(uuid: string): boolean {
    return isUUIDValid(uuid);
}

export function generateUUID() {
    return UUIDv4();
}
