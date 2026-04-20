import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'content');

// ── Markdown helpers ──

interface ParsedMd {
  title: string;
  html: string;
  frontmatter: Record<string, string>;
}

function parseMd(text: string): ParsedMd {
  let body = text;
  const frontmatter: Record<string, string> = {};

  const fmMatch = body.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (fmMatch) {
    for (const line of fmMatch[1].split('\n')) {
      const m = line.match(/^(\w+):\s*"?([^"\n]+?)"?\s*$/);
      if (m) frontmatter[m[1]] = m[2];
    }
    body = fmMatch[2];
  }

  let title = '';
  const headingMatch = body.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    title = headingMatch[1].trim();
    body = body.replace(headingMatch[0], '').trim();
  }

  const html = marked.parse(body, { async: false }) as string;
  return { title, html, frontmatter };
}

// ── YAML helpers ──

function parseFlatYaml(text: string): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^(\w+):\s*"([^"]*)"\s*$/) || line.match(/^(\w+):\s*([^"#\n]+?)\s*$/);
    if (m && !m[2].startsWith('-')) obj[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return obj;
}

function prettifyFolderName(dir: string): string {
  return dir.replace(/^\d+-/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Site config ──

export function readSite() {
  const text = readFileSync(join(CONTENT, 'site.yaml'), 'utf-8');
  const site = parseFlatYaml(text);
  const ctaHeading = text.match(/heading:\s*"([^"]*)"/)?.[1] || 'Digital Dreamweaver';
  const ctaSub = text.match(/subheading:\s*"([^"]*)"/)?.[1] || 'Transforming Concepts Into Reality';
  return { ...site, ctaHeading, ctaSubheading: ctaSub };
}

// ── Home ──

export function readAbout(): { title: string; html: string } {
  const text = readFileSync(join(CONTENT, 'home', 'about.md'), 'utf-8');
  const { title, html } = parseMd(text);
  return { title: title || 'About Me', html };
}

export function readSkills(): { name: string; percent: number }[] {
  const text = readFileSync(join(CONTENT, 'home', 'skills.yaml'), 'utf-8');
  const skills: { name: string; percent: number }[] = [];
  let current: any = {};
  for (const line of text.split('\n')) {
    const nm = line.match(/^\s*-\s*name:\s*"?([^"\n]+?)"?\s*$/);
    const pm = line.match(/^\s*percent:\s*(\d+)/);
    if (nm) current.name = nm[1];
    if (pm) { current.percent = parseInt(pm[1]); skills.push(current); current = {}; }
  }
  return skills;
}

// ── Contact ──

export interface Reference {
  name: string; role: string; phone?: string; email?: string; linkedin?: string;
}
export function readReferences(): Reference[] {
  const text = readFileSync(join(CONTENT, 'contact', 'references.yaml'), 'utf-8');
  const refs: Reference[] = [];
  let cur: any = {};
  for (const line of text.split('\n')) {
    const nm = line.match(/^\s*-\s*name:\s*"?([^"\n]+?)"?\s*$/);
    const rm = line.match(/^\s*role:\s*"?([^"\n]+?)"?\s*$/);
    const pm = line.match(/^\s*phone:\s*"?([^"\n]+?)"?\s*$/);
    const em = line.match(/^\s*email:\s*"?([^"\n]+?)"?\s*$/);
    const lm = line.match(/^\s*linkedin:\s*"?([^"\n]+?)"?\s*$/);
    if (nm) { if (cur.name) refs.push(cur); cur = { name: nm[1] }; }
    if (rm) cur.role = rm[1];
    if (pm) cur.phone = pm[1];
    if (em) cur.email = em[1];
    if (lm) cur.linkedin = lm[1];
  }
  if (cur.name) refs.push(cur);
  return refs;
}

// ── Gallery ──

export function readGalleryWelcome(): { title: string; html: string } {
  const welcomePath = join(CONTENT, 'gallery', '00-welcome', 'section.md');
  if (!existsSync(welcomePath)) return { title: 'Welcome', html: '' };
  const { title, html } = parseMd(readFileSync(welcomePath, 'utf-8'));
  return { title: title || 'Welcome', html };
}

export interface GalleryPdf { title: string; subtitle: string; file: string; }
export interface GallerySection {
  id: string;
  title: string;
  html: string;
  folder: string;
  pdfs: GalleryPdf[];
  youtubeUrl?: string;
}

export function readGallerySections(): GallerySection[] {
  const galDir = join(CONTENT, 'gallery');
  const dirs = readdirSync(galDir).filter(d =>
    !d.startsWith('.') && d !== '00-welcome' && statSync(join(galDir, d)).isDirectory() && existsSync(join(galDir, d, 'section.md'))
  ).sort();

  return dirs.map(dir => {
    const raw = readFileSync(join(galDir, dir, 'section.md'), 'utf-8');
    const { title, html, frontmatter } = parseMd(raw);

    // Read PDFs from pdfs.yaml
    const pdfs: GalleryPdf[] = [];
    const pdfsPath = join(galDir, dir, 'pdfs.yaml');
    if (existsSync(pdfsPath)) {
      let cur: any = {};
      for (const line of readFileSync(pdfsPath, 'utf-8').split('\n')) {
        const fm = line.match(/^\s*-\s*file:\s*"?([^"\n]+?)"?\s*$/);
        const tm = line.match(/^\s*title:\s*"?([^"\n]+?)"?\s*$/);
        const sm = line.match(/^\s*subtitle:\s*"?([^"\n]+?)"?\s*$/);
        if (fm) { if (cur.file) { const pf = cur.file; pdfs.push({ title: cur.title || '', subtitle: cur.subtitle || '', file: pf.startsWith('/') ? pf : `/gallery/${dir}/${pf}` }); } cur = { file: fm[1] }; }
        if (tm) cur.title = tm[1];
        if (sm) cur.subtitle = sm[1];
      }
      if (cur.file) { const pf = cur.file; pdfs.push({ title: cur.title || '', subtitle: cur.subtitle || '', file: pf.startsWith('/') ? pf : `/gallery/${dir}/${pf}` }); }
    }

    const id = dir.replace(/^\d+-/, '');

    return {
      id,
      title: title || prettifyFolderName(dir),
      html,
      folder: dir,
      pdfs,
      youtubeUrl: frontmatter.youtube_url || undefined,
    };
  });
}

// ── Gallery Images ──

export interface GalleryImage {
  src: string;
  title?: string;
  description?: string;
}

export function getGalleryImages(folder: string): GalleryImage[] {
  const imagesPath = join(CONTENT, 'gallery', folder, 'images.yaml');
  if (!existsSync(imagesPath)) return [];

  const images: GalleryImage[] = [];
  let cur: any = {};
  for (const line of readFileSync(imagesPath, 'utf-8').split('\n')) {
    const fm = line.match(/^\s*-\s*file:\s*"?([^"\n]+?)"?\s*$/);
    const tm = line.match(/^\s*title:\s*"?([^"\n]+?)"?\s*$/);
    const dm = line.match(/^\s*description:\s*"?([^"\n]+?)"?\s*$/);
    if (fm) { if (cur.src) images.push(cur); const f = fm[1]; cur = { src: f.startsWith('/') ? f : `/gallery/${folder}/${f}` }; }
    if (tm) cur.title = tm[1];
    if (dm) cur.description = dm[1];
  }
  if (cur.file || cur.src) images.push(cur);

  return images;
}
