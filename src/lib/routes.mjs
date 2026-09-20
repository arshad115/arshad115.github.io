/** Listing URLs owned by `src/pages/`, not by content collections. */

export const listingRoutes = [
  { path: '/', title: 'Home' },
  { path: '/posts/', title: 'All Posts' },
  { path: '/today-i-learned/', title: 'Today I Learned' },
  { path: '/portfolio/', title: 'Portfolio' },
  { path: '/categories/', title: 'Categories' },
  { path: '/tags/', title: 'Tags' },
  { path: '/contact/', title: 'Contact' },
  { path: '/newsletter/', title: 'Newsletter' },
  { path: '/search/', title: 'Search' },
  { path: '/sitemap/', title: 'Sitemap' },
];

export const listingRoutePaths = new Set(listingRoutes.map((route) => route.path));
