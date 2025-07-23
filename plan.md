# Website Migration Plan: Hugo to TypeScript with Terminal Theme

## Project Overview

This plan outlines the complete migration of the current Hugo-based website to a modern TypeScript-powered static site generator while maintaining all existing features and implementing a terminal-themed design with green accent colors.

## Current Site Analysis

### Existing Features to Preserve
- **Content Management**: Markdown-based blog posts organized by year (`content/posts/2024/`, `content/posts/2025/`)
- **Static Pages**: About, Contact, Projects pages
- **Navigation**: Fixed navbar with glassmorphism effects
- **Profile Mode**: Homepage with profile picture and action buttons
- **RSS/XML Feeds**: Automatic generation for posts and categories
- **SEO**: Meta tags, canonical URLs, and structured data
- **GitHub Pages Deployment**: Automatic builds and deployment
- **Dark/Light Theme Toggle**: User preference with smooth transitions
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Reading Time**: Automatic calculation for blog posts
- **Tags and Categories**: Content organization and filtering
- **Search Functionality**: Site-wide content search

### Current Tech Stack
- **Framework**: Hugo static site generator
- **Theme**: PaperMod with extensive customizations
- **Styling**: CSS with custom extensions and glassmorphism effects
- **Hosting**: GitHub Pages
- **Domain**: GitHubguy132010.github.io

## Proposed New Architecture

### Core Technology Stack
1. **Static Site Generator**: Astro with TypeScript
   - Excellent performance and SEO
   - Native TypeScript support
   - Flexible component architecture
   - Built-in markdown processing
   - Easy migration path from Hugo

2. **Styling Framework**: Tailwind CSS + Custom CSS
   - Utility-first approach for rapid development
   - Excellent terminal theme support
   - Custom CSS for terminal-specific animations

3. **Content Management**: Astro Content Collections
   - Type-safe frontmatter validation
   - Automatic markdown processing
   - Preserved file structure

4. **Deployment**: GitHub Actions + GitHub Pages
   - Automated builds on push
   - TypeScript compilation
   - Asset optimization

## Terminal Theme Design System

### Color Palette
```css
/* Terminal Green Theme */
:root {
  /* Primary Colors */
  --terminal-green-primary: #00ff41;    /* Matrix green */
  --terminal-green-secondary: #00cc33;  /* Darker green */
  --terminal-green-accent: #39ff14;     /* Bright terminal green */
  --terminal-green-dim: #009926;        /* Dimmed green */
  
  /* Background Colors */
  --terminal-bg-primary: #0a0a0a;       /* Deep black */
  --terminal-bg-secondary: #1a1a1a;     /* Slightly lighter black */
  --terminal-bg-tertiary: #2a2a2a;      /* Card backgrounds */
  
  /* Text Colors */
  --terminal-text-primary: #00ff41;     /* Primary green text */
  --terminal-text-secondary: #ffffff;   /* White text */
  --terminal-text-dim: #888888;         /* Dimmed text */
  
  /* Accent Colors */
  --terminal-error: #ff0039;            /* Red for errors */
  --terminal-warning: #ffff00;          /* Yellow for warnings */
  --terminal-info: #00ffff;            /* Cyan for info */
}
```

### Typography
- **Primary Font**: `'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace`
- **Fallback Font**: `'Courier New', monospace`
- **Font Weights**: 300 (light), 400 (regular), 500 (medium), 700 (bold)

### Visual Effects
1. **Cursor Blinking Animation**: Simulated terminal cursor
2. **Text Typing Effect**: Progressive text reveal for headers
3. **Scanline Effect**: Subtle moving scanlines overlay
4. **CRT Monitor Glow**: Green glow effects around elements
5. **Terminal Window Frames**: Window-style borders with minimize/maximize buttons
6. **Matrix Rain Background**: Subtle falling characters background

## Implementation Plan

### Phase 1: Project Setup and Core Infrastructure (Week 1)

#### 1.1 Initialize New Astro Project
```bash
npm create astro@latest my-site-ts -- --template minimal --typescript strict
cd my-site-ts
npm install
```

