import { Component } from "solid-js";
import { usePlayer } from "@lib/player";

/** Mini music-player widget cycled through by the scroll bar. */
export const MiniPlayer: Component = () => {
  const player = usePlayer();

  const progressPercent = () => {
    const dur = player.duration();
    return dur > 0 ? (player.currentTime() / dur) * 100 : 0;
  };

  const handleSeek = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const percent = e.offsetX / target.offsetWidth;
    player.setTime(percent * player.duration());
  };

  return (
    <div class="player-holder noselect">
      <div class="player">
        <div class="player-icon">
          <img src={player.getCurrentTrack().src} draggable={false} />
        </div>
        <div class="player-info">
          <div class="player-title">{player.getCurrentTrack().title}</div>
          <div class="player-artist">{player.getCurrentTrack().artist}</div>
        </div>
        <div class="player-control">
          <svg
            viewBox="0 0 24 24"
            style="transform: rotate(180deg); fill: #ffffff"
            onClick={() => player.prev()}
          >
            <path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z" />
          </svg>
          <svg
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
            viewBox="0 0 24 24"
            style="fill: #ffffff"
            onClick={() => player.next()}
          >
            <path d="M0 21v-15c 0 0-0.5-4 3-3l12 7.5c0 0 1.5 1.5 0 3l-12 7.5c0 0-4 1-3-3zm12-16c 0 0-2 0-1 2.268l5.888 3.732c0 0 1 1 0 2l-3.888 2.732c0 0-4.5 2.5-1 3.268l11-6c0 0 1-1 0-2 l-11-6z" />
          </svg>
        </div>
      </div>
      <div class="duration-bar-holder" onClick={handleSeek}>
        <div class="duration-bar" style={{ width: `${progressPercent()}%` }} />
      </div>
    </div>
  );
};
