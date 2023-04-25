import { Request } from "express";
import { Config } from "../../core/Config";
import { UploadedFile } from "express-fileupload";
import { generateUUID } from "../../utility/UUID";

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

    let files: UploadedFile[] | UploadedFile;
    if (Array.isArray(request.files?.files)) {
        files = request.files.files;
        files.forEach(file => {
            const fileName = generateUUID() + "." + file.name.split(".").pop();
            fileNames.push(fileName);

            // Move file to correct Location
            file.mv(Config.FILE_STORAGE_LOCATION + fileName, (err: any) => {
                if (err) throw err;
            });
        });
    } else {
        files = request.files?.files ?? ({} as UploadedFile);

        const fileName = generateUUID() + "." + files.name.split(".").pop();
        fileNames.push(fileName);

        files.mv(Config.FILE_STORAGE_LOCATION + fileName, (err: any) => {
            if (err) throw err;
        });
    }

    return fileNames;
}
