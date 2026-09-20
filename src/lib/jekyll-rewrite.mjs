/**
 * Rewrite leftover Jekyll/Liquid in markdown without touching Angular `{{ }}`.
 * Plain JS so Node 20 tests can import it without a TypeScript loader.
 */
export function rewriteJekyllMarkdown(input) {
  return String(input)
    .replace(/\{%\s*raw\s*%\}\s*/g, '')
    .replace(/\s*\{%\s*endraw\s*%\}/g, '')
    .replace(/\{\{\s*"([^"]+)"\s*\|\s*absolute_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*'([^']+)'\s*\|\s*absolute_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*"([^"]+)"\s*\|\s*relative_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*'([^']+)'\s*\|\s*prepend:\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '/$2$1')
    .replace(/\{\{\s*base_path\s*\}\}/g, '')
    .replace(/\{\{\s*site\.url\s*\}\}/g, 'https://arshadmehmood.com')
    .replace(/^\{:\s*[^}]+\}\s*$/gm, '')
    .replace(/\s*\{:\s*[^}]+\}\s*$/gm, '');
}
