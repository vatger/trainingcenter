import { Request } from "express";
import { Config } from "../../core/Config";
import { generateUUID } from "../../utility/UUID";
import File from "express-fileupload";

function _renameFile(file: File.UploadedFile) {
    const fileName = generateUUID() + "." + file.name.split(".").pop();

    // Move file to correct Location
    file.mv(Config.FILE_STORAGE_LOCATION + fileName, (err: any) => {
        if (err) throw err;
    });

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

    let files = request.files.files;
    if (Array.isArray(files)) {
        for (const file of files) {
            fileNames.push(_renameFile(file));
        }
    } else {
        fileNames.push(_renameFile(files));
    }

    return fileNames;
}
