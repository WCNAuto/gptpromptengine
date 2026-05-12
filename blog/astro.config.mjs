import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { rehypeHighlightVariables } from './src/lib/rehype-highlight-variables.mjs';
 
export default defineConfig({
  site: 'https://gptpromptengine.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeHighlightVariables],
  },
});
