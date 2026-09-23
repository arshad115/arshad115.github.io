/**
 * Alias redirects. Canonical post URLs are the cleaned filename slugs.
 * Live Jekyll paths from tests/fixtures/jekyll-sitemap.xml may redirect here;
 * after following aliases, the landing path must be real HTML in dist/.
 *
 * Case-only aliases cannot go through Astro `redirects` on a case-insensitive
 * volume: the redirect HTML would overwrite the canonical page. Those are
 * written after the build on case-sensitive filesystems (CI, GitHub Pages).
 */
export const astroRedirects = {
  '/projects/': '/portfolio/',
  '/software/devops-journey/': '/devops/devops-journey/',
  '/software/setup-prometheus-grafana-docker/': '/devops/setup-prometheus-grafana-docker/',
  '/page2/': '/posts/',
  '/page3/': '/posts/',
  '/page4/': '/posts/',
  '/page5/': '/posts/',
  '/page6/': '/posts/',
  '/page7/': '/posts/',
  '/page8/': '/posts/',
  '/page9/': '/posts/',
  '/personal/the-most-fulfilling-$2-I-made-and-my-android-developer-journey/':
    '/personal/the-most-fulfilling-2-i-made-and-my-android-developer-journey/',
  '/tutorial/how-to-use-gitlab-after-enabling-Two-Factor-Authentication-(2FA)/':
    '/tutorial/how-to-use-gitlab-after-enabling-two-factor-authentication-2fa/',
};

export const caseAliasRedirects = {
  '/personal/what-I-learnt-from-my-failed-incubator/':
    '/personal/what-i-learnt-from-my-failed-incubator/',
};

export const legacyUrlRedirects = {
  ...astroRedirects,
  ...caseAliasRedirects,
};
