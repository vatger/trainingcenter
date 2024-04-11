import { Request } from "express";
import { Config } from "../../core/Config";
import { generateUUID } from "../../utility/UUID";
import fs from "fs";

function _renameFile(file: Express.Multer.File) {
    const fileName = generateUUID() + "." + file.originalname.split(".").pop();

    fs.renameSync(Config.FILE_TMP_LOCATION + file.filename, Config.FILE_STORAGE_LOCATION + fileName);

    return fileName;
}

/**
 * Handles the upload and returns the name of the newly created file.
 * If there are multiple files, these will be returned in an array.
 * @param request
 * @throws Error
 */
export function handleUpload(request: Request): string[] | null {
    let fileNames: string[] = [];

    // Check if files were supplied
    if (request.files == null || Object.keys(request.files).length == 0) return null;

    let files = request.files;
    if (Array.isArray(files)) {
        for (const file of files) {
            fileNames.push(_renameFile(file));
        }
    }

    return fileNames;
}
