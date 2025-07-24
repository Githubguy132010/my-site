# Terminal Website Content Management

This website uses a terminal-themed interface built with Hugo. Content can be easily updated through markdown files and YAML data files.

## Content Structure

### Blog Posts
- Location: `content/posts/YYYY/`
- Format: Standard Hugo markdown with frontmatter
- Automatically displayed in the `blog` command

### About Page
- File: `content/about/who-i-am.md`
- Displayed via the `about` command

### Contact Information
- File: `data/profile.yml` → `contact` section
- Displayed via the `contact` command

### Projects
- File: `data/profile.yml` → `projects` section
- Displayed via the `projects` command
- Set `featured: true` for highlighted projects

### Skills
- File: `data/skills.yml`
- Organized by categories with difficulty levels
- Displayed via the `skills` command

## Adding New Content

### New Blog Post
```bash
hugo new posts/2025/my-new-post.md
```

### New Project
Edit `data/profile.yml`:
```yaml
projects:
  - name: "Project Name"
    description: "Brief description"
    url: "https://github.com/username/repo"
    technologies: ["Tech1", "Tech2"]
    status: "Active"
    featured: true
```

### New Skill
Edit `data/skills.yml`:
```yaml
skills:
  - name: "Skill Name"
    category: "Category"
    description: "Detailed description"
    level: "Beginner|Intermediate|Advanced"
```

### Terminal Welcome Messages
Edit `data/profile.yml` → `terminal.welcome_messages`:
```yaml
terminal:
  welcome_messages:
    - "Your custom welcome message..."
```

## Terminal Commands

### Core Commands
- `help` - Show all available commands
- `about` - Display about information
- `projects` - List projects
- `skills` - Show technical skills by category
- `contact` - Display contact information
- `blog` - Show recent blog posts
- `clear` - Clear terminal screen
- `theme` - Toggle light/dark theme
- `reboot` - Reload the website
- `shutdown` - Close terminal

### Unix-like Commands
- `whoami` - Display user information
- `pwd` - Show current directory
- `ls` - List directory contents

### Easter Eggs
- `matrix` - Enter the Matrix
- `sudo` - Try to gain root access (with surprise)

## Building and Deployment

### Local Development
```bash
hugo server -D
```

### Production Build
```bash
hugo --minify
```

### Static Hosting
The generated `public/` directory can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Customization

### Adding New Commands
1. Edit `assets/js/terminal.js`
2. Add command to `processCommand()` switch statement
3. Add command to autocomplete arrays
4. Implement command function

### Styling
- Terminal styles are in `layouts/_default/baseof.html`
- Responsive design breakpoints at 768px
- Color scheme: Dark (#000) with green text (#00ff00)

### Animations
- Typing effect for welcome messages
- Smooth terminal interactions
- Theme switching animations
- Command history navigation