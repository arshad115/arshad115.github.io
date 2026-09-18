/**
 * Redirects from URLs on the live Jekyll site to their Astro equivalents.
 * Used for migration URL preservation and the URL parity test.
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
  '/development/obsidian-notes-linker-open-source/': '/obsidian-notes-linker-open-source/',
  '/personal/the-most-fulfilling-2-i-made-and-my-android-developer-journey/':
    '/personal/the-most-fulfilling-$2-I-made-and-my-android-developer-journey/',
  '/personal/what-I-learnt-from-my-failed-incubator/': '/personal/what-i-learnt-from-my-failed-incubator/',
  '/tutorial/how-to-use-gitlab-after-enabling-two-factor-authentication-2fa/':
    '/tutorial/how-to-use-gitlab-after-enabling-Two-Factor-Authentication-(2FA)/',
};
