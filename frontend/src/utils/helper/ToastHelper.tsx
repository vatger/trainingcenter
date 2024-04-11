import { Id, toast, ToastOptions, UpdateOptions } from "react-toastify";
import { TbCircleCheck, TbCircleX } from "react-icons/tb";
import { Spinner } from "@/components/ui/Spinner/Spinner";

/**
 * Used for updating
 * @param content
 */
function getSuccessUpdateOptions(content: string): UpdateOptions {
    return {
        type: "success",
        render: content,
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        icon: <TbCircleCheck size={24} className={"text-success"} />,
    };
}

/**
 * Used for updating
 * @param content
 */
function getErrorUpdateOptions(content: string): UpdateOptions {
    return {
        type: "error",
        render: content,
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        icon: <TbCircleX size={24} className={"text-danger"} />,
    };
}

/**
 * Used for updating
 * @param content
 */
function loading(content: string) {
    return toast.loading(content, {
        icon: <Spinner size={20} borderWidth={2} />,
        closeOnClick: true,
        pauseOnHover: true,
    });
}

function update(id: Id, options?: UpdateOptions) {
    toast.update(id, options);
}

//////////////////////////
//// NO MORE UPDATING ////
//////////////////////////

function success(content: string, options?: ToastOptions) {
    const updateOptions = getSuccessUpdateOptions(content);
    toast.success(content, options ?? (updateOptions as ToastOptions));
}

function error(content: string, options?: ToastOptions) {
    const updateOptions = getErrorUpdateOptions(content);
    toast.success(content, options ?? (updateOptions as ToastOptions));
}

export default {
    loading,
    update,
    success,
    error,
    getSuccessUpdateOptions,
    getErrorUpdateOptions,
};
