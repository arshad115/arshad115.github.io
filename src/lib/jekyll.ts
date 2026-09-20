/**
 * Rewrite leftover Jekyll/Liquid in markdown without touching Angular `{{ }}` examples.
 */
export function rewriteJekyllMarkdown(input: string): string {
  return input
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

function walkText(node: { type?: string; value?: string; children?: unknown[] }, rewrite: (value: string) => string) {
  if (typeof node.value === 'string' && (node.type === 'text' || node.type === 'html' || node.type === 'code' || node.type === 'inlineCode')) {
    node.value = rewrite(node.value);
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === 'object') walkText(child as { type?: string; value?: string; children?: unknown[] }, rewrite);
    }
  }
}

/** remark plugin: rewrite leftover Liquid/kramdown in markdown text without touching Angular `{{ }}`. */
export function remarkRewriteJekyll() {
  return (tree: { type?: string; value?: string; children?: unknown[] }) => {
    walkText(tree, rewriteJekyllMarkdown);
  };
}

/** remark plugin: drop leftover `{% raw %}` / `{% endraw %}` paragraphs in TIL notes. */
export function remarkStripJekyllRaw() {
  return (tree: { children?: Array<{ type: string; children?: Array<{ value?: string }> }> }) => {
    if (!tree.children) return;
    tree.children = tree.children.filter((node) => {
      if (node.type !== 'paragraph' || !node.children) return true;
      const text = node.children.map((child) => child.value || '').join('');
      return !/^\s*\{%\s*(?:end)?raw\s*%\}\s*$/.test(text);
    });
  };
}
