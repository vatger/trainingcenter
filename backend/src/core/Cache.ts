import NodeCache from "node-cache";

const cacheOptions: NodeCache.Options = {
    stdTTL: 60 * 60 * 24,
};

export const localCache: NodeCache = new NodeCache(cacheOptions);
