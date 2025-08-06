import { type MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',         // API endpoints not meant for crawlers
          '/admin/',       // Admin panels (future-proof)
          '/private/',     // Sensitive/private resources
          '/api/*',        // Ensure recursive disallow for nested API routes
          '/drafts/',      // If you ever have drafts in content
          '/temp/',        // Temporary folders
        ],
      },
    ],
    sitemap: 'https://praneon.com/sitemap.xml',
    host: 'https://praneon.com',  // Helps search engines resolve canonical host
  };
}
