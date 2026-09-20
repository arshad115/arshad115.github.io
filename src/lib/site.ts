export const SITE = {
  title: 'Arshad Mehmood',
  description:
    'Personal blog by Arshad Mehmood, a software engineer in Mannheim. Notes on DevOps, Android, systems, and a Today I Learned notebook.',
  url: 'https://arshadmehmood.com',
  author: 'Arshad Mehmood',
  location: 'Mannheim, Germany',
  defaultImage: '/assets/images/bio-photo.jpg',
  github: 'https://github.com/arshad115',
  linkedin: 'https://www.linkedin.com/in/arshadmehmood115/',
  twitter: 'https://twitter.com/arshad115',
  instagram: 'https://instagram.com/arshad115',
  playStore: 'http://bit.ly/KookydroidApps',
};

export const NAV = [
  { href: '/posts/', label: 'Posts' },
  { href: '/today-i-learned/', label: 'Today I Learned' },
  { href: '/portfolio/', label: 'Portfolio' },
  { href: '/about/', label: 'About' },
];

export const FOOTER_NAV = [
  { href: '/feed.xml', label: 'RSS' },
  { href: '/search/', label: 'Search' },
  { href: '/contact/', label: 'Contact' },
  { href: '/resources/', label: 'Resources' },
  { href: '/resume/', label: 'Resume' },
  { href: '/newsletter/', label: 'Newsletter' },
  { href: '/support/', label: 'Support' },
  { href: '/terms/', label: 'Terms' },
];

import {
  withTrailingSlash,
  stripSlashes,
  categorySlug,
  filenameSlug,
} from './paths.mjs';

export { withTrailingSlash, stripSlashes, categorySlug, filenameSlug };

export function tagSlug(name: string): string {
  return categorySlug(name);
}

export function titleFromSlug(id: string): string {
  const slug = filenameSlug(id).split('/').pop() || id;
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function firstHeading(body = ''): string | undefined {
  const match = body.match(/^#+\s+(.+)$/m);
  return match?.[1]?.trim();
}

export function asList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatDate(value: Date | string | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function readingMinutes(text: string, wordsPerMinute = 180): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function excerptFromBody(body: string, max = 220): string {
  const plain = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

export function absoluteUrl(pathname: string): string {
  if (pathname.startsWith('http')) return pathname;
  return new URL(pathname, SITE.url).toString();
}
