import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from 'next/navigation';

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
};

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return [];
  }

  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }

  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);

  const metadata: Metadata = {
    title: data.title || "",
    publishedAt: data.publishedAt || new Date().toISOString(), // Fallback if missing
    summary: data.summary || "",
    image: data.image || "",
    images: data.images || [],
    tag: data.tag || [],
    team: data.team || [],
    link: data.link || "",
  };

  return { metadata, content };
}

export function getPosts(customPath: string[] = []) {
  const postsDir = path.join(process.cwd(), ...customPath);
  const mdxFiles = getMDXFiles(postsDir);

  return mdxFiles.map((file) => {
    const filePath = path.join(postsDir, file);
    const data = readMDXFile(filePath);

    if (!data) return null; // Skip invalid files

    const slug = path.basename(file, path.extname(file));
    return {
      slug,
      metadata: data.metadata,
      content: data.content,
    };
  }).filter(Boolean); // Remove null entries
}