#### 1.2 Install Dependencies
```bash
# Core dependencies
npm install @astrojs/tailwind @astrojs/sitemap @astrojs/rss
npm install @tailwindcss/typography @tailwindcss/forms

# TypeScript utilities
npm install @types/node

# Terminal theme dependencies
npm install framer-motion @astrojs/react react react-dom

# Development dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

#### 1.3 Configure TypeScript
```typescript
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/layouts/*": ["./src/layouts/*"],
      "@/content/*": ["./src/content/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  }
}
```

#### 1.4 Setup Content Collections
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    author: z.string().default('Thomas Brugman'),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    layout: z.string().default('default'),
  }),
});

export const collections = {
  'posts': postsCollection,
  'pages': pagesCollection,
};
```

### Phase 2: Terminal Theme Implementation (Week 2)

#### 2.1 Base Layout with Terminal Styling
```typescript
// src/layouts/BaseLayout.astro
---
export interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="en" class="terminal-theme">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | Thomas Brugman</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="bg-terminal-bg-primary text-terminal-text-primary font-mono">
    <!-- Scanline overlay -->
    <div class="scanlines"></div>
    
    <!-- CRT screen wrapper -->
    <div class="crt-screen">
      <slot />
    </div>
    
    <!-- Terminal cursor -->
    <div class="terminal-cursor"></div>
  </body>
</html>

<style>
  /* CRT Monitor Effect */
  .crt-screen {
    @apply relative min-h-screen;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
  }
  
  .crt-screen::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      transparent 50%, 
      rgba(0, 255, 65, 0.05) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 1000;
  }
  
  /* Scanlines */
  .scanlines {
    @apply fixed top-0 left-0 w-full h-full pointer-events-none;
    background: linear-gradient(
      transparent 50%, 
      rgba(0, 255, 65, 0.02) 50%
    );
    background-size: 100% 2px;
    animation: scanlines 0.1s linear infinite;
    z-index: 999;
  }
  
  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(2px); }
  }
  
  /* Terminal cursor */
  .terminal-cursor {
    @apply fixed w-2 h-5 bg-terminal-green-primary;
    animation: cursor-blink 1s infinite;
    z-index: 1001;
  }
  
  @keyframes cursor-blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
</style>
```

#### 2.2 Terminal Window Component
```typescript
// src/components/TerminalWindow.astro
---
interface Props {
  title?: string;
  className?: string;
}

const { title = "thomas@website:~$", className = "" } = Astro.props;
---

<div class={`terminal-window ${className}`}>
  <div class="terminal-header">
    <div class="terminal-controls">
      <div class="control close"></div>
      <div class="control minimize"></div>
      <div class="control maximize"></div>
    </div>
    <div class="terminal-title">
      <span class="typing-text">{title}</span>
    </div>
  </div>
  <div class="terminal-content">
    <slot />
  </div>
</div>

<style>
  .terminal-window {
    @apply bg-terminal-bg-secondary border border-terminal-green-dim rounded-lg overflow-hidden;
    box-shadow: 
      0 0 20px rgba(0, 255, 65, 0.3),
      inset 0 0 20px rgba(0, 255, 65, 0.1);
  }
  
  .terminal-header {
    @apply flex items-center justify-between px-4 py-2 bg-terminal-bg-tertiary border-b border-terminal-green-dim;
  }
  
  .terminal-controls {
    @apply flex space-x-2;
  }
  
  .control {
    @apply w-3 h-3 rounded-full cursor-pointer;
  }
  
  .control.close { @apply bg-red-500; }
  .control.minimize { @apply bg-yellow-500; }
  .control.maximize { @apply bg-green-500; }
  
  .terminal-title {
    @apply text-terminal-green-primary font-mono text-sm;
  }
  
  .terminal-content {
    @apply p-6;
  }
  
  /* Typing animation */
  .typing-text {
    overflow: hidden;
    border-right: 2px solid;
    white-space: nowrap;
    animation: typing 2s steps(40, end), blink-caret 0.75s step-end infinite;
  }
  
  @keyframes typing {
    from { width: 0; }
    to { width: 100%; }
  }
  
  @keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: var(--terminal-green-primary); }
  }
