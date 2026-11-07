import type { SearchEntry } from './search';

const resultLabel = (kind: string) => ({
  post: 'Post', til: 'Today I Learned', portfolio: 'Portfolio', page: 'Page', listing: 'Page',
})[kind] ?? 'Page';

function highlight(node: HTMLElement, value: string, query: string) {
  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!escaped.length) {
    node.textContent = value;
    return;
  }
  for (const part of value.split(new RegExp(`(${escaped.join('|')})`, 'gi'))) {
    if (terms.includes(part.toLocaleLowerCase())) {
      const mark = document.createElement('mark');
      mark.textContent = part;
      node.append(mark);
    } else {
      node.append(document.createTextNode(part));
    }
  }
}

export function createSearchResult(entry: SearchEntry, query: string, optionId?: string) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = entry.permalink;
  if (optionId) {
    // The link itself is the option: there is no nested interactive control.
    item.setAttribute('role', 'presentation');
    link.id = optionId;
    link.setAttribute('role', 'option');
    link.setAttribute('aria-selected', 'false');
    link.tabIndex = -1;
  }
  const copy = document.createElement('span');
  copy.className = 'search-result-copy';
  const meta = document.createElement('span');
  meta.className = 'search-result-kind';
  meta.textContent = resultLabel(entry.kind);
  const title = document.createElement('strong');
  highlight(title, entry.title, query);
  copy.append(meta, title);
  if (entry.excerpt) {
    const excerpt = document.createElement('p');
    excerpt.textContent = entry.excerpt;
    copy.append(excerpt);
  }
  const arrow = document.createElement('span');
  arrow.className = 'search-result-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  link.append(copy, arrow);
  item.append(link);
  return item;
}
