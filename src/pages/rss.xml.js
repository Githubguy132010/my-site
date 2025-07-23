import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Thomas Brugman | Blog',
    description: 'Linux enthusiast and hobby developer sharing insights on open-source technologies, terminal workflows, and development practices.',
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob('./blog/**/*.{md,mdx}')),
    customData: `<language>en-us</language>`,
  });
}