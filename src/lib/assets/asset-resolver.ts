/**
 * Every image under `src/static/assets`, eagerly imported so `resolveAsset`
 * can look up the bundler-hashed URL synchronously.
 */
const assetModules = import.meta.glob<{ default: string }>(
  "/src/static/assets/**/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
);

/**
 * Resolves a "\@assets/..." path (as used in JSON data files and static
 * icon props, where the Vite alias can't be resolved at runtime) to the
 * actual hashed asset URL produced by the bundler.
 *
 * @param path - Asset path starting with `\@assets/`, relative to `src/static/assets`.
 * @returns The resolved asset URL, or `path` unchanged if no such file exists.
 */
export function resolveAsset(path: string): string {
  const relative = path.replace(/^@assets\//, "");
  const key = `/src/static/assets/${relative}`;
  return assetModules[key]?.default ?? path;
}
