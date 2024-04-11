import { ReactElement } from "react";

export type FileUploadProps = {
    accept: string[];
    isUploading: boolean;
    progress: number;
    disabled?: boolean;
    onSubmit?: (data: FormData) => any;
    success?: boolean;
    fileLimit?: number;
    customButtonIcon?: ReactElement;
    onFileChange?: (files: File[]) => any;
    customButtonText?: string;
    buttonIsSubmit?: boolean;
    inputName?: string;
};