</style>
```

#### 2.3 Navigation Component
```typescript
// src/components/Navigation.astro
---
const navItems = [
  { label: "~/home", href: "/", command: "cd ~" },
  { label: "./about", href: "/about", command: "cat about.txt" },
  { label: "./blog", href: "/blog", command: "ls -la posts/" },
  { label: "./projects", href: "/projects", command: "ls projects/" },
  { label: "./contact", href: "/contact", command: "ping contact" },
];
---

<nav class="terminal-nav">
  <div class="nav-prompt">
    <span class="user">thomas@brugman.dev</span>
    <span class="separator">:</span>
    <span class="path">~</span>
    <span class="prompt">$</span>
  </div>
  
  <ul class="nav-commands">
    {navItems.map((item) => (
      <li class="nav-item">
        <a href={item.href} class="nav-link" data-command={item.command}>
          <span class="command-prefix">></span>
          <span class="command-text">{item.label}</span>
        </a>
      </li>
    ))}
  </ul>
  
  <div class="theme-toggle">
    <button class="theme-btn" id="theme-toggle">
      <span class="sr-only">Toggle theme</span>
      <span class="theme-icon">⚡</span>
    </button>
  </div>
</nav>

<style>
  .terminal-nav {
    @apply fixed top-0 left-0 right-0 z-50;
    @apply bg-terminal-bg-secondary/90 backdrop-blur-md;
    @apply border-b border-terminal-green-dim;
    @apply flex items-center justify-between px-6 py-3;
  }
  
  .nav-prompt {
    @apply flex items-center space-x-1 text-terminal-green-primary font-mono text-sm;
  }
  
  .user { @apply text-terminal-green-accent; }
  .separator { @apply text-terminal-text-dim; }
  .path { @apply text-terminal-info; }
  .prompt { @apply text-terminal-green-primary; }
  
  .nav-commands {
    @apply flex items-center space-x-6;
  }
  
  .nav-link {
    @apply flex items-center space-x-2 text-terminal-text-secondary;
    @apply hover:text-terminal-green-primary transition-colors duration-200;
  }
  
  .command-prefix {
    @apply text-terminal-green-dim;
  }
  
  .command-text {
    @apply relative;
  }
  
  .nav-link:hover .command-text::after {
    content: '';
    @apply absolute bottom-0 left-0 w-full h-0.5;
    @apply bg-terminal-green-primary;
    animation: underline-expand 0.3s ease-out forwards;
  }
  
  @keyframes underline-expand {
    from { width: 0; }
    to { width: 100%; }
  }
  
  .theme-btn {
    @apply p-2 rounded border border-terminal-green-dim;
    @apply bg-terminal-bg-tertiary text-terminal-green-primary;
    @apply hover:bg-terminal-green-primary hover:text-terminal-bg-primary;
    @apply transition-all duration-200;
  }
</style>
```

### Phase 3: Content Migration and Components (Week 3)

#### 3.1 Blog Post Layout
```typescript
// src/layouts/BlogPost.astro
---
import BaseLayout from './BaseLayout.astro';
import TerminalWindow from '../components/TerminalWindow.astro';

export interface Props {
  frontmatter: {
    title: string;
    date: Date;
    tags: string[];
    description?: string;
  };
}

const { frontmatter } = Astro.props;
const { title, date, tags, description } = frontmatter;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
---

<BaseLayout title={title} description={description}>
  <div class="container mx-auto px-6 pt-20">
    <TerminalWindow title={`cat ${title.toLowerCase().replace(/\s+/g, '-')}.md`}>
      <article class="terminal-article">
        <header class="article-header">
          <div class="file-info">
            <span class="file-permissions">-rw-r--r--</span>
            <span class="file-owner">thomas</span>
            <span class="file-group">dev</span>
            <span class="file-size">2.4K</span>
            <span class="file-date">{formattedDate}</span>
            <span class="file-name">{title}</span>
          </div>
          
          <h1 class="article-title">
            <span class="prompt">$ cat</span>
            <span class="filename">{title}</span>
          </h1>
          
          {tags.length > 0 && (
            <div class="article-tags">
              <span class="tags-label"># Tags:</span>
              {tags.map((tag) => (
                <span class="tag">#{tag}</span>
              ))}
            </div>
          )}
        </header>
        
        <div class="article-content prose prose-terminal">
          <slot />
        </div>
        
        <footer class="article-footer">
          <div class="end-marker">
            <span class="prompt">$</span>
            <span class="cursor">_</span>
          </div>
        </footer>
      </article>
    </TerminalWindow>
  </div>
