import { type MetadataRoute } from 'next';
import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dateNow = new Date().toISOString().split("T")[0];

  // Static Routes from config
  const staticRoutes = Object.keys(routesConfig)
    .filter((route) => routesConfig[route as keyof typeof routesConfig])
    .map((route) => ({
      url: `${baseURL}${route === "/" ? "" : route}`,
      lastModified: dateNow,
      changefreq: 'monthly',
      priority: route === "/" ? 1.0 : 0.9,
    }));

  // Dynamic Blog Posts
  const blogPosts = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt || dateNow,
    changefreq: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Work Projects
  const workProjects = getPosts(["src", "app", "work", "projects"]).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt || dateNow,
    changefreq: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogPosts, ...workProjects];
}
