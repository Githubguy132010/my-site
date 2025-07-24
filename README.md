# Thomas Brugman's Personal Website

A terminal-themed personal website showcasing projects, skills, and technical blog posts. Built with Hugo and featuring an interactive terminal interface that provides a unique way to explore content.

## 🌟 Features

- **Interactive Terminal Interface**: Navigate the site using familiar terminal commands
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Blog & Projects**: Showcase of technical projects and blog posts
- **Skills Documentation**: Organized technical skills by category
- **Easter Eggs**: Hidden commands and surprises for curious visitors
- **Fast Performance**: Built with Hugo for lightning-fast static site generation

## 🚀 Live Site

Visit the live website: [https://GitHubguy132010.github.io/](https://GitHubguy132010.github.io/)

## 🛠️ Built With

- **[Hugo](https://gohugo.io/)** - Static site generator
- **[PaperMod Theme](https://github.com/adityatelange/hugo-PaperMod)** - Hugo theme
- **JavaScript** - Custom terminal interface and interactions
- **CSS** - Custom styling and responsive design
- **YAML** - Data management for projects and skills

## 🎯 Terminal Commands

The site features an interactive terminal with the following commands:

### Core Commands
- `help` - Show all available commands
- `about` - Display about information  
- `projects` - List featured projects
- `skills` - Show technical skills by category
- `contact` - Display contact information
- `blog` - Show recent blog posts
- `clear` - Clear terminal screen
- `theme` - Toggle light/dark theme

### System Commands
- `whoami` - Display user information
- `pwd` - Show current directory
- `ls` - List directory contents

### Fun Commands
- `matrix` - Enter the Matrix
- `sudo` - Try to gain root access (with surprise)

## 🏗️ Development

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (v0.100.0 or later)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Githubguy132010/my-site.git
   cd my-site
   ```

2. **Initialize submodules** (for the PaperMod theme)
   ```bash
   git submodule update --init --recursive
   ```

3. **Start the development server**
   ```bash
   hugo server -D
   ```

4. **View the site**
   Open [http://localhost:1313](http://localhost:1313) in your browser

### Building for Production

```bash
hugo --minify
```

The generated site will be in the `public/` directory.

## 📁 Project Structure

```
├── content/           # Site content (markdown files)
│   ├── about/        # About page
│   ├── contact/      # Contact page  
│   ├── posts/        # Blog posts organized by year
│   └── projects/     # Projects page
├── data/             # YAML data files
│   ├── profile.yml   # Personal info, projects, contact
│   └── skills.yml    # Technical skills
├── layouts/          # Custom Hugo templates
├── assets/           # CSS, JavaScript, and other assets
├── static/           # Static files (images, etc.)
├── themes/           # Hugo themes (PaperMod)
└── hugo.toml         # Hugo configuration
```

## 📝 Content Management

### Adding Blog Posts
```bash
hugo new posts/2025/my-new-post.md
```

### Adding Projects
Edit `data/profile.yml` and add to the projects section:
```yaml
projects:
  - name: "Project Name"
    description: "Brief description"
    url: "https://github.com/username/repo"
    technologies: ["Tech1", "Tech2"]
    status: "Active"
    featured: true
```

### Adding Skills
Edit `data/skills.yml`:
```yaml
skills:
  - name: "Skill Name"
    category: "Category"
    description: "Detailed description"
    level: "Beginner|Intermediate|Advanced"
```

For detailed content management instructions, see [README-TERMINAL.md](README-TERMINAL.md).

## 🚢 Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

## 📧 Contact

- **Email**: thomas.brugman.teb3@gmail.com
- **GitHub**: [@Githubguy132010](https://github.com/Githubguy132010)
- **Location**: Netherlands

## 📄 License

This project is open source and available under the [MIT License](LICENSE).