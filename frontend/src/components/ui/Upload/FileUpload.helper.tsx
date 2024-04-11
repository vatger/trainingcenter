import { AiOutlineFileImage, AiOutlineFileJpg, AiOutlineFilePdf, AiOutlineFileUnknown, AiOutlineFileZip } from "react-icons/ai";
import React from "react";

function fileImage(fileExt: string) {
    switch (fileExt.toLowerCase()) {
        case "jpg":
            return <AiOutlineFileJpg size={30} />;

        case "png":
            return <AiOutlineFileImage size={30} />;

        case "pdf":
            return <AiOutlineFilePdf size={30} />;

        case "zip":
            return <AiOutlineFileZip size={30} />;

        default:
            return <AiOutlineFileUnknown size={30} />;
    }
}

export default {
    fileImage,
};
