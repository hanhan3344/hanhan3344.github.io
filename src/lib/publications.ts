import type { CollectionEntry } from 'astro:content';

export type PublicationEntry = CollectionEntry<'publications'>;

export function getPublicationPath(publication: PublicationEntry) {
  return `/publications/${publication.data.slug}/`;
}

export function sortPublications(publications: PublicationEntry[]) {
  return [...publications].sort((left, right) => {
    return (
      right.data.year - left.data.year ||
      Number(right.data.firstAuthor) - Number(left.data.firstAuthor) ||
      (right.data.citations ?? -1) - (left.data.citations ?? -1) ||
      left.data.title.localeCompare(right.data.title)
    );
  });
}

export function groupPublicationsByYear(publications: PublicationEntry[]) {
  const groups = new Map<string, PublicationEntry[]>();

  for (const publication of publications) {
    const year = String(publication.data.year);
    const bucket = groups.get(year) ?? [];
    bucket.push(publication);
    groups.set(year, bucket);
  }

  return Array.from(groups.entries());
}

export function formatAuthorLine(authors: string[]) {
  return authors.join(', ');
}

export function formatCitationCount(citations?: number) {
  if (citations === undefined) {
    return 'Citation data unavailable';
  }

  return citations === 1 ? '1 citation' : `${citations} citations`;
}
