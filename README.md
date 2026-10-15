# Portfolio

My personal portfolio site, built with the [Next.js](https://nextjs.org) App Router and Tailwind CSS, deployed on [Vercel](https://vercel.com).

## Editing content

- [`src/data/site.ts`](src/data/site.ts): name, links, home hero, and the About page.
- [`src/data/projects.ts`](src/data/projects.ts): the project cards on the home page (order, logos, covers, and whether each is live, hidden or coming soon).
- [`src/content/case-studies/`](src/content/case-studies): one JSON file per case study, a list of blocks (sections, headings, paragraphs, images, stats and so on). Text fields can use `<mark>` for the lime highlight.

Images and videos are currently served from the Webflow CDN.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying

Pushing to `main` deploys automatically once the repo is imported into Vercel.
