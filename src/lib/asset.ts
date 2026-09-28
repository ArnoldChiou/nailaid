/** Prefix a /public path with the GitHub Pages base path (plain <img> does not get it automatically). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
