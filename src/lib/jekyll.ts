import { rewriteJekyllMarkdown } from './jekyll-rewrite.mjs';

export { rewriteJekyllMarkdown };

function walkText(node: { type?: string; value?: string; children?: unknown[] }, rewrite: (value: string) => string) {
  if (typeof node.value === 'string' && (node.type === 'text' || node.type === 'html')) {
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
