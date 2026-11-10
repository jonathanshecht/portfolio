"use client";

import {
  Captions,
  CaptionsOff,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PLAY_PRODUCT_VIDEO } from "./watch-video-button";

const time = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

// The Velo marketing video. It plays muted on a loop as soon as the page opens (browsers only
// allow autoplay without sound). A control bar in the nav's style can pause it, move through it,
// and turn the sound on. The first unmute starts the video over, so the visitor hears it from
// the beginning. Clicking the video also pauses and plays it.
//
// The bar stays hidden until the mouse moves over the video, and fades away again ~2.5s after
// the mouse stops or leaves. It stays up while the video is paused or while a control has
// keyboard focus. On touch screens, the first tap shows the bar instead of pausing.
//
// A volume slider sits next to the sound button (on wider screens; phones use their own volume
// buttons), and the last button goes fullscreen, keeping these controls and captions.
//
// Captions (a WebVTT file) are on by default, since the video starts muted. They're drawn here
// rather than by the browser, so they match the site and move up out of the bar's way. The CC
// button turns them off and on.
const HIDE_MS = 2500;
export function ProductVideo({
  src,
  poster,
  label,
  captions,
}: {
  src: string;
  poster: string;
  label: string;
  captions?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const trackRef = useRef<HTMLTrackElement>(null);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [caption, setCaption] = useState("");
  const [focused, setFocused] = useState(false);
  const restarted = useRef(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [awake, setAwake] = useState(false);
  const hideTimer = useRef(0);
  const pointerType = useRef("mouse");

  const wake = () => {
    setAwake(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setAwake(false), HIDE_MS);
  };
  const sleep = () => {
    window.clearTimeout(hideTimer.current);
    setAwake(false);
  };
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  // The video can load (and start playing) before this script is ready, so read its state once
  // on mount instead of relying only on the events.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (video.duration) setDuration(video.duration);
    setCurrent(video.currentTime);
    setPaused(video.paused);
  }, []);

  // The "Watch product video" button near the top of the page: start over with the sound on.
  useEffect(() => {
    const play = () => {
      const video = ref.current;
      if (!video) return;
      restarted.current = true;
      video.currentTime = 0;
      video.muted = false;
      void video.play().catch(() => {});
    };
    window.addEventListener(PLAY_PRODUCT_VIDEO, play);
    return () => window.removeEventListener(PLAY_PRODUCT_VIDEO, play);
  }, []);

  // Follow the captions track: the browser keeps it hidden and reports the line to show.
  useEffect(() => {
    const track = trackRef.current?.track;
    if (!track) return;
    track.mode = "hidden";
    const update = () => {
      const cue = track.activeCues?.[0] as VTTCue | undefined;
      setCaption(cue?.text ?? "");
    };
    update();
    track.addEventListener("cuechange", update);
    return () => track.removeEventListener("cuechange", update);
  }, []);

  const togglePlay = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = ref.current;
    if (!video) return;
    if (muted && !restarted.current) {
      restarted.current = true;
      video.currentTime = 0;
    }
    video.muted = !muted;
    if (!video.muted && video.volume === 0) video.volume = 1; // unmuting after sliding to zero
    if (!video.muted) void video.play().catch(() => {});
  };

  // Dragging the volume slider also turns the sound on (or off, at zero).
  const changeVolume = (value: number) => {
    const video = ref.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    if (value > 0) {
      restarted.current = true;
      void video.play().catch(() => {});
    }
  };

  // Fullscreen shows the whole player (so the controls and captions come along). iPhones can only
  // make the video itself fullscreen, with their own controls.
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
      return;
    }
    const wrapper = wrapperRef.current;
    const video = ref.current as
      (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (wrapper?.requestFullscreen)
      void wrapper.requestFullscreen().catch(() => {});
    else video?.webkitEnterFullscreen?.();
  };
  useEffect(() => {
    const update = () =>
      setFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const seek = (value: number) => {
    const video = ref.current;
    if (!video) return;
    video.currentTime = value;
    setCurrent(value);
  };

  const button =
    "grid size-9 shrink-0 place-items-center rounded-full transition-colors outline-none hover:text-(--accent) focus-visible:text-(--accent)";
  const progress = duration ? (current / duration) * 100 : 0;
  const barShown = awake || paused || focused;

  return (
    <div
      ref={wrapperRef}
      className={`group relative ${fullscreen ? "flex items-center bg-black" : ""}`}
      onPointerMove={(e) => e.pointerType === "mouse" && wake()}
      onPointerLeave={(e) => e.pointerType === "mouse" && sleep()}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        onClick={() => {
          if (pointerType.current !== "mouse" && !awake) wake();
          else togglePlay();
        }}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted);
          setVolume(e.currentTarget.volume);
        }}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        className={`w-full cursor-pointer bg-black ${fullscreen ? "h-full object-contain" : "aspect-video"}`}
      >
        {captions && (
          <track
            ref={trackRef}
            kind="captions"
            src={captions}
            srcLang="en"
            label="English"
            default
          />
        )}
      </video>
      {/* The current caption line, above the control bar while it's showing. */}
      {captions && captionsOn && caption && (
        <p
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 mx-auto w-fit max-w-[86%] rounded-lg bg-black/75 px-3 py-1.5 text-center text-sm leading-snug text-white transition-[bottom] duration-300 ease-out sm:text-base ${
            barShown ? "bottom-16 sm:bottom-20" : "bottom-4 sm:bottom-6"
          }`}
        >
          {caption}
        </p>
      )}
      {/* The control bar, in the same look as the nav pill. */}
      <div
        onPointerDown={wake}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`absolute inset-x-3 bottom-3 flex transition-[opacity,translate] duration-300 ease-out group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
          barShown
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-1 opacity-0"
        } items-center gap-1 rounded-full border border-white/12 bg-[#111] p-1 pr-2 text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:inset-x-4 sm:bottom-4 sm:gap-2`}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={paused ? "Play" : "Pause"}
          className={button}
        >
          {paused ? (
            <Play
              aria-hidden
              className="size-4"
              fill="currentColor"
              strokeWidth={0}
            />
          ) : (
            <Pause
              aria-hidden
              className="size-4"
              fill="currentColor"
              strokeWidth={0}
            />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek"
          aria-valuetext={`${time(current)} of ${time(duration)}`}
          className="seek h-5 min-w-0 flex-1 cursor-pointer"
          style={{ ["--progress" as string]: `${progress}%` }}
        />
        <span className="w-[76px] shrink-0 text-center text-xs text-white/70 tabular-nums">
          {time(current)} / {time(duration)}
        </span>
        {captions && (
          <button
            type="button"
            onClick={() => setCaptionsOn(!captionsOn)}
            aria-pressed={captionsOn}
            aria-label="Captions"
            className={button}
          >
            {captionsOn ? (
              <Captions aria-hidden className="size-4" strokeWidth={2} />
            ) : (
              <CaptionsOff aria-hidden className="size-4" strokeWidth={2} />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-2 transition-colors outline-none hover:text-(--accent) focus-visible:text-(--accent)"
        >
          {muted || volume === 0 ? (
            <VolumeX aria-hidden className="size-4" strokeWidth={2} />
          ) : volume < 0.5 ? (
            <Volume1 aria-hidden className="size-4" strokeWidth={2} />
          ) : (
            <Volume2 aria-hidden className="size-4" strokeWidth={2} />
          )}
          <span className="hidden sm:inline">{muted ? "Unmute" : "Mute"}</span>
          <span className="sr-only sm:hidden">{muted ? "Unmute" : "Mute"}</span>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          aria-label="Volume"
          aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)}%`}
          className="seek hidden h-5 w-20 shrink-0 cursor-pointer sm:block"
          style={{ ["--progress" as string]: `${(muted ? 0 : volume) * 100}%` }}
        />
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          className={button}
        >
          {fullscreen ? (
            <Minimize aria-hidden className="size-4" strokeWidth={2} />
          ) : (
            <Maximize aria-hidden className="size-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
