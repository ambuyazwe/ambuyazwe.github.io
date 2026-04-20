# Portfolio Site

## Editing via CMS (recommended)

Go to **yourdomain.com/admin** and log in. From there you can:

- **Site Settings** — name, phone, email, links, CTA text
- **Skills** — add, remove, reorder skills with proficiency percentages
- **References** — add, remove, edit references
- **Gallery Text** — edit section descriptions and the welcome text
- **Gallery Images** — add, remove, reorder images with titles and descriptions
- **Gallery PDFs** — add, remove PDFs per section

After making changes, click **Deploy Site** at the bottom of the admin page.

## Content structure

All content lives in the **content/** folder:

```
content/
├── site.yaml                    ← Name, phone, email, links, CTA text
├── home/
│   ├── about.md                 ← "About Me" text (# heading + paragraphs)
│   └── skills.yaml              ← Skills list with percentages
├── gallery/
│   ├── 00-welcome/section.md    ← Gallery intro text
│   ├── 01-uiux/
│   │   ├── section.md           ← Section description
│   │   ├── images.yaml          ← Image list with titles/descriptions
│   │   └── pdfs.yaml            ← PDF list with titles
│   ├── 02-advertisement/
│   │   └── ...
│   ├── 07-animations/
│   │   ├── section.md           ← Description + youtube_url in frontmatter
│   │   └── links.yaml           ← YouTube playlist URL
│   └── ...
└── contact/
    └── references.yaml          ← References list
```

Images and PDFs are stored in **public/gallery/{section}/**

## Adding a new gallery section

1. Create a folder like `content/gallery/08-logos/`
2. Add a `section.md` with a `# Heading` and description text
3. Add an `images.yaml` listing the images
4. Drop image files into `public/gallery/08-logos/`

## Building locally

Requires Node.js 20+.

```
npm install
npm run dev      # dev server at localhost:4321
npm run build    # static output to dist/
```
