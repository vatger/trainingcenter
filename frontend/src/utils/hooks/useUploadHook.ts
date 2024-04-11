import { useState } from "react";
import { AxiosProgressEvent } from "axios";
import { Config } from "@/core/Config";

export function useUploadHook() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    function onUploadProgress(e: AxiosProgressEvent) {
        if (!e.progress) return;
        const progress = e.progress * 100;

        setUploadProgress(progress);
        setIsUploading(uploadProgress > 0 && uploadProgress != 100);

        if (progress == 100) {
            setTimeout(() => {
                resetUpload();
            }, Config.SHOW_SUCCESS_TIMEOUT);
        }
    }

    function resetUpload() {
        setUploadProgress(0);
    }

    return {
        uploadProgress,
        onUploadProgress,
        files,
        setFiles,
        isUploading,
        resetUpload,
    };
}
