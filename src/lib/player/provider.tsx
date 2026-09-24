import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  onCleanup,
  ParentComponent,
  createResource,
  Accessor,
} from "solid-js";

/** One playable song with its resolved audio and cover URLs. */
export interface Track {
  /** Position of the track in the list returned by the loader. */
  id: number;
  /** Song title, also part of the asset file name. */
  title: string;
  /** Artist name, also part of the asset file name. */
  artist: string;
  /** Bundled audio file URL. */
  url: string;
  /** Bundled cover image URL. */
  src: string;
}

/** Player state and controls exposed through {@link usePlayer}. */
interface PlayerContextType {
  /** All loaded tracks; empty until loading finishes. */
  list: Accessor<Track[]>;
  /** Reloads the track list from its sources. */
  reload: () => void;
  /** Index of the selected track. */
  currentIndex: () => number;
  /** Playback position in seconds. */
  currentTime: () => number;
  /** Length of the current track in seconds; 0 until metadata loads. */
  duration: () => number;
  /** Volume from 0 to 1. */
  volume: () => number;
  /** `true` when nothing is playing. */
  paused: () => boolean;
  /** Starts or resumes the current track. */
  play: () => void;
  /** Pauses playback. */
  pause: () => void;
  /** Pauses if playing, plays otherwise. */
  toggle: () => void;
  /** Advances to the next track, wrapping to the first after the last. */
  next: () => void;
  /** Goes to the previous track, wrapping to the last from the first. */
  prev: () => void;
  /** Seeks to `time` seconds. Ignored if outside the track. */
  setTime: (time: number) => void;
  /** Selects and plays the track at `index`. Ignored if out of range. */
  setIndex: (index: number) => void;
  /** Sets the volume; values are clamped to 0..1. */
  setVolume: (volume: number) => void;
  /** The selected track, or an empty placeholder track (`id: -1`) if none is loaded. */
  getCurrentTrack: () => Track;
}

/** Props of {@link PlayerProvider}. */
interface PlayerProviderProps {
  /**
   * Produces the track list. The player is data-agnostic: the app decides where
   * tracks come from and resolves their audio and cover URLs. Called on mount
   * and again on `reload`.
   */
  loadTracks: () => Promise<Track[]>;
}

/** Context carrying the player state. Use {@link usePlayer} to read it. */
const PlayerContext = createContext<PlayerContextType>();

/**
 * Owns the single `Audio` element and exposes playback state to descendants.
 *
 * @remarks
 * The audio element is recreated whenever the track changes. Tracks advance
 * automatically when one ends, and wrap around at either end of the list.
 *
 * @param props - Provider props: `loadTracks`, the track source, and `children`.
 */
export const PlayerProvider: ParentComponent<PlayerProviderProps> = (props) => {
  const [trackList, { refetch }] = createResource<Track[]>(() =>
    props.loadTracks(),
  );

  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [volume, setVolume] = createSignal(1);
  const [paused, setPaused] = createSignal(true);

  let audio: HTMLAudioElement | undefined;
  let intervalId: number | undefined;

  const initAudio = () => {
    const list = trackList();
    if (!list || list.length === 0) return;

    if (audio) {
      audio.pause();
      audio.src = "";
    }

    audio = new Audio(list[currentIndex()].url);
    audio.volume = volume();

    audio.addEventListener("play", () => {
      setPaused(false);
      startProgressUpdate();
    });

    audio.addEventListener("pause", () => {
      setPaused(true);
      stopProgressUpdate();
      if (audio && audio.currentTime >= audio.duration) {
        next();
      }
    });

    audio.addEventListener("loadedmetadata", () => {
      if (audio) {
        setDuration(audio.duration);
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    });

    audio.addEventListener("ended", () => {
      next();
    });
  };

  const startProgressUpdate = () => {
    stopProgressUpdate();
    intervalId = setInterval(() => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    }, 100) as unknown as number;
  };

  const stopProgressUpdate = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const play = () => {
    if (!audio) {
      initAudio();
    }
    audio?.play().catch(console.error);
  };

  const pause = () => {
    audio?.pause();
  };

  const toggle = () => {
    if (audio?.paused) {
      play();
    } else {
      pause();
    }
  };

  const next = () => {
    const length = trackList()?.length ?? 0;
    if (length === 0) return;
    const newIndex = (currentIndex() + 1) % length;
    setCurrentIndex(newIndex);
    initAudio();
    play();
  };

  const prev = () => {
    const length = trackList()?.length ?? 0;
    if (length === 0) return;
    const newIndex = currentIndex() === 0 ? length - 1 : currentIndex() - 1;
    setCurrentIndex(newIndex);
    initAudio();
    play();
  };

  const setTime = (time: number) => {
    if (audio && time >= 0 && time < audio.duration) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setIndex = (index: number) => {
    const length = trackList()?.length ?? 0;
    if (index >= 0 && index < length) {
      setCurrentIndex(index);
      initAudio();
      play();
    }
  };

  const updateVolume = (vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol));
    setVolume(clampedVol);
    if (audio) {
      audio.volume = clampedVol;
    }
  };
  const emptyTrack: Track = { id: -1, title: "", artist: "", url: "", src: "" };
  const getCurrentTrack = () => trackList()?.[currentIndex()] ?? emptyTrack;

  createEffect(() => {
    initAudio();
  });

  onCleanup(() => {
    stopProgressUpdate();
    if (audio) {
      audio.pause();
      audio.src = "";
    }
  });

  const value: PlayerContextType = {
    list: () => trackList() ?? [],
    reload: () => void refetch(),
    currentIndex,
    currentTime,
    duration,
    volume,
    paused,
    play,
    pause,
    toggle,
    next,
    prev,
    setTime,
    setIndex,
    setVolume: updateVolume,
    getCurrentTrack,
  };

  return (
    <PlayerContext.Provider value={value}>
      {props.children}
    </PlayerContext.Provider>
  );
};

/**
 * Reads the player context.
 *
 * @throws Error if called outside a {@link PlayerProvider}.
 */
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
};
