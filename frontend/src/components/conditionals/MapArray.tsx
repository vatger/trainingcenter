import { ReactElement } from "react";

type MapArrayProps<T> = {
    data: T[];
    mapFunction: (value: T, index: number) => ReactElement | ReactElement[];
};

export function MapArray(props: MapArrayProps<any>) {
    return <>{props.data.map(props.mapFunction)}</>;
}
