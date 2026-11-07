export type SearchEntry = {
  title: string;
  permalink: string;
  excerpt: string;
  kind: string;
  searchText: string;
};

// Both search surfaces share the index, ranking, and recoverable request cache.
export function createSearchLoader(request = () => fetch('/search-index.json')) {
  let pending: Promise<SearchEntry[]> | undefined;
  return () => {
    pending ??= request()
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search index returned ${response.status}`);
        return await response.json() as SearchEntry[];
      })
      .catch((error) => {
        pending = undefined;
        throw error;
      });
    return pending;
  };
}

export const loadSearchIndex = createSearchLoader();

export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const normalized = query.trim().toLocaleLowerCase();
  const terms = normalized.split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return entries
    .filter((entry) => terms.every((term) => entry.searchText.includes(term)))
    .map((entry) => {
      const title = entry.title.toLocaleLowerCase();
      const score = terms.reduce((total, term) => total + (title.includes(term) ? 12 : 0), 0)
        + (title.startsWith(normalized) ? 20 : 0);
      return { entry, score };
    })
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map(({ entry }) => entry);
}
