type MapArrayProps<T> = {
    data: T[];
    mapFunction: (value: T, index: number) => any;
};

export function MapArray<T>(props: MapArrayProps<T>) {
    return <>{props.data.map<T>(props.mapFunction)}</>;
}
