import { AlertProps } from "./Alert.props";
import { TwoToneColors } from "../../../assets/styles/ColorMap";
import { joinClassNames } from "../../../utils/helper/ClassNameHelper";
import { getAlertIcon } from "./Alert.helper";
import { TbX } from "react-icons/tb";
import { useState } from "react";

export function Alert(props: AlertProps) {
    const [visible, setVisible] = useState<boolean>(true);

    const alertDefaultClass = "p-4 relative flex justify-between";
    const colors = TwoToneColors[props.type];

    const classes = joinClassNames(
        "alert",
        alertDefaultClass,
        colors.backgroundColor,
        colors.textColor,
        props.shadow ? "card-shadow" : "",
        props.rounded ? "rounded-lg" : "",
        props.className ?? ""
    );

    function handleClose(e: any) {
        setVisible(false);
        props.onClose?.();
    }

    const renderClose = () => {
        return (
            <div className="cursor-pointer my-auto" onClick={e => handleClose(e)}>
                {<TbX size={20} />}
            </div>
        );
    };

    return (
        <div className={classes + (visible ? "" : " hidden")}>
            <div className={`flex ${props.title ? "" : "items-center"}`}>
                <div className={"flex justify-center"}>{props.showIcon && getAlertIcon(props)}</div>
                <div className={props.showIcon ? "ml-3" : ""}>
                    {props.title ? <div className={`font-semibold mb-1 ${colors.titleColor}`}>{props.title}</div> : null}
                    {props.children}
                </div>
            </div>
            <div className={"flex justify-center"}>{props.closeable ? renderClose() : null}</div>
        </div>
    );
}
