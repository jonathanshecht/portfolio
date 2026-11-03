import type { ReactNode, SVGProps } from "react";

function Svg({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      {children}
    </svg>
  );
}

type P = SVGProps<SVGSVGElement>;

export const PlayIcon = (p: P) => <Svg {...p} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></Svg>;
export const PauseIcon = (p: P) => <Svg {...p} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></Svg>;
export const PrevIcon = (p: P) => <Svg {...p} fill="currentColor" stroke="none"><path d="M17 6v12a1 1 0 0 1-1.6.8L8 13v5H6V6h2v5l7.4-5.8A1 1 0 0 1 17 6Z" /></Svg>;
export const NextIcon = (p: P) => <Svg {...p} fill="currentColor" stroke="none"><path d="M7 6v12a1 1 0 0 0 1.6.8L16 13v5h2V6h-2v5L8.6 5.2A1 1 0 0 0 7 6Z" /></Svg>;
export const ShuffleIcon = (p: P) => <Svg {...p}><path d="M16 4h4v4M4 20 20 4M16 20h4v-4M15 15l5 5M4 4l5 5" /></Svg>;
export const ClockIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>;
export const LockIcon = (p: P) => <Svg {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
export const HomeIcon = (p: P) => <Svg {...p}><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z" /></Svg>;
export const UserIcon = (p: P) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>;
export const DocIcon = (p: P) => <Svg {...p}><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Svg>;
export const LinkIcon = (p: P) => <Svg {...p}><path d="M7 17 17 7M8 7h9v9" /></Svg>;
export const DownloadIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8.5 12.5 12 16l3.5-3.5" /></Svg>;
export const VolumeIcon = (p: P) => <Svg {...p}><path d="M4 9v6h4l5 4V5L8 9Z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" /></Svg>;
export const LibraryIcon = (p: P) => <Svg {...p}><path d="M5 4v16M10 4v16M15 4l4 16" /></Svg>;