</BaseLayout>

<style>
  .terminal-article {
    @apply space-y-6;
  }
  
  .file-info {
    @apply font-mono text-xs text-terminal-text-dim;
    @apply grid grid-cols-6 gap-2 mb-4;
  }
  
  .article-title {
    @apply text-2xl font-bold text-terminal-green-primary mb-4;
  }
  
  .prompt {
    @apply text-terminal-green-accent;
  }
  
  .filename {
    @apply text-terminal-text-secondary ml-2;
  }
  
  .article-tags {
    @apply flex flex-wrap items-center gap-2 mb-6;
  }
  
  .tags-label {
    @apply text-terminal-green-dim;
  }
  
  .tag {
    @apply px-2 py-1 bg-terminal-bg-tertiary border border-terminal-green-dim;
    @apply text-terminal-green-primary text-sm rounded;
  }
  
  .end-marker {
    @apply flex items-center space-x-2 mt-8 pt-4;
    @apply border-t border-terminal-green-dim;
  }
  
  .cursor {
    @apply bg-terminal-green-primary text-terminal-bg-primary px-1;
    animation: cursor-blink 1s infinite;
  }
</style>
```

#### 3.2 Terminal Prose Styling
```css
/* src/styles/terminal-prose.css */
.prose-terminal {
  @apply text-terminal-text-secondary;
}

.prose-terminal h1,
.prose-terminal h2,
.prose-terminal h3,
.prose-terminal h4,
.prose-terminal h5,
.prose-terminal h6 {
  @apply text-terminal-green-primary;
  position: relative;
}

.prose-terminal h1::before { content: "# "; }
.prose-terminal h2::before { content: "## "; }
.prose-terminal h3::before { content: "### "; }
.prose-terminal h4::before { content: "#### "; }
.prose-terminal h5::before { content: "##### "; }
.prose-terminal h6::before { content: "###### "; }

.prose-terminal h1::before,
.prose-terminal h2::before,
.prose-terminal h3::before,
.prose-terminal h4::before,
.prose-terminal h5::before,
.prose-terminal h6::before {
  @apply text-terminal-green-dim;
}

.prose-terminal code {
  @apply bg-terminal-bg-tertiary text-terminal-green-accent;
  @apply px-2 py-1 rounded border border-terminal-green-dim;
}

.prose-terminal pre {
  @apply bg-terminal-bg-tertiary border border-terminal-green-dim rounded-lg p-4;
  @apply relative overflow-x-auto;
}

.prose-terminal pre::before {
  content: "$ ";
  @apply text-terminal-green-primary;
}

.prose-terminal blockquote {
  @apply border-l-4 border-terminal-green-primary pl-4;
  @apply bg-terminal-bg-tertiary/50 py-2;
}

.prose-terminal a {
  @apply text-terminal-info underline;
  @apply hover:text-terminal-green-accent transition-colors;
}

.prose-terminal ul li::before {
  content: "→ ";
  @apply text-terminal-green-primary;
}

.prose-terminal ol {
  counter-reset: terminal-counter;
}

.prose-terminal ol li {
  counter-increment: terminal-counter;
}

.prose-terminal ol li::before {
  content: counter(terminal-counter) ". ";
  @apply text-terminal-green-primary;
}
```

#### 3.3 Content Migration Script
```typescript
// scripts/migrate-content.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface HugoFrontmatter {
  title: string;
  date: string;
  draft?: boolean;
  tags?: string[];
  [key: string]: any;
}

interface AstroFrontmatter {
  title: string;
  date: Date;
  draft: boolean;
  tags: string[];
  description?: string;
}

