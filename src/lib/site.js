/** Shared constants for learn.konjamcoding.me. Nothing personal belongs here. */

const env = import.meta.env;

export const SITE = {
  name: "Konjam Coding",
  url: "https://learn.konjamcoding.me",
  mainSite: "https://konjamcoding.me",
  youtube: "https://www.youtube.com/@konjamcoding",
  repo: "https://github.com/KonjamCoding/learn",
  author: "Konjam Coding",
};

export const ANALYTICS = {
  src: env.PUBLIC_UMAMI_SRC || "",
  id: env.PUBLIC_UMAMI_ID || "",
};

/**
 * giscus, which stores comments as GitHub Discussions on the public repo.
 *
 * These four values are not secrets; they appear in the page source on every
 * giscus site. They live in env vars only so the comment box stays switched
 * off until the repo is actually set up, rather than rendering an error.
 *
 * To get them: enable Discussions on the repo, install the giscus app, then
 * fill the form at https://giscus.app and copy the four data- attributes.
 *
 *   PUBLIC_GISCUS_REPO         KonjamCoding/learn
 *   PUBLIC_GISCUS_REPO_ID      R_kgDO…
 *   PUBLIC_GISCUS_CATEGORY     Comments
 *   PUBLIC_GISCUS_CATEGORY_ID  DIC_kwDO…
 */
export const GISCUS = {
  repo: env.PUBLIC_GISCUS_REPO || "",
  repoId: env.PUBLIC_GISCUS_REPO_ID || "",
  category: env.PUBLIC_GISCUS_CATEGORY || "",
  categoryId: env.PUBLIC_GISCUS_CATEGORY_ID || "",
};

export const giscusReady = Boolean(
  GISCUS.repo && GISCUS.repoId && GISCUS.category && GISCUS.categoryId,
);
