import { Music2, Pause, Play } from "lucide-react";
import Image from "next/image";

type Song = { title: string; artist: string; cover: string };

// A small "now playing" card along the bottom of the About photo, shown while the ghost has the
// earbud, in the same colors as the nav pill: the cover art, the song and artist, and a button
// to pause it.
export function NowPlaying({
  song,
  shown,
  paused,
  onTogglePause,
}: {
  song: Song;
  shown: boolean;
  paused: boolean;
  onTogglePause: () => void;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-2.5 bottom-2.5 flex items-center gap-2.5 rounded-xl border border-white/12 bg-[#111] p-1.5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-[opacity,translate] duration-500 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      <div className="relative size-9 shrink-0 overflow-hidden rounded-md bg-white/10">
        {song.cover ? (
          <Image src={song.cover} alt="" fill sizes="36px" className="object-cover" />
        ) : (
          <Music2 aria-hidden className="absolute inset-0 m-auto size-4 text-white/60" strokeWidth={1.75} />
        )}
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-[#ff3d48] uppercase">
          {paused ? "Paused" : "Now playing"} · my song
        </p>
        <p className="truncate text-[13px] font-semibold text-white">{song.title}</p>
        <p className="truncate text-xs text-white/60">{song.artist}</p>
      </div>
      <button
        type="button"
        onClick={onTogglePause}
        tabIndex={shown ? 0 : -1}
        aria-label={paused ? `Play ${song.title}` : `Pause ${song.title}`}
        className={`grid size-8 shrink-0 place-items-center rounded-full text-white outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#E5484D] ${shown ? "pointer-events-auto" : ""}`}
      >
        {paused ? (
          <Play className="size-4 translate-x-px fill-current" strokeWidth={0} />
        ) : (
          <Pause className="size-4 fill-current" strokeWidth={0} />
        )}
      </button>
    </div>
  );
}
