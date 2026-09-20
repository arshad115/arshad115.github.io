export const GISCUS_REQUIRED_KEYS = [
  'PUBLIC_GISCUS_REPO',
  'PUBLIC_GISCUS_REPO_ID',
  'PUBLIC_GISCUS_CATEGORY',
  'PUBLIC_GISCUS_CATEGORY_ID',
];

function flag(value) {
  return /^(1|true|yes)$/i.test(String(value || '').trim());
}

function present(value) {
  return Boolean(String(value || '').trim());
}

export function commentsDisabled(env = process.env) {
  return flag(env.COMMENTS_DISABLED) || flag(env.PUBLIC_COMMENTS_DISABLED);
}

export function giscusConfigured(env = process.env) {
  return GISCUS_REQUIRED_KEYS.every((key) => present(env[key]));
}

export function isGiscusEnabled(env = process.env) {
  return !commentsDisabled(env) && giscusConfigured(env);
}

/** Master deploy: Giscus secrets, or an explicit comments-off flag. */
export function assertGiscusForProduction(env = process.env) {
  if (commentsDisabled(env)) return;
  const missing = GISCUS_REQUIRED_KEYS.filter((key) => !present(env[key]));
  if (missing.length) {
    throw new Error(
      `Production comments need Giscus secrets or COMMENTS_DISABLED=true. Missing: ${missing.join(', ')}`,
    );
  }
}