async function migrateContent() {
  const hugoContentDir = './hugo-site/content';
  const astroContentDir = './src/content';
  
  // Migrate posts
  const postsDir = path.join(hugoContentDir, 'posts');
  const astroPostsDir = path.join(astroContentDir, 'posts');
  
  await fs.mkdir(astroPostsDir, { recursive: true });
  
  const years = await fs.readdir(postsDir);
  
  for (const year of years) {
    const yearDir = path.join(postsDir, year);
    const stats = await fs.stat(yearDir);
    
    if (stats.isDirectory()) {
      const posts = await fs.readdir(yearDir);
      
      for (const post of posts) {
        if (post.endsWith('.md')) {
          const postPath = path.join(yearDir, post);
          const content = await fs.readFile(postPath, 'utf-8');
          const { data, content: markdown } = matter(content);
          
          const hugoData = data as HugoFrontmatter;
          
          const astroData: AstroFrontmatter = {
            title: hugoData.title,
            date: new Date(hugoData.date),
            draft: hugoData.draft || false,
            tags: hugoData.tags || [],
            description: extractDescription(markdown),
          };
          
          const newContent = matter.stringify(markdown, astroData);
          const newPath = path.join(astroPostsDir, `${year}-${post}`);
          
          await fs.writeFile(newPath, newContent);
          console.log(`Migrated: ${post} -> ${year}-${post}`);
        }
      }
    }
  }
}

function extractDescription(content: string): string {
  // Extract first paragraph as description
  const paragraphs = content.split('\n\n');
  for (const paragraph of paragraphs) {
    const cleaned = paragraph.trim().replace(/^#+\s+/, '').replace(/\n/g, ' ');
    if (cleaned && !cleaned.startsWith('#')) {
      return cleaned.slice(0, 160) + '...';
    }
  }
  return '';
}

migrateContent().catch(console.error);
```

### Phase 4: Advanced Features (Week 4)

#### 4.1 Matrix Rain Background Component
```typescript
// src/components/MatrixRain.astro
---
// Matrix rain effect component
---

<div class="matrix-rain" id="matrix-rain">
  <canvas id="matrix-canvas"></canvas>
</div>

<script>
  class MatrixRain {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private characters: string;
    private fontSize: number;
    private columns: number;
    private drops: number[];
    
    constructor() {
      this.canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.characters = '01';
      this.fontSize = 10;
      this.columns = 0;
      this.drops = [];
      
      this.init();
      this.animate();
    }
    
    private init() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = Math.floor(this.canvas.width / this.fontSize);
      this.drops = Array(this.columns).fill(1);
      
      window.addEventListener('resize', () => this.handleResize());
    }
    
    private handleResize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = Math.floor(this.canvas.width / this.fontSize);
      this.drops = Array(this.columns).fill(1);
    }
    
    private draw() {
      // Semi-transparent black background for trail effect
      this.ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#00ff41';
      this.ctx.font = `${this.fontSize}px monospace`;
      
      for (let i = 0; i < this.drops.length; i++) {
        const char = this.characters[Math.floor(Math.random() * this.characters.length)];
        this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
        
        if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i]++;
      }
    }
    
    private animate() {
      this.draw();
      requestAnimationFrame(() => this.animate());
    }
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MatrixRain());
  } else {
    new MatrixRain();
  }
</script>

<style>
  .matrix-rain {
    @apply fixed top-0 left-0 w-full h-full pointer-events-none;
    z-index: -1;
    opacity: 0.1;
  }
  
  #matrix-canvas {
    @apply w-full h-full;
  }
</style>
```

#### 4.2 Terminal Search Component
```typescript
// src/components/TerminalSearch.astro
---
// Terminal-style search component
---

<div class="terminal-search">
  <div class="search-window">
    <div class="search-header">
      <span class="search-prompt">$ grep -r "</span>
      <input 
        type="text" 
        id="search-input"
        class="search-input"
        placeholder="search query"
        autocomplete="off"
      />
      <span class="search-suffix">" .</span>
      <div class="search-cursor"></div>
    </div>
    
    <div class="search-results" id="search-results">
      <!-- Results will be populated here -->
    </div>
  </div>
</div>

