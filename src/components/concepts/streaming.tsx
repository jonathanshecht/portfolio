"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { about, site } from "@/data/site";
import { tracks, type Track } from "@/data/tracks";
import {
  ClockIcon, DocIcon, DownloadIcon, HomeIcon, LibraryIcon, LinkIcon, LockIcon,
  NextIcon, PlayIcon, PrevIcon, ShuffleIcon, UserIcon, VolumeIcon,
} from "./icons";

const released = tracks.filter((t) => t.status === "live");
const playlistUrl = "https://open.spotify.com/playlist/5ABtzOzsvkLkYULOh5iGxx";

function Cover({ track, size }: { track: Track; size: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-md bg-white"
      style={{ width: size, height: size }}
    >
      <Image src={track.logo.src} alt="" width={track.logo.width} height={track.logo.height} className="h-[45%] w-[70%] object-contain" />
    </span>
  );
}

export function StreamingConcept() {
  const router = useRouter();
  const [current, setCurrent] = useState<Track>(released[0]);
  const step = (dir: number) => {
    const i = released.findIndex((t) => t.slug === current.slug);
    setCurrent(released[(i + dir + released.length) % released.length]);
  };

  return (
    <div className="grid h-dvh grid-rows-[1fr_auto] gap-2 bg-[#0b0b0e] p-2 text-white">
      <div className="grid min-h-0 gap-2 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden min-h-0 flex-col gap-2 lg:flex">
          <nav className="rounded-xl bg-night px-5 py-5">
            <span className="logo-texture font-logo text-[32px] leading-none brightness-200" style={{ backgroundImage: `url(${site.logoTexture})` }}>
              jnthn
            </span>
            <ul className="mt-6 grid gap-4 text-sm font-semibold text-white/70">
              <li><Link href="/concepts/streaming" className="flex items-center gap-4 text-white"><HomeIcon className="size-6" />Home</Link></li>
              <li><Link href="/about" className="flex items-center gap-4 hover:text-white"><UserIcon className="size-6" />About</Link></li>
              <li><a href={site.links.resume} target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:text-white"><DocIcon className="size-6" />Resume</a></li>
            </ul>
          </nav>
          <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-night px-3 py-4">
            <p className="flex items-center gap-3 px-2 text-sm font-semibold text-white/70"><LibraryIcon className="size-6" />Your Library</p>
            <ul className="mt-4 grid gap-1 text-sm">
              <li className="flex items-center gap-3 rounded-md bg-white/10 p-2">
                <span className="size-12 shrink-0 rounded bg-gradient-to-br from-[#b5e86a] to-[#2f5bea]" />
                <span><span className="block font-semibold">Selected Work</span><span className="text-white/60">Album · Jonathan Shechtman</span></span>
              </li>
              <li>
                <a href={playlistUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md p-2 hover:bg-white/5">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded bg-black">
                    <Image src={site.icons.waveform} alt="" fill unoptimized className="object-cover mix-blend-screen" />
                  </span>
                  <span><span className="block font-semibold">{site.playlist.label}</span><span className="text-white/60">Playlist · jnthnofficial</span></span>
                </a>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-3 rounded-md p-2 hover:bg-white/5">
                  <Image src={about.photos[0].src} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full object-cover" />
                  <span><span className="block font-semibold">Jonathan Shechtman</span><span className="text-white/60">Artist</span></span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main album view */}
        <main className="min-h-0 overflow-y-auto rounded-xl bg-night">
          <header
            className="flex flex-col gap-6 px-5 pt-14 pb-6 transition-[background] duration-700 sm:flex-row sm:items-end sm:px-8"
            style={{ background: `linear-gradient(180deg, ${current.color}66 0%, ${current.color}1a 70%, transparent 100%)` }}
          >
            <div className="relative aspect-square w-44 shrink-0 overflow-hidden rounded-md shadow-[0_8px_40px_rgba(0,0,0,0.5)] sm:w-56">
              <video className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline poster={site.heroVideo.poster}>
                <source src={site.heroVideo.mp4} type="video/mp4" />
              </video>
              <span className="absolute bottom-3 left-4 font-logo text-3xl text-white/90">jnthn</span>
            </div>
            <div>
              <p className="text-sm font-medium">Album</p>
              <h1 className="mt-1 text-5xl font-bold tracking-tight sm:text-7xl">Selected Work</h1>
              <p className="mt-4 text-sm leading-6 text-white/80">
                <Image src={about.photos[0].src} alt="" width={24} height={24} className="mr-1.5 inline size-6 rounded-full object-cover align-middle" />
                <Link href="/about" className="font-semibold text-white hover:underline">Jonathan Shechtman</Link>
                {" "}· Product designer &amp; musician · 2021–2026 · {released.length} tracks
              </p>
            </div>
          </header>

          <div className="bg-black/20 px-5 pb-10 sm:px-8">
            <div className="flex items-center gap-6 py-6">
              <Link href={`/${current.slug}`} aria-label={`Open ${current.name}`} className="flex size-14 items-center justify-center rounded-full bg-[#b5e86a] text-black transition hover:scale-105">
                <PlayIcon className="ml-0.5 size-6" />
              </Link>
              <button
                type="button"
                aria-label="Shuffle: open a random project"
                onClick={() => router.push(`/${released[Math.floor(Math.random() * released.length)].slug}`)}
                className="text-white/60 hover:text-white"
              >
                <ShuffleIcon className="size-7" />
              </button>
              <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold hover:border-white">
                Follow
              </a>
              <a href={site.links.resume} target="_blank" rel="noreferrer" aria-label="Resume" className="text-white/60 hover:text-white">
                <DownloadIcon className="size-7" />
              </a>
            </div>

            <table className="w-full table-fixed text-left text-sm">
              <thead className="border-b border-white/10 text-white/60">
                <tr>
                  <th className="w-10 py-2 pl-3 font-normal">#</th>
                  <th className="py-2 font-normal">Title</th>
                  <th className="hidden w-48 py-2 font-normal md:table-cell">Role</th>
                  <th className="hidden w-28 py-2 font-normal md:table-cell">Released</th>
                  <th className="w-20 py-2 pr-3 text-right font-normal"><ClockIcon className="ml-auto size-4" /><span className="sr-only">Length</span></th>
                </tr>
              </thead>
              <tbody>
                <tr><td colSpan={5} className="h-3" /></tr>
                {tracks.map((track, i) => {
                  const soon = track.status === "soon";
                  const active = current.slug === track.slug;
                  return (
                    <tr
                      key={track.slug}
                      onMouseEnter={() => !soon && setCurrent(track)}
                      onClick={() => !soon && router.push(`/${track.slug}`)}
                      className={`group ${soon ? "opacity-45" : "cursor-pointer hover:bg-white/10"} ${active ? "bg-white/5" : ""}`}
                    >
                      <td className="w-10 rounded-l-md py-2 pl-3 text-white/60 tabular-nums">
                        {soon ? <LockIcon className="size-4" /> : (
                          <>
                            <span className={`group-hover:hidden ${active ? "text-[#b5e86a]" : ""}`}>{i + 1}</span>
                            <PlayIcon className="hidden size-4 text-white group-hover:block" />
                          </>
                        )}
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-3">
                          <Cover track={track} size={40} />
                          <div className="min-w-0">
                            {soon ? (
                              <span className="block truncate font-medium">{track.name}</span>
                            ) : (
                              <Link href={`/${track.slug}`} className={`block truncate font-medium hover:underline ${active ? "text-[#b5e86a]" : ""}`}>
                                {track.name}
                              </Link>
                            )}
                            <span className="block truncate text-white/60">{soon ? "Coming soon" : track.summary}</span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-2 text-white/60 md:table-cell">{track.role}</td>
                      <td className="hidden py-2 text-white/60 md:table-cell">{track.released}</td>
                      <td className="rounded-r-md py-2 pr-3 text-right text-white/60 tabular-nums">{track.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <section className="mt-12">
              <h2 className="text-2xl font-bold">About the artist</h2>
              <Link href="/about" className="group relative mt-4 block max-w-3xl overflow-hidden rounded-xl bg-black">
                <Image src={about.photos[1].src} alt="" width={about.photos[1].width} height={about.photos[1].height}
                  className="absolute inset-0 size-full object-cover opacity-50 transition duration-500 group-hover:scale-105" sizes="768px" />
                <div className="relative bg-gradient-to-t from-black/90 via-black/40 to-transparent px-6 pt-40 pb-6">
                  <p className="font-heading text-xl font-bold">Product designer &amp; musician · {site.location}</p>
                  <p className="mt-2 max-w-xl text-sm text-white/80">{about.intro[0]}</p>
                  <p className="mt-3 text-sm font-semibold text-[#b5e86a]">{site.job}</p>
                </div>
              </Link>
            </section>
          </div>
        </main>
      </div>

      {/* Now playing */}
      <footer className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl bg-black px-4 py-3 sm:grid-cols-[1fr_minmax(0,1.4fr)_1fr]">
        <div className="flex min-w-0 items-center gap-3">
          <Cover track={current} size={48} />
          <div className="min-w-0">
            <Link href={`/${current.slug}`} className="block truncate text-sm font-semibold hover:underline">{current.name}</Link>
            <span className="block truncate text-xs text-white/60">{current.role}</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button type="button" aria-label="Previous project" onClick={() => step(-1)} className="text-white/60 hover:text-white"><PrevIcon className="size-5" /></button>
            <Link href={`/${current.slug}`} aria-label={`Open ${current.name}`} className="flex size-9 items-center justify-center rounded-full bg-white text-black hover:scale-105">
              <PlayIcon className="ml-0.5 size-4" />
            </Link>
            <button type="button" aria-label="Next project" onClick={() => step(1)} className="text-white/60 hover:text-white"><NextIcon className="size-5" /></button>
          </div>
          <div className="hidden w-full items-center gap-2 text-[11px] text-white/60 tabular-nums sm:flex">
            <span>{current.released}</span>
            <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <span key={current.slug} className="absolute inset-y-0 left-0 w-full origin-left animate-[progress_12s_linear_infinite] rounded-full bg-white" />
            </span>
            <span>{current.length}</span>
          </div>
        </div>
        <div className="hidden items-center justify-end gap-4 text-xs text-white/70 sm:flex">
          <span className="hidden rounded-full bg-[#b5e86a]/15 px-3 py-1 font-semibold whitespace-nowrap text-[#b5e86a] lg:inline">Open to new roles</span>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">LinkedIn <LinkIcon className="size-3.5" /></a>
          <VolumeIcon className="size-5" />
        </div>
      </footer>
    </div>
  );
}
