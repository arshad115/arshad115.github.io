export const giscus = {
  repo: import.meta.env.PUBLIC_GISCUS_REPO,
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID,
  category: import.meta.env.PUBLIC_GISCUS_CATEGORY,
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID,
  mapping: import.meta.env.PUBLIC_GISCUS_MAPPING ?? 'pathname',
  strict: import.meta.env.PUBLIC_GISCUS_STRICT ?? '0',
  reactionsEnabled: import.meta.env.PUBLIC_GISCUS_REACTIONS_ENABLED ?? '1',
  emitMetadata: import.meta.env.PUBLIC_GISCUS_EMIT_METADATA ?? '0',
  inputPosition: import.meta.env.PUBLIC_GISCUS_INPUT_POSITION ?? 'bottom',
  theme: import.meta.env.PUBLIC_GISCUS_THEME ?? 'preferred_color_scheme',
  lightTheme: import.meta.env.PUBLIC_GISCUS_LIGHT_THEME ?? 'light',
  darkTheme: import.meta.env.PUBLIC_GISCUS_DARK_THEME ?? 'dark',
  lang: import.meta.env.PUBLIC_GISCUS_LANG ?? 'en',
};

export const giscusEnabled = Boolean(giscus.repo && giscus.repoId && giscus.category && giscus.categoryId);