<script>
  interface SearchResult {
    title: string;
    url: string;
    excerpt: string;
    type: 'post' | 'page';
  }
  
  class TerminalSearch {
    private input: HTMLInputElement;
    private results: HTMLElement;
    private searchData: SearchResult[] = [];
    
    constructor() {
      this.input = document.getElementById('search-input') as HTMLInputElement;
      this.results = document.getElementById('search-results') as HTMLElement;
      
      this.loadSearchData();
      this.bindEvents();
    }
    
    private async loadSearchData() {
      try {
        const response = await fetch('/search-index.json');
        this.searchData = await response.json();
      } catch (error) {
        console.error('Failed to load search data:', error);
      }
    }
    
    private bindEvents() {
      this.input.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        this.performSearch(query);
      });
      
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.clearSearch();
        }
      });
    }
    
    private performSearch(query: string) {
      if (query.length < 2) {
        this.clearResults();
        return;
      }
      
      const filteredResults = this.searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      
      this.displayResults(filteredResults, query);
    }
    
    private displayResults(results: SearchResult[], query: string) {
      if (results.length === 0) {
        this.results.innerHTML = `
          <div class="no-results">
            <span class="error-text">grep: no matches found for "${query}"</span>
          </div>
        `;
        return;
      }
      
      const resultHTML = results.map((result, index) => `
        <div class="search-result">
          <div class="result-header">
            <span class="file-path">./${result.type}/${result.title.toLowerCase().replace(/\s+/g, '-')}.md</span>
          </div>
          <div class="result-content">
            <a href="${result.url}" class="result-link">
              <span class="line-number">${index + 1}:</span>
              <span class="result-text">${this.highlightQuery(result.excerpt, query)}</span>
            </a>
          </div>
        </div>
      `).join('');
      
      this.results.innerHTML = resultHTML;
    }
    
    private highlightQuery(text: string, query: string): string {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    private clearResults() {
      this.results.innerHTML = '';
    }
    
    private clearSearch() {
      this.input.value = '';
      this.clearResults();
    }
  }
  
  new TerminalSearch();
</script>

<style>
  .terminal-search {
    @apply bg-terminal-bg-secondary border border-terminal-green-dim rounded-lg;
    @apply max-w-2xl mx-auto;
  }
  
  .search-header {
    @apply flex items-center p-4 font-mono text-terminal-green-primary;
  }
  
  .search-input {
    @apply bg-transparent border-none outline-none text-terminal-text-secondary;
    @apply flex-1 ml-1;
    caret-color: var(--terminal-green-primary);
  }
  
  .search-cursor {
    @apply w-2 h-5 bg-terminal-green-primary ml-1;
    animation: cursor-blink 1s infinite;
  }
  
  .search-results {
    @apply border-t border-terminal-green-dim max-h-96 overflow-y-auto;
  }
  
  .search-result {
    @apply border-b border-terminal-green-dim last:border-b-0;
  }
  
  .result-header {
    @apply px-4 py-2 bg-terminal-bg-tertiary;
    @apply text-terminal-green-dim text-sm font-mono;
  }
  
  .result-content {
    @apply p-4;
  }
  
  .result-link {
    @apply flex items-start space-x-2 hover:bg-terminal-bg-tertiary;
    @apply transition-colors duration-200 rounded p-2 -m-2;
  }
  
  .line-number {
    @apply text-terminal-green-primary font-mono text-sm;
  }
  
  .result-text {
    @apply text-terminal-text-secondary;
  }
  
  .search-highlight {
    @apply bg-terminal-green-primary text-terminal-bg-primary px-1 rounded;
  }
  
  .no-results {
    @apply p-4 text-terminal-error font-mono;
  }
</style>
```

### Phase 5: Deployment and GitHub Actions (Week 5)

#### 5.1 GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Lint
        run: npm run lint
        
      - name: Build search index
        run: npm run build:search
        
      - name: Build site
        run: npm run build
        env:
          NODE_ENV: production
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### 5.2 Build Scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "type-check": "astro check",
    "lint": "eslint . --ext .ts,.tsx,.astro",
    "lint:fix": "eslint . --ext .ts,.tsx,.astro --fix",
    "format": "prettier --write .",
    "build:search": "node scripts/build-search-index.js"
  }
}
```

