import rss from '@astrojs/rss';
import { articles } from '../data/articles';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    // Articles live on their publishing platform; the feed points there.
    items: articles.map((a) => ({
      title: a.title,
      description: a.metric,
      pubDate: new Date(a.date + 'T09:00:00Z'),
      link: a.url,
    })),
  });
}
