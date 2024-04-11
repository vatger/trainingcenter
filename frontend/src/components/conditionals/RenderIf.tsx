import { ReactElement } from "react";

type RenderIfProps = {
    truthValue: boolean;
    elementTrue: ReactElement | ReactElement[] | string;
    elementFalse?: ReactElement | ReactElement[] | string;
};

export function RenderIf(props: RenderIfProps) {
    if (props.truthValue) {
        return <>{props.elementTrue}</>;
    }

    return <>{props.elementFalse}</>;
}
