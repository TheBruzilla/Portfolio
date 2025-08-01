import { type MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',    // API routes not needed for SEO
          '/admin/',  // Future-proofing admin route if it exists
          '/private/', // Any private folder if you plan to add
        ],
      },
    ],
    sitemap: 'https://praneon.com/sitemap.xml',
  };
}
