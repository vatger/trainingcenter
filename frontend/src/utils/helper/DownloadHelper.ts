import { axiosInstance } from "@/utils/network/AxiosInstance";
import { ResponseType } from "axios";

async function downloadFile(url: string, filename: string, responseType: ResponseType = "json"): Promise<void> {
    const res = await axiosInstance.get(url, { timeout: 60_000, responseType: responseType });

    const contentType = res.headers["content-type"] as string | undefined;
    if (contentType == undefined) return;

    let blob;
    if (contentType.includes("application/json")) {
        blob = new Blob([JSON.stringify(res.data)], { type: contentType });
    } else {
        blob = new Blob([res.data], { type: contentType });
    }

    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    return;
}

export default {
    downloadFile,
};
