// Site-wide content. Edit this file to update your details.

const CDN = "https://cdn.prod.website-files.com/6753cd4e812cbecd7d5d52d9/";
export const cdn = (file: string) => CDN + file;

export type Img = { src: string; width: number; height: number };

export const site = {
  name: "Jonathan Shechtman",
  title: "Jonathan Shechtman - Product + UX Designer",
  description:
    "Jonathan Shechtman is a product designer and musician in Seattle, currently Lead Designer at MixBus Marketing.",
  url: "https://jonathanshecht-portfolio.vercel.app",
  tagline: "A product designer & musician",
  location: "Seattle",
  job: "Lead Designer @ MixBus Marketing",
  links: {
    linkedin: "https://www.linkedin.com/in/jonathan-shechtman/",
    resume: cdn("67a1408e7b0b49845243dba5_Jonathan_Shechtman_CV_Portfolio.pdf"),
  },
  heroVideo: {
    mp4: "https://cdn.prod.website-files.com/6753cd4e812cbecd7d5d52d9%2F6753d0be797c1ebfbb5f69e7_Produce_6-transcode.mp4",
    webm: "https://cdn.prod.website-files.com/6753cd4e812cbecd7d5d52d9%2F6753d0be797c1ebfbb5f69e7_Produce_6-transcode.webm",
    poster: "https://cdn.prod.website-files.com/6753cd4e812cbecd7d5d52d9%2F6753d0be797c1ebfbb5f69e7_Produce_6-poster-00001.jpg",
  },
  playlist: {
    label: "Songs I listen to when I design",
    embed: "https://open.spotify.com/embed/playlist/5ABtzOzsvkLkYULOh5iGxx?utm_source=generator&theme=0",
  },
  icons: {
    location: cdn("6753fe99b985be57f537531e_location.png"),
    work: cdn("6753fe99f93b975b38ce7ce4_work.png"),
    waveform: cdn("6754376861e252d72437a5e9_vecteezy_minimalist-waveform-audio-abstract-white-on-black-sound_7237578.gif"),
    lock: cdn("67576a68ea114d67e8582a9e_lockicon.png"),
  },
  logoTexture: cdn("67558b561ab7c8348d8bbaf5_ezgif-6-a6c56d1a77.gif"),
};

export const about = {
  eyebrow: "About me",
  title: "Hello, I'm Jonathan.",
  intro: [
    "I'm a product designer and musician who believes that simplicity is the key to good design (and good songs).",
    "I recently graduated from the <mark>University of Washington</mark> with a degree in Informatics and Human-Computer Interaction. Last summer, I interned at <mark>Shure Incorporated</mark>, where I combined my passions for UX design and audio. I currently work as a <mark>lead designer at MixBus Marketing</mark>, where I design audio-focused products.",
  ],
  photos: [
    { src: cdn("6796f8ae817baea70c8ad7a3_Group%201000004571.png"), width: 1212, height: 1352 },
    { src: cdn("6796f703627521b83e725a4f_Group%201000004570.png"), width: 1212, height: 1352 },
  ] satisfies Img[],
  hobbies: {
    eyebrow: "My hobbies",
    title: "When I am not designing -",
    paragraphs: [
      "I'm a music production nerd and have been producing in FL Studio since I was 13. I released my first album in 2019, and an EP in June of 2024.",
      "I've played piano for 12 years, I enjoy singing, and love filming and editing videos - <mark>anything creative, and I'm in.</mark>",
    ],
  },
};
