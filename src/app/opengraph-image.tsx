import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// Link-preview card shown when the site is shared (LinkedIn, iMessage, Slack...).
export const alt = `${site.name}, Product Designer & Musician`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LETTERS = ["J", "O", "N", "A", "T", "H", "A", "N"];
const KEY = 46;
const BLACK_AT = [1, 2, 4, 5, 6];

export default async function Image() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/texgyreadventor-regular.otf")),
    readFile(join(process.cwd(), "src/fonts/texgyreadventor-bold.otf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          background: "radial-gradient(70% 60% at 50% 0%, #10284a 0%, #080808 70%)",
          color: "white",
          fontFamily: "Adventor",
        }}
      >
        {/* Piano spelling JONATHAN */}
        <div style={{ position: "relative", display: "flex", width: KEY * 8 + 4, height: 196, background: "white", border: "2px solid black", borderRadius: 14, overflow: "hidden" }}>
          {LETTERS.map((letter, i) => (
            <div
              key={i}
              style={{
                width: KEY,
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 16,
                fontSize: 21,
                fontWeight: 700,
                color: "black",
                borderLeft: i === 0 ? "none" : "4px solid black",
              }}
            >
              {letter}
            </div>
          ))}
          {BLACK_AT.map((b) => (
            <div key={b} style={{ position: "absolute", top: 0, left: b * KEY - 15, width: 30, height: 112, background: "black", borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }} />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>{site.name}</div>
        <div style={{ display: "flex", fontSize: 32, opacity: 0.75 }}>Product Designer &amp; Musician</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Adventor", data: regular, weight: 400, style: "normal" },
        { name: "Adventor", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
