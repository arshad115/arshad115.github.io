/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly COMMENTS_DISABLED?: string;
  readonly PUBLIC_COMMENTS_DISABLED?: string;
  readonly PUBLIC_GISCUS_REPO?: string;
  readonly PUBLIC_GISCUS_REPO_ID?: string;
  readonly PUBLIC_GISCUS_CATEGORY?: string;
  readonly PUBLIC_GISCUS_CATEGORY_ID?: string;
  readonly PUBLIC_GISCUS_MAPPING?: string;
  readonly PUBLIC_GISCUS_STRICT?: string;
  readonly PUBLIC_GISCUS_REACTIONS_ENABLED?: string;
  readonly PUBLIC_GISCUS_EMIT_METADATA?: string;
  readonly PUBLIC_GISCUS_INPUT_POSITION?: string;
  readonly PUBLIC_GISCUS_THEME?: string;
  readonly PUBLIC_GISCUS_LIGHT_THEME?: string;
  readonly PUBLIC_GISCUS_DARK_THEME?: string;
  readonly PUBLIC_GISCUS_LANG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
