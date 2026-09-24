import { Component, For, createSignal, onMount } from "solid-js";
import { usePlayer } from "@lib/player";
import { defaultMenu, createContextMenu } from "@lib/context-menu";
import { resolveAsset } from "@lib/assets";
import { useI18n } from "@lib/i18n";
import "@styles/music.scss";

/**
 * "Music" app: track list, current track info and playback controls.
 *
 * @remarks
 * Playback state (queue, current track, volume) belongs to the player provider
 * in `@lib/player`, not to this component, so music keeps playing when the
 * window is closed or its tab moves. Track durations are read once on mount
 * by loading each file's metadata. Registered in `apps/registry.tsx`.
 */
export class MusicPlayer {
  /** Icon path using the `@assets/` alias (see `resolveAsset`). */
  static icon = "@assets/images/demo/icons/Apps/Music.png";
  /** CSS classes added to the window element, used by `music-player` styles. */
  static extraClass = ["music-player"];

  /** Window body. */
  static Component: Component = () => {
    const { onContextMenu: handleContextMenu, Menu } =
      createContextMenu(defaultMenu);

    const player = usePlayer();
    const { t } = useI18n();
    const [durations, setDurations] = createSignal<{ [key: number]: string }>(
      {},
    );

    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    onMount(() => {
      player.list().forEach((track, index) => {
        const audio = new Audio(track.url);
        audio.addEventListener("loadedmetadata", () => {
          setDurations((prev) => ({
            ...prev,
            [index]: formatTime(audio.duration),
          }));
        });
      });
    });

    const handleTrackClick = (index: number) => {
      if (player.currentIndex() !== index || player.paused()) {
        player.setIndex(index);
      }
    };

    const handleProgressBarClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const percent = e.offsetX / target.offsetWidth;
      player.setTime(percent * player.duration());
    };

