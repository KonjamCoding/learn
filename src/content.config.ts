import { defineCollection } from "astro:content";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { z } from "astro:content";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /**
         * YouTube video id for the matching episode, e.g. "dQw4w9WgXcQ".
         * When set, the video is linked at the top of the tutorial.
         */
        youtube: z.string().optional(),
        /**
         * What this page was last verified against, so a reader knows
         * whether the commands are likely to still work.
         */
        testedOn: z.array(z.string()).optional(),
      }),
    }),
  }),

  /**
   * Overrides for Starlight's own UI strings ("On this page", "Edit this
   * page", and so on). Empty for now; this is where Tamil UI strings go
   * when the `ta` locale is switched on in astro.config.mjs.
   */
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema(),
  }),
};
