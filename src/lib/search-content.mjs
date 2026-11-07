export function searchableText(value = '') {
  return value
    // Keep code contents (including <hostname> placeholders), only strip fences.
    .replace(/^\s*(`{3,}|~{3,})[^\n]*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\((?:<[^>]*>|[^)]*)\)/g, '$1')
    .replace(/<\/?(?:img|div|span|p|a|br|iframe)\b[^>]*>/gi, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchSummary(body = '', fallback = '') {
  const prose = body
    .replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '')
    .replace(/^ {4}.+$/gm, '')
    .replace(/^\s*(?:#{1,6}\s|\||!\[|<img\b|[-*]\s|\d+\.\s).*$/gm, '')
    .replace(/^\s*[_*]+Note\b[^\n]*$/gm, '');
  const paragraphs = prose.split(/\n\s*\n/).map(searchableText).filter(Boolean);
  const summary = paragraphs.find((paragraph) => paragraph.length >= 45 && !paragraph.endsWith(':'))
    || paragraphs.find((paragraph) => paragraph.length >= 20)
    || searchableText(fallback);
  return summary.length > 220 ? `${summary.slice(0, 220).replace(/\s+\S*$/, '')}…` : summary;
}
