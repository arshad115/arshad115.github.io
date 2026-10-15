import { rewriteJekyllMarkdown } from './jekyll-rewrite.mjs';
import { imageSize } from './image-size.mjs';

export { rewriteJekyllMarkdown };

function walkText(
  node: { type?: string; value?: string; children?: unknown[] },
  rewrite: (value: string, type?: string) => string,
) {
  if (typeof node.value === 'string' && (node.type === 'text' || node.type === 'html')) {
    node.value = rewrite(node.value, node.type);
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === 'object') walkText(child as { type?: string; value?: string; children?: unknown[] }, rewrite);
    }
  }
}

function addHtmlImageMetadata(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    const dimensions = src ? imageSize(src.replaceAll('&amp;', '&')) : undefined;
    if (!dimensions) return tag;

    const currentWidth = Number(tag.match(/\bwidth=["'](\d+)["']/i)?.[1]);
    const currentHeight = Number(tag.match(/\bheight=["'](\d+)["']/i)?.[1]);
    const width = currentWidth || Math.round((dimensions.width * currentHeight) / dimensions.height) || dimensions.width;
    const height = currentHeight || Math.round((dimensions.height * width) / dimensions.width);
    const attributes = [
      currentWidth ? '' : ` width="${width}"`,
      currentHeight ? '' : ` height="${height}"`,
      /\bloading=/i.test(tag) ? '' : ' loading="lazy"',
      /\bdecoding=/i.test(tag) ? '' : ' decoding="async"',
    ].join('');
    return tag.replace(/\s*\/?\>$/, (ending) => `${attributes}${ending}`);
  });
}

/** remark plugin: rewrite leftover Liquid/kramdown in markdown text without touching Angular `{{ }}`. */
export function remarkRewriteJekyll() {
  return (tree: { type?: string; value?: string; children?: unknown[] }) => {
    walkText(tree, (value, type) => {
      const rewritten = rewriteJekyllMarkdown(value);
      return type === 'html' ? addHtmlImageMetadata(rewritten) : rewritten;
    });
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

type HeadingNode = { type?: string; depth?: number; children?: HeadingNode[] };

/**
 * Bring migrated heading trees back under the layout-owned H1. Older Jekyll
 * documents often started at H3 because the theme supplied more headings.
 */
export function remarkNormalizeHeadingDepth() {
  return (tree: HeadingNode) => {
    const headings: HeadingNode[] = [];
    const collect = (node: HeadingNode) => {
      if (node.type === 'heading' && typeof node.depth === 'number') headings.push(node);
      for (const child of node.children ?? []) collect(child);
    };
    collect(tree);
    if (headings.length === 0) return;

    const firstDepth = headings[0]?.depth ?? 2;
    const shift = Math.max(0, firstDepth - 2);
    let previousDepth = 1;
    for (const heading of headings) {
      const shifted = Math.max(2, (heading.depth ?? 2) - shift);
      heading.depth = Math.min(shifted, previousDepth + 1);
      previousDepth = heading.depth;
    }
  };
}

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/** Add stable dimensions and deferred decoding to local Markdown images. */
export function rehypeLocalImageDimensions() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties ??= {};
        const src = node.properties.src;
        if (typeof src === 'string') {
          const dimensions = imageSize(src);
          if (dimensions) {
            node.properties.width ??= dimensions.width;
            node.properties.height ??= dimensions.height;
          }
        }
        node.properties.loading ??= 'lazy';
        node.properties.decoding ??= 'async';
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
