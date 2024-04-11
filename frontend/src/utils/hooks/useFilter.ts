import { useEffect, useState } from "react";

/**
 * Uses a user defined filter function to filter the provided data.
 * This can be used, for example, when filtering courses, users, ...
 * @param data - Array of all elements to apply filter to
 * @param searchValue - Non debounced list value
 * @param debouncedSearchValue - Debounced list value
 * @param filterFunction - Filter function
 * @param noEntriesIfSearchEmpty - Returns an empty array if no list value is provided
 */
export function useFilter<T>(
    data: T[],
    searchValue: string,
    debouncedSearchValue: string,
    filterFunction: (element: T, searchValue: string) => boolean,
    noEntriesIfSearchEmpty?: boolean
): T[] {
    const [filteredData, setFilteredData] = useState<T[]>(data);

    useEffect(() => {
        // Default, if no list result was entered
        if (searchValue.length == 0) {
            // If true
            if (noEntriesIfSearchEmpty) {
                // Set filtered Data to an empty array
                setFilteredData([]);
            } else {
                // Set to all (unfiltered) data
                setFilteredData(data);
            }

            return;
        }

        // If the searchValue is not equal to the debouncedValue, then the user is currently entering text
        // and the debounced value is still catching up
        if (searchValue != debouncedSearchValue) {
            return;
        }

        // Filter according to the provided predicate
        const filtered: T[] = data.filter((value: T) => {
            return filterFunction(value, debouncedSearchValue);
        });

        // Set the filtered Data
        setFilteredData(filtered);

        // Filter by data.length, since we can otherwise run into some issues with infinite loops :)
    }, [searchValue, debouncedSearchValue, data.length]);

    return filteredData;
}
