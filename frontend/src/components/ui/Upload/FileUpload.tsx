import { TbCheck, TbUpload, TbX } from "react-icons/tb";
import React, { ChangeEvent, useEffect, useState } from "react";
import { MapArray } from "../../conditionals/MapArray";
import prettyBytes from "pretty-bytes";
import { RenderIf } from "../../conditionals/RenderIf";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { FileUploadProps } from "./FileUpload.props";
import FileUploadHelper from "./FileUpload.helper";
import ToastHelper from "@/utils/helper/ToastHelper";

export function FileUpload(props: FileUploadProps) {
    const [isHover, setIsHover] = useState<boolean>(false);
    const [fileList, setFileList] = useState<File[] | undefined>(undefined);

    function _fileExistsInList(fileName: string, fileList: File[]) {
        for (const file of fileList) {
            if (fileName == file.name) return true;
        }

        return false;
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        let files: File[] = [...(fileList ?? [])];

        const target = e.target;
        if (target.files == null) return;

        for (const file of target.files) {
            // These are the files we want to add to our list
            let exists = _fileExistsInList(file.name, files);

            if (!props.accept.includes(file.name.split(".")[1].toLowerCase())) {
                ToastHelper.error(`Dieser Dateityp wird nicht unterstützt. Möglich sind: ${props.accept.join(", ")}`);
                continue;
            }

            if (files.length >= (props.fileLimit ?? 5)) continue;
            if (!exists) files.push(file);
        }

        setFileList(files);
        props.onFileChange?.(files);
    }

    function removeFile(fileName: string) {
        let files: File[] = [...(fileList ?? [])];

        files = files.filter(file => {
            return file.name != fileName;
        });

        setFileList(files);
        props.onFileChange?.(files);
    }

    useEffect(() => {
        if (props.success) {
            setFileList([]);
            props.onFileChange?.([]);
        }
    }, [props.success]);

    return (
        <>
            <div
                className={`upload mt-3 upload-draggable transition-all ${isHover ? "border-indigo-600 bg-indigo-50" : ""} ${
                    props.disabled || props.isUploading || (props.fileLimit ?? 999) == fileList?.length
                        ? "disabled"
                        : "hover:border-indigo-600 hover:bg-indigo-50 dark:hover:border-indigo-600 dark:hover:bg-indigo-900"
                } ${props.success ? "border-emerald-500" : ""}`}>
                <input
                    readOnly={(props.disabled || props.isUploading || (props.fileLimit ?? 999) == fileList?.length) ?? false}
                    onDragEnter={() => setIsHover(true)}
                    onDragExit={() => setIsHover(false)}
                    onInput={() => {
                        setIsHover(false);
                    }}
                    onChange={handleFileChange}
                    className="upload-input draggable"
                    type="file"
                    name={props.inputName}
                    accept={props.accept.map(v => `.${v}`).join(",")}
                    multiple
                />
                <div className="my-10 text-center">
                    <div className="text-6xl mb-4 flex justify-center">
                        <RenderIf
                            truthValue={props.success ?? false}
                            elementTrue={<TbCheck className={"text-success"} size={30} />}
                            elementFalse={<TbUpload className={"text-primary"} size={30} />}
                        />
                    </div>

                    <RenderIf
                        truthValue={props.success ?? false}
                        elementTrue={<p className="font-semibold text-success">Dateien erfolgreich hochgeladen!</p>}
                        elementFalse={
                            <>
                                <p className="font-semibold text-gray-800 dark:text-white">
                                    Drop your image here, or click to browse {props.fileLimit ? `(${fileList?.length ?? 0}/${props.fileLimit})` : ""}
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white">File Formats: {props.accept.map(v => `.${v}`).join(",")}</p>
                            </>
                        }
                    />
                </div>
            </div>

            <RenderIf
                truthValue={(props.isUploading ?? false) && props.progress != null}
                elementTrue={<ProgressBar className={"mt-3"} value={props.progress ?? 0} />}
                elementFalse={
                    <div className="upload-file-list">
                        <MapArray
                            data={Array.from(fileList ?? [])}
                            mapFunction={(value: File, index) => {
                                return (
                                    <div key={index} className="upload-file">
                                        <div className="flex">
                                            <div className="upload-file-thumbnail">{FileUploadHelper.fileImage(value.name.split(".").pop() ?? "pdf")}</div>
                                            <div className="upload-file-info">
                                                <h6 className="upload-file-name">{value.name}</h6>
                                                <span className="upload-file-size">{prettyBytes(value.size)}</span>
                                            </div>
                                        </div>
                                        {!props.isUploading && (
                                            <span
                                                onClick={() => {
                                                    removeFile(value.name);
                                                }}
                                                className="close-btn close-btn-default upload-file-remove"
                                                role="button">
                                                <TbX size={20} />
                                            </span>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </div>
                }
            />
        </>
    );
}
