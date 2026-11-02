import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";

/**
 * Umami, self-hosted. Nothing is injected until both env vars are set, so
 * local builds and Cloudflare previews stay out of your stats. Whatever host
 * you use must also be allowed in public/_headers, or the CSP blocks it.
 */
const umami =
  process.env.PUBLIC_UMAMI_SRC && process.env.PUBLIC_UMAMI_ID
    ? [
        {
          tag: "script",
          attrs: {
            src: process.env.PUBLIC_UMAMI_SRC,
            "data-website-id": process.env.PUBLIC_UMAMI_ID,
            defer: true,
          },
        },
      ]
    : [];

/**
 * Starlight emits title and description meta on its own, but not an image,
 * so links to this site preview as bare text. One card for the whole site
 * is enough; per-page cards would mean rendering a PNG per tutorial.
 */
const ogImage = "https://learn.konjamcoding.me/og.png";
const social = [
  { tag: "meta", attrs: { property: "og:image", content: ogImage } },
  { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
  { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
  { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
  { tag: "meta", attrs: { name: "twitter:image", content: ogImage } },
];

/**
 * The brand faces. One sans for Latin, Anek Tamil for Tamil, mono for code
 * and measured values. Nothing else: the design carries no display face.
 */
const fonts = [
  { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
  {
    tag: "link",
    attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true },
  },
  {
    tag: "link",
    attrs: {
      rel: "stylesheet",
      href:
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700" +
        "&family=Anek+Tamil:wght@500;700" +
        "&family=IBM+Plex+Mono:wght@400;500&display=swap",
    },
  },
];

export default defineConfig({
  site: "https://learn.konjamcoding.me",
  integrations: [
    starlight({
      title: "Konjam Coding",
      description:
        "Written robotics tutorials from Konjam Coding. ROS 2, MuJoCo and Python, with the exact commands and the versions they were tested against.",

      logo: { src: "./src/assets/logo.png", alt: "" },
      favicon: "/favicon.png",

      customCss: ["./src/styles/tokens.css", "./src/styles/starlight-theme.css"],

      social: [
        { icon: "youtube", label: "YouTube", href: "https://www.youtube.com/@konjamcoding" },
        { icon: "github", label: "GitHub", href: "https://github.com/KonjamCoding/learn" },
      ],

      editLink: {
        baseUrl: "https://github.com/KonjamCoding/learn/edit/main/",
      },

      lastUpdated: true,
      credits: false,

      // Use src/content/docs/404.md instead of Starlight's built-in page,
      // which otherwise wins on route priority.
      disable404Route: true,

      head: [...fonts, ...social, ...umami],

      // English sits at the root so URLs stay clean. When a human translator
      // is paid to do Tamil, add `ta: { label: "தமிழ்", lang: "ta" }` here and
      // put the files under src/content/docs/ta/. English URLs do not change.
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
      },

      components: {
        // Adds the comment box under the usual pagination.
        Footer: "./src/components/Footer.astro",
        // Adds the "tested on" strip and the video link under the title.
        PageTitle: "./src/components/PageTitle.astro",
      },

      sidebar: [
        {
          label: "Start here",
          items: [{ label: "What this is", slug: "start" }],
        },
        {
          label: "ROS 2 from zero",
          items: [{ autogenerate: { directory: "ros2-from-zero" } }],
        },
      ],
    }),
    sitemap(),
  ],
});
