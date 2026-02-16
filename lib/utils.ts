export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

export function createNoteSlug(title: string, id: string): string {
  const cleanId = id.replace(/-/g, '');
  const slug = title ? slugify(title) : '';
  return slug ? `${slug}-${cleanId}` : cleanId;
}
