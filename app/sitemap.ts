import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/work/morf', '/work/vrak'].map((path) => ({
    url: `https://nzhorov.com${path}`,
    changeFrequency: 'monthly',
    priority: path ? 0.8 : 1,
  }));
}
