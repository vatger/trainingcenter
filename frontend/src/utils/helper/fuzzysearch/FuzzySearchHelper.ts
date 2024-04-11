import FuzzySearch from "fuzzy-search";

export function fuzzySearch(searchString: string, targetString: string[] | any[]) {
    const searcher = new FuzzySearch(targetString);

    return searcher.search(searchString);
}