    const handleVolumeBarClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const percent = (target.offsetHeight - e.offsetY) / target.offsetHeight;
      player.setVolume(percent);
    };

    const progressPercent = () => {
      const dur = player.duration();
      return dur > 0 ? (player.currentTime() / dur) * 100 : 0;
    };

    return (
      <div class="music-content noselect" onContextMenu={handleContextMenu}>
        <Menu />
        <div class="music-main">
          <div class="music-left-side">
            <div class="music-left-side-section">
              <For
                each={[
                  { label: "music.home" },
                  { label: "music.search" },
                  { label: "music.library" },
                ]}
              >
                {(item) => (
                  <div class="music-left-side-sections-item">
                    <div class="music-left-side-sections-item-icon-holder">
                      <svg
                        viewBox="0 0 196 196"
                        class="music-left-side-sections-item-icon"
                      >
                        <path d="m 54.253,194.747 c 7.35695,0 16.747,-3.95785 16.747,-10.878 v -44.783 c 0,0 -0.83176,-8.1372 10.416,-8.54422 11.247769,-0.40702 33.168,0 33.168,0 0,0 10.416,-1.1125 10.416,8.54422 v 44.46 c 0,8.40413 9.35218,11.201 16.747,11.201 H 178 c 0,0 16.74701,1.33209 16.747,-11.201 0,0 -5e-5,-76.24649 -5e-5,-95.816 C 194.74695,73.126372 183.2,65.088 183.2,65.088 L 116.78272,8.0140635 c 0,0 -15.55026,-15.2658229 -34.213176,0 L 12.795,65.088 c 0,0 -11.533,7.268738 -11.533,22.642 0,8.58803 0,96.48922 0,96.48922 0,0 -0.058669,10.54188 13.102057,10.52778 h 16.219975 z" />
                      </svg>
                    </div>
                    <div class="music-left-side-sections-item-label">
                      {t(item.label)}
                    </div>
                  </div>
                )}
              </For>
            </div>

            <div class="music-left-side-playlists">
              <div class="music-left-side-main-playlists">
                <For
                  each={[
                    { label: "music.create_playlist" },
                    { label: "music.liked_songs" },
                  ]}
                >
                  {(item) => (
                    <div class="music-left-side-main-playlist">
                      <div class="music-left-side-main-playlist-icon-holder">
                        <img
                          class="music-left-side-main-playlist-icon"
                          src={resolveAsset("@assets/images/home.svg")}
                          alt=""
                        />
                      </div>
                      <div class="music-left-side-main-playlist-label">
                        {t(item.label)}
                      </div>
                    </div>
                  )}
                </For>
              </div>
              <hr />
              <div class="music-left-side-personal-playlists">
                <div class="music-left-side-personal-playlist">
                  <div class="music-left-side-personal-playlist-label">
                    {t("music.guest_best")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="music-right-side">
            <div class="music-right-side-music-list">
              <div class="music-right-side-music-list-header">
                <div style="text-align: center">#</div>
                <div>{t("music.title")}</div>
                <div style="text-align: center">{t("music.duration")}</div>
              </div>
              <hr />
              <For each={player.list()}>
                {(track) => (
                  <div
                    class="music-right-side-music-list-line"
                    style={{
                      "background-color":
                        track.id === player.currentIndex()
                          ? "var(--light-bg)"
                          : undefined,
                    }}
                    onClick={() => handleTrackClick(track.id)}
                  >
                    <div class="music-right-side-music-list-line-id">
                      {track.id + 1}
                    </div>
                    <div class="music-right-side-music-list-line-title">
                      {track.title}
                    </div>
                    <div class="music-right-side-music-list-line-duration">
                      {durations()[track.id] || "--:--"}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        <div class="music-bottom-side">
          <div class="music-bottom-left-side">
            <div class="music-bottom-side-icon-holder">
              <img
                class="music-bottom-side-icon"
                src={player.getCurrentTrack().src}
                alt=""
              />
            </div>
            <div class="music-bottom-side-player-info">
              <div class="music-bottom-side-player-title">
                {player.getCurrentTrack().title}
              </div>
              <div class="music-bottom-side-player-artist">
                {player.getCurrentTrack().artist}
              </div>
            </div>
          </div>

          <div class="music-bottom-side-player">
            <div class="music-bottom-side-player-control">
              <svg
                class="music-bottom-side-prev"
                viewBox="0 0 24 24"
                style="transform: rotate(180deg); fill: #ffffff"
                onClick={() => player.prev()}
              >
                <path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z" />
              </svg>

              <svg
                class="music-bottom-side-pause"
                viewBox="0 0 24 24"
                style="fill: #ffffff"
                onClick={() => player.toggle()}
              >
                {player.paused() ? (
                  <path d="M3 22v-17c0 0-0.5-4 3-3l15 8.5c0 0 1.5 1.5 0 3l-15 8.5c 0 0-4 1-3-3z" />
                ) : (
                  <path d="M10 24h-3c 0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18c 0 0 0 3-3 3zm10 0h-3c0 0-3 0-3-3v-18c0 0 0-3 3-3c0 0 3 0 3 3v18 c 0 0 0 3-3 3z" />
                )}
              </svg>

              <svg
                class="music-bottom-side-next"
                viewBox="0 0 24 24"
                style="fill: #ffffff"
                onClick={() => player.next()}
              >
                <path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z" />
              </svg>
            </div>

            <div
              class="music-bottom-side-duration-bar-holder"
              onClick={handleProgressBarClick}
            >
              <div
                class="music-bottom-side-duration-bar"
                style={{ width: `${progressPercent()}%` }}
              />
            </div>
          </div>

          <div class="music-bottom-right-side">
            <div
              class="music-bottom-side-volume-bar-holder"
              onClick={handleVolumeBarClick}
            >
              <div
                class="music-bottom-side-volume-bar"
                style={{ height: `${player.volume() * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
}
