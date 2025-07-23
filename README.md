# Thomas Brugman's Personal Website

A terminal-themed personal website and blog built with **Astro** and **TypeScript**, featuring a unique matrix-inspired design with green accent colors.

## 🚀 Features

- **Terminal Aesthetic**: Authentic command-line interface design with matrix green colors
- **TypeScript**: Full type safety with Astro's content collections
- **Static Site Generation**: Fast, SEO-friendly pages with Astro
- **Blog System**: Markdown-based blog posts with frontmatter validation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **RSS Feed**: Stay updated with the latest posts
- **GitHub Pages**: Automated deployment via GitHub Actions

## 🎨 Design System

The site features a carefully crafted terminal theme with:

- **Color Palette**: Matrix green (#00ff41), terminal black (#0a0a0a), and accent colors
- **Typography**: JetBrains Mono and other monospace fonts
- **Effects**: CRT monitor glow, scanlines, typing animations, and cursor blinking
- **Components**: Terminal windows, command prompts, and file listings

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build/) v4.16+
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom terminal theme
- **Content**: Markdown with frontmatter validation
- **Deployment**: GitHub Actions + GitHub Pages

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navigation.astro
│   │   └── TerminalWindow.astro
│   ├── content/            # Content collections
│   │   ├── posts/          # Blog posts
│   │   └── config.ts       # Content schema
│   ├── layouts/            # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── MainLayout.astro
│   │   └── BlogPost.astro
│   └── pages/              # Routes
│       ├── index.astro     # Homepage
│       ├── blog.astro      # Blog listing
│       ├── blog/[slug].astro # Individual posts
│       ├── about.astro
│       ├── projects.astro
│       ├── contact.astro
│       └── rss.xml.js      # RSS feed
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
└── dist/                   # Build output
```

## 🚀 Development

### Prerequisites

- Node.js 18+ 
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint code with ESLint

## 📝 Content Management

### Adding Blog Posts

Create a new Markdown file in `src/content/posts/` with frontmatter:

```markdown
---
title: "Your Post Title"
date: 2024-01-01T00:00:00.000Z
draft: false
tags: ["tag1", "tag2"]
description: "Brief description of the post"
author: "Thomas Brugman"
---

Your content here...
```

### Content Schema

All content is validated using Astro's content collections with TypeScript schemas defined in `src/content/config.ts`.

## 🔄 Migration from Hugo

This site was migrated from Hugo to Astro while preserving:

- ✅ All existing blog posts and content
- ✅ URL structure and SEO
- ✅ RSS feeds and sitemaps
- ✅ GitHub Pages deployment
- ✅ Responsive design and features

The migration script (`scripts/migrate-content.mjs`) automatically converted Hugo frontmatter to Astro format.

## 📈 Performance

- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimal JavaScript, CSS-first approach
- **SEO**: Structured data, meta tags, and sitemaps

## 🚀 Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the `master` branch.

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal website, suggestions and improvements are welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share feedback on the terminal theme design

## 📞 Contact

- **GitHub**: [@GitHubguy132010](https://github.com/GitHubguy132010)
- **Website**: [GitHubguy132010.github.io](https://GitHubguy132010.github.io)
- **Email**: thomas@brugman.dev

---

Built with ❤️ and lots of terminal sessions by Thomas Brugman