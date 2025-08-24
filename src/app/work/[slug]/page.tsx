import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import {
  Meta,
  Schema,
  AvatarGroup,
  Button,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
} from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import type { Metadata } from "next";

// Static params for prerendering
export async function generateStaticParams() {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({ slug: post.slug }));
}

// ✅ Next 15: params is a Promise
type PageProps = {
  params: Promise<{ slug: string | string[] }>;
};

// Metadata
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = Array.isArray(slug) ? slug.join("/") : slug;

  const posts = getPosts(["src", "app", "blog", "posts"]);
  const post = posts.find((p) => p.slug === slugStr);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL,
    image:
      post.metadata.image ||
      `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `${blog.path}/${post.slug}`,
    canonical: `${baseURL}${blog.path}/${post.slug}`,
  });
}

// Page
export default async function BlogPage(
  { params }: PageProps
) {
  const { slug } = await params;
  const slugStr = Array.isArray(slug) ? slug.join("/") : slug;

  const posts = getPosts(["src", "app", "blog", "posts"]);
  const post = posts.find((p) => p.slug === slugStr);

  if (!post) notFound();

  const avatars =
    post.metadata.team?.map((member: { avatar: string }) => ({
      src: member.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Row maxWidth={12} hide="m" />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="xs" gap="l">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.metadata.title}
            description={post.metadata.summary}
            datePublished={post.metadata.publishedAt}
            dateModified={post.metadata.publishedAt}
            image={
              post.metadata.image ||
              `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`
            }
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />

          <Button
            data-border="rounded"
            href="/blog"
            weight="default"
            variant="tertiary"
            size="s"
            prefixIcon="chevronLeft"
          >
            Posts
          </Button>

          <Heading variant="display-strong-s">
            {post.metadata.title}
          </Heading>

          <Row gap="12" vertical="center">
            {avatars.length > 0 && (
              <AvatarGroup size="s" avatars={avatars} />
            )}
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
            >
              {post.metadata.publishedAt &&
                formatDate(post.metadata.publishedAt)}
            </Text>
          </Row>

          <Column as="article" fillWidth>
            <CustomMDX source={post.content} />
          </Column>

          <ScrollToHash />
        </Column>
      </Row>

      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        hide="m"
      >
        <Row
          gap="12"
          paddingLeft="2"
          vertical="center"
          onBackground="neutral-medium"
          textVariant="label-default-s"
        >
          <Icon name="document" size="xs" />
          On this page
        </Row>
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
