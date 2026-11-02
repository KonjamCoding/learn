# How the tutorials site is put together

Working notes for `learn.konjamcoding.me`. Read this before changing the site.

## Where this sits

| | `KonjamCoding/website` | `KonjamCoding/learn` (this one) |
| --- | --- | --- |
| Domain | `konjamcoding.me` | `learn.konjamcoding.me` |
| Visibility | private | **public** |
| Stack | Astro | Astro + Starlight |
| Job | what this is, why, videos, projects, who | tutorials you copy and paste from |

**This repo must stay public.** giscus stores comments as GitHub Discussions, and
Discussions on a private repo are not readable by visitors. Making it private would break
every comment thread on the site, and the "Fix this page on GitHub" links with them.

## The brand is not owned here

`src/styles/tokens.css`, `public/logo.png`, `public/logo-lockup.png`, `public/favicon.png`
and `src/assets/logo.png` are **generated**. They come from the website repo:

```bash
cd ../website
npm run sync:brand
```

Editing them here works until the next sync overwrites it. Change the originals in the
website repo instead.

The one file here that *is* yours to edit is `src/styles/starlight-theme.css`, which maps
those tokens onto Starlight's own variables.

### How the mapping works

Starlight builds its components out of named greys and hues. Rather than restyling each
component, `starlight-theme.css` redefines the hues themselves, so anything Starlight adds
in a future version picks up the brand for free:

| Starlight hue | Brand token | Used by |
| --- | --- | --- |
| blue | `--accent` | `:::note` |
| purple | `--ok` | `:::tip` |
| orange | `--accent` | `:::caution` |
| red | `--stop` | `:::danger` |
| green | `--ok` | badges |

Starlight also paints the site title, every link and the active sidebar item in its
accent. At brand strength that is far too much orange for a design built on restraint, so
the bottom of the file quiets all three: the title and links are ink, and the current page
gets a soft fill with one orange edge rather than a solid block.

Starlight toggles `data-theme="dark" \| "light"` on `<html>`, which is exactly what
`tokens.css` already keys off, so both themes fall out of the shared palette with no
second palette in this repo.

The design is plain by intention: white or near-black, one typeface (Inter, with Anek
Tamil for Tamil), hairline rules, no decoration. Orange marks one thing at a time. The
landing page is slightly larger through `.front-hero`, but it is the same face and the
same casing as everything else.

## Writing a tutorial

One Markdown file under `src/content/docs/`. The folder becomes the sidebar group, which
is wired in `astro.config.mjs`.

```markdown
---
title: Your first node
description: One sentence. Used in search results and link previews.
sidebar:
  order: 1
testedOn: ["ROS 2 Jazzy", "Ubuntu 24.04", "Python 3.12"]
youtube: dQw4w9WgXcQ
---
```

`testedOn` and `youtube` are custom fields, declared in `src/content.config.ts` and
rendered by `src/components/PageTitle.astro` as the strip under the title. Both optional.

To add a new track:

1. Make a folder under `src/content/docs/`.
2. Add an `index.md` with `sidebar: { order: 0, label: "Overview" }`.
3. Add the group to `sidebar` in `astro.config.mjs`:

   ```js
   {
     label: "MuJoCo for robot arms",
     items: [{ autogenerate: { directory: "mujoco-arms" } }],
   }
   ```

   The nesting matters. Starlight 0.39 removed `label` directly on an `autogenerate`
   object; it has to be a group with an `items` array.

Available in Markdown without any imports: `:::note`, `:::tip`, `:::caution`, `:::danger`,
code blocks with `title="path/to/file.py"`, and line highlighting with `ins={3,4}` or
`{1-5}`. Anything needing a component import has to be `.mdx`.

## Search

Pagefind, built into Starlight. It indexes the built HTML after every build, so there is
nothing to configure and no third-party service. It works offline and costs nothing.

## Comments

giscus, set up through env vars. Full steps are in [CONTRIBUTING.md](../CONTRIBUTING.md).

`src/components/Comments.astro` always shows the "comment on the video instead" fallback,
not only when giscus is off. Most people watching a Tamil robotics video do not have a
GitHub account, and a comment box they cannot use is worse than one that points them
somewhere they can.

`src/components/Footer.astro` overrides Starlight's footer to add the comment box below
the pagination, and skips it on the splash landing page.

giscus cannot read the page's theme, so `Comments.astro` tells it, and tells it again on
every theme flip via `postMessage`. If comments ever show up light on a dark page, that
listener is what broke.

## Analytics

Umami, injected through Starlight's `head` config in `astro.config.mjs`. Renders nothing
unless both env vars are set:

```
PUBLIC_UMAMI_SRC   https://your-umami-host/script.js
PUBLIC_UMAMI_ID    the website ID Umami gives you
```

`scripts/gen-headers.mjs` reads `PUBLIC_UMAMI_SRC` and adds its origin to the CSP for you.

## Security headers

`dist/_headers` is **generated after every build** from `config/headers.template`. Edit
the template, never the output.

`__SCRIPT_HASHES__` becomes the sha256 of every inline script that actually shipped,
collected by walking `dist` once the build has finished. Starlight emits several of its
own (theme provider, sidebar state, search) and the set moves between versions, so they
are hashed from the output rather than predicted. That is what lets this site drop
`unsafe-inline` entirely.

**After upgrading Starlight, check the site under the real CSP, not a plain static
server.** A blocked inline script produces no visible error: the page renders perfectly
and a control just stops working. That exact failure shipped on the main site once, where
the mobile menu and the theme toggle both died silently.

Anything third-party you add — a script, an image host, a font, an embed — is blocked
silently until it is in the template. Check the browser console first when something
external mysteriously does not load.

## Tamil, later

English sits at the site root, so URLs are `/ros2-from-zero/first-node/` with no `/en/`
prefix. When a human translator is paid:

1. Add `ta: { label: "தமிழ்", lang: "ta" }` to `locales` in `astro.config.mjs`.
2. Put translated files under `src/content/docs/ta/`, mirroring the English paths.
3. Add Tamil UI strings to `src/content/i18n/ta.json`. The English overrides in `en.json`
   show the shape.

English URLs do not change. Starlight adds the language picker on its own and shows a
"not translated yet" notice on pages that have no Tamil version.

Do not machine-translate. A wrong technical translation is worse than none.

## Deploy

Cloudflare Pages, building `main`. Build command `npm run build`, output `dist`.

**Ask before pushing to `main`.**
