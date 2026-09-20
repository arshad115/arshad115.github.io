/**
 * Alias redirects only. Canonical URLs are the paths in
 * tests/fixtures/jekyll-sitemap.xml and must be real pages in dist/.
 */
export const legacyUrlRedirects = {
  '/projects/': '/portfolio/',
  '/page2/': '/posts/',
  '/page3/': '/posts/',
  '/page4/': '/posts/',
  '/page5/': '/posts/',
  '/page6/': '/posts/',
  '/page7/': '/posts/',
  '/page8/': '/posts/',
  '/page9/': '/posts/',
  '/personal/the-most-fulfilling-2-i-made-and-my-android-developer-journey/':
    '/personal/the-most-fulfilling-$2-I-made-and-my-android-developer-journey/',
  '/tutorial/how-to-use-gitlab-after-enabling-two-factor-authentication-2fa/':
    '/tutorial/how-to-use-gitlab-after-enabling-Two-Factor-Authentication-(2FA)/',
};
