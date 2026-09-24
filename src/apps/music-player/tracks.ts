import tracksRaw from "@static/tracks.json";
import type { Track } from "@lib/player";

/**
 * Builds the track list from `static/tracks.json`, matching each entry to its audio and
 * cover files by the `Artist - Title` file name.
 *
 * @returns The tracks in `tracks.json` order, with resolved audio and cover URLs.
 * @throws Error if an entry has no matching audio or cover file.
 */
export async function loadTracks(): Promise<Track[]> {
  const audioFiles = import.meta.glob<{ default: string }>(
    "@assets/audio/*.mp3",
    { eager: false },
  );

  const imageFiles = import.meta.glob<{ default: string }>(
    "@assets/images/demo/player/*.{jpg,webp,png}",
    { eager: false },
  );

  return Promise.all(
    tracksRaw.map(async (t, index): Promise<Track> => {
      const name = `${t.artist} - ${t.title}`;

      const audioImporter = audioFiles[`/src/static/assets/audio/${name}.mp3`];

      const imageImporter =
        imageFiles[`/src/static/assets/images/demo/player/${name}.jpg`] ||
        imageFiles[`/src/static/assets/images/demo/player/${name}.webp`] ||
        imageFiles[`/src/static/assets/images/demo/player/${name}.png`];

      if (!audioImporter) {
        throw new Error(`Audio not found: ${name}`);
      }

      if (!imageImporter) {
        throw new Error(`Image not found: ${name}`);
      }

      return {
        id: index,
        title: t.title,
        artist: t.artist,
        url: (await audioImporter()).default,
        src: (await imageImporter()).default,
      };
    }),
  );
}
