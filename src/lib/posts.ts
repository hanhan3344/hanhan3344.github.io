import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export function getPostSlug(post: PostEntry) {
  return post.data.slug ?? post.id;
}

export function getLegacyPostSlug(post: PostEntry) {
  return post.data.legacySlug ?? post.id;
}

export function getPostPath(post: PostEntry) {
  return `/writing/${encodeURIComponent(getPostSlug(post))}/`;
}

export function getLegacyPostPath(post: PostEntry) {
  const year = String(post.data.date.getFullYear());
  const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
  const day = String(post.data.date.getDate()).padStart(2, '0');

  return `/${year}/${month}/${day}/${encodeURIComponent(getLegacyPostSlug(post))}/`;
}

export function sortPosts(posts: PostEntry[]) {
  return [...posts].sort((left, right) => right.data.date.getTime() - left.data.date.getTime());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function groupPostsByYear(posts: PostEntry[]) {
  const groups = new Map<string, PostEntry[]>();

  for (const post of posts) {
    const year = String(post.data.date.getFullYear());
    const bucket = groups.get(year) ?? [];
    bucket.push(post);
    groups.set(year, bucket);
  }

  return Array.from(groups.entries());
}

export function getReadingTime(body: string) {
  const characters = body.replace(/\s+/g, '').length;
  return Math.max(1, Math.round(characters / 480));
}