#### 5.3 Search Index Builder
```typescript
// scripts/build-search-index.ts
import fs from 'fs/promises';
import path from 'path';
import { getCollection } from 'astro:content';

interface SearchIndexItem {
  title: string;
  url: string;
  excerpt: string;
  type: 'post' | 'page';
  tags: string[];
}

async function buildSearchIndex() {
  const searchIndex: SearchIndexItem[] = [];
  
  // Add blog posts
  const posts = await getCollection('posts');
  for (const post of posts) {
    if (!post.data.draft) {
      searchIndex.push({
        title: post.data.title,
        url: `/blog/${post.slug}/`,
        excerpt: post.data.description || extractExcerpt(post.body),
        type: 'post',
        tags: post.data.tags,
      });
    }
  }
  
  // Add static pages
  const pages = await getCollection('pages');
  for (const page of pages) {
    searchIndex.push({
      title: page.data.title,
      url: `/${page.slug}/`,
      excerpt: page.data.description || extractExcerpt(page.body),
      type: 'page',
      tags: [],
    });
  }
  
  // Write search index
  await fs.writeFile(
    path.join('public', 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );
  
  console.log(`Built search index with ${searchIndex.length} items`);
}

function extractExcerpt(content: string): string {
  // Remove frontmatter and markdown syntax
  const cleaned = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1');
  
  const firstParagraph = cleaned.split('\n\n')[0];
  return firstParagraph.slice(0, 200).trim() + '...';
}

buildSearchIndex().catch(console.error);
```

## Testing and Performance Plan

### 5.1 Performance Optimization
- **Image Optimization**: Astro's built-in image optimization
- **Code Splitting**: Automatic with Astro's island architecture
- **CSS Purging**: Remove unused Tailwind classes
- **Bundle Analysis**: Monitor bundle size and optimize

### 5.2 SEO Preservation
- **Sitemap Generation**: Automatic with @astrojs/sitemap
- **RSS Feed**: Maintain existing RSS functionality
- **Meta Tags**: Preserve all existing SEO optimizations
- **URL Structure**: Maintain existing URL patterns

### 5.3 Accessibility
- **Keyboard Navigation**: Full keyboard support for terminal interface
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Ensure green terminal theme meets WCAG standards
- **Focus Management**: Clear focus indicators

## Migration Timeline

### Week 1: Foundation
- [ ] Set up Astro project with TypeScript
- [ ] Configure build tools and development environment
- [ ] Create basic project structure
- [ ] Set up content collections

### Week 2: Terminal Theme
- [ ] Implement base terminal styling
- [ ] Create terminal window components
- [ ] Add matrix rain background effect
- [ ] Implement navigation with terminal commands

### Week 3: Content & Components
- [ ] Migrate all existing content
- [ ] Create blog post layouts
- [ ] Implement search functionality
- [ ] Add terminal-themed components

### Week 4: Advanced Features
- [ ] Add typing animations
- [ ] Implement CRT monitor effects
- [ ] Create interactive terminal elements
- [ ] Optimize performance

### Week 5: Deployment
- [ ] Set up GitHub Actions workflow
- [ ] Configure GitHub Pages deployment
- [ ] Test all functionality
- [ ] Launch new site

## Post-Migration Enhancements

### Terminal Command Simulation
- Interactive terminal prompt on homepage
- Command history navigation
- Auto-completion for navigation commands

### Advanced Animations
- Progressive text reveal effects
- Terminal boot sequence animation
- Glitch effects for loading states

### Interactive Features
- Terminal-based contact form
- Live command execution simulation
- Easter eggs and hidden commands

## Risk Mitigation

### Backup Strategy
- Full backup of existing Hugo site
- Git branching for parallel development
- Staged deployment approach

### SEO Preservation
- 301 redirects for changed URLs
- Maintain existing meta tags and structured data
- Monitor search rankings during transition

### Performance Monitoring
- Lighthouse audits before and after migration
- Core Web Vitals tracking
- User experience testing

## Success Metrics

### Performance Goals
- **Lighthouse Score**: 90+ for all categories
- **Core Web Vitals**: Pass all metrics
- **Bundle Size**: < 200KB initial load

### User Experience Goals
- **Terminal Theme**: Authentic terminal feel
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile Experience**: Fully responsive design

### SEO Goals
- **Search Rankings**: Maintain or improve existing rankings
- **Site Speed**: Faster load times than current Hugo site
- **Technical SEO**: Perfect technical SEO score

This comprehensive plan ensures a smooth migration from Hugo to TypeScript while implementing a cutting-edge terminal theme that will make your website stand out with its unique aesthetic and excellent user experience.
