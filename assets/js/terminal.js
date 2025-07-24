// Terminal functionality
class Terminal {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.cursor = document.getElementById('cursor');
        this.history = [];
        this.historyIndex = -1;
        this.currentTheme = 'dark';
        this.welcomeMessages = [
            "Welcome to Thomas Brugman's digital workspace...",
            "Linux enthusiast & hobby developer at your service...",
            "Type 'help' to explore my projects and skills...",
            "Ready to dive into the world of open source..."
        ];
        this.hasUserTyped = false;
        this.blogSelectionMode = false;
        this.selectedPostIndex = 0;
        this.availablePosts = [];
        
        this.init();
        this.startWelcomeRotation();
    }
    
    init() {
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', () => this.updateCursor());
        this.input.addEventListener('keyup', () => this.updateCursor()); // Add keyup listener
        this.input.focus();
        
        // Keep focus on input
        document.addEventListener('click', () => this.input.focus());
        
        // Initialize cursor position
        setTimeout(() => this.updateCursor(), 100);
    }
    
    startWelcomeRotation() {
        // Use data from Hugo if available, otherwise fallback to defaults
        const messages = (typeof siteData !== 'undefined' && siteData.content.welcomeMessages) 
            ? siteData.content.welcomeMessages 
            : this.welcomeMessages;
            
        // Only show the first welcome message initially - no rotation
        // The message should stay until user starts typing
        if (messages.length > 0) {
            this.typeText('welcome-message', messages[0]);
        }
    }
    
    hideWelcomeMessages() {
        const welcomeElement = document.getElementById('welcome-message');
        if (welcomeElement) {
            welcomeElement.style.opacity = '0';
            setTimeout(() => {
                welcomeElement.style.display = 'none';
            }, 300);
        }
        // Keep the command list visible - don't hide it
    }
    
    typeText(elementId, text) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.textContent = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                // Add a subtle visual effect
                element.style.opacity = '0.8';
                setTimeout(() => {
                    element.style.opacity = '1';
                }, 50);
            } else {
                clearInterval(typing);
            }
        }, 30); // Faster typing for better UX
    }
    
    handleKeyDown(e) {
        // Hide welcome messages on first keystroke
        if (!this.hasUserTyped) {
            this.hideWelcomeMessages();
            this.hasUserTyped = true;
        }
        
        // Handle blog selection mode
        if (this.blogSelectionMode) {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateBlogSelection(-1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateBlogSelection(1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.selectBlogPost();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.exitBlogSelection();
                    break;
            }
            return;
        }
        
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.autocomplete();
                break;
        }
    }
    
    updateCursor() {
        if (!this.cursor || !this.input) return;
        
        // Get the actual rendered position of the text
        const inputRect = this.input.getBoundingClientRect();
        const prompt = this.input.parentElement.querySelector('.terminal-prompt');
        const promptRect = prompt ? prompt.getBoundingClientRect() : { width: 0 };
        
        // Create a temporary span to measure actual text width
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.fontSize = window.getComputedStyle(this.input).fontSize;
        tempSpan.style.fontFamily = window.getComputedStyle(this.input).fontFamily;
        tempSpan.style.whiteSpace = 'pre';
        tempSpan.textContent = this.input.value;
        document.body.appendChild(tempSpan);
        
        const textWidth = tempSpan.getBoundingClientRect().width;
        document.body.removeChild(tempSpan);
        
        // Position cursor at the end of the text within the input field
        this.cursor.style.left = (promptRect.width + textWidth + 5) + 'px';
        
        // Restart cursor blink animation
        this.cursor.style.animation = 'none';
        setTimeout(() => {
            this.cursor.style.animation = 'blink 1s infinite';
        }, 10);
    }
    
    executeCommand() {
        const command = this.input.value.trim().toLowerCase();
        const fullCommand = this.input.value.trim();
        
        if (command) {
            this.addToHistory(fullCommand);
            this.addOutput(`thomas@website:~$ ${fullCommand}`, 'command');
            this.processCommand(command);
        }
        
        this.input.value = '';
        this.historyIndex = -1;
        // Update cursor position after clearing input
        setTimeout(() => this.updateCursor(), 10);
    }
    
    addToHistory(command) {
        this.history.unshift(command);
        if (this.history.length > 50) {
            this.history.pop();
        }
    }
    
    navigateHistory(direction) {
        if (direction === -1 && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex];
        } else if (direction === 1 && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex];
        } else if (direction === 1 && this.historyIndex === 0) {
            this.historyIndex = -1;
            this.input.value = '';
        }
        // Update cursor position after changing input value
        setTimeout(() => this.updateCursor(), 10);
    }
    
    autocomplete() {
        const partial = this.input.value.toLowerCase();
        const commands = ['help', 'about', 'projects', 'skills', 'contact', 'blog', 'read', 'clear', 'theme', 'reboot', 'shutdown', 'whoami', 'pwd', 'ls', 'sudo', 'matrix'];
        const matches = commands.filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
            this.updateCursor();
        } else if (matches.length > 1) {
            this.addOutput(`Available commands: ${matches.join(', ')}`, 'info');
        }
    }
    
    processCommand(command) {
        // Handle read command with arguments
        if (command.startsWith('read ')) {
            const args = command.split(' ');
            if (args.length >= 2) {
                this.readPost(args[1]);
                return;
            }
        }
        
        switch(command) {
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'projects':
                this.showProjects();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'blog':
            case 'posts':
                this.showBlog();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'theme':
                this.toggleTheme();
                break;
            case 'reboot':
                this.reboot();
                break;
            case 'shutdown':
                this.shutdown();
                break;
            case 'easter':
            case 'matrix':
                this.matrixEffect();
                break;
            case 'sudo':
                this.sudoCommand();
                break;
            case 'whoami':
                this.whoamiCommand();
                break;
            case 'ls':
                this.lsCommand();
                break;
            case 'pwd':
                this.pwdCommand();
                break;
            default:
                this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
                this.suggestCommand(command);
        }
        
        this.scrollToBottom();
    }
    
    showHelp() {
        this.addOutput('Available commands:', 'info');
        this.addOutput('');
        this.addOutput('  help      - Show this help message', 'success');
        this.addOutput('  about     - Learn more about me', 'success');
        this.addOutput('  projects  - View my projects', 'success');
        this.addOutput('  skills    - List my technical skills', 'success');
        this.addOutput('  contact   - Get my contact information', 'success');
        this.addOutput('  blog      - Read my latest blog posts (interactive)', 'success');
        this.addOutput('  read <N>  - Read blog post number N (legacy)', 'success');
        this.addOutput('  clear     - Clear the terminal screen', 'success');
        this.addOutput('  theme     - Toggle light/dark theme', 'success');
        this.addOutput('  reboot    - Reload the website', 'success');
        this.addOutput('  shutdown  - Close the terminal', 'success');
        this.addOutput('');
        this.addOutput('Unix-like commands:', 'info');
        this.addOutput('  whoami    - Display current user info', 'success');
        this.addOutput('  pwd       - Show current directory', 'success');
        this.addOutput('  ls        - List directory contents', 'success');
        this.addOutput('');
        this.addOutput('Easter eggs:', 'info');
        this.addOutput('  matrix    - Enter the Matrix', 'success');
        this.addOutput('  sudo      - Try to gain root access', 'success');
        this.addOutput('');
        this.addOutput('Tip: Use Tab for autocomplete and arrow keys for command history', 'info');
    }
    
    showAbout() {
        this.addOutput('About Thomas Brugman', 'info');
        this.addOutput('');
        this.addOutput('Hi, I\'m Thomas 👋', 'success');
        this.addOutput('');
        this.addOutput('A Linux enthusiast and hobby developer from the Netherlands');
        this.addOutput('with a passion for automation and open source. I have several');
        this.addOutput('years of experience tinkering with Linux systems, configuring');
        this.addOutput('servers, and developing small-scale applications.');
        this.addOutput('');
        this.addOutput('I specialize in Linux system configuration, shell scripting,');
        this.addOutput('infrastructure as code, and GitHub Actions automation.');
        this.addOutput('');
        this.addOutput('Type "projects" to see my work or "contact" to get in touch!');
    }
    
    showProjects() {
        this.addOutput('My Projects', 'info');
        this.addOutput('');
        
        if (typeof siteData !== 'undefined' && siteData.content.projects) {
            const featuredProjects = siteData.content.projects.filter(p => p.featured);
            const otherProjects = siteData.content.projects.filter(p => !p.featured);
            
            if (featuredProjects.length > 0) {
                this.addOutput('Featured Projects:', 'success');
                featuredProjects.forEach((project, index) => {
                    this.addOutput(`${index + 1}. ${project.name}`, 'success');
                    this.addOutput(`   ${project.description}`);
                    this.addOutput(`   Tech: ${project.technologies.join(', ')}`, 'info');
                    this.addOutput(`   Status: ${project.status}`, 'info');
                    this.addOutput(`   URL: ${project.url}`, 'info');
                    this.addOutput('');
                });
            }
            
            if (otherProjects.length > 0) {
                this.addOutput('Other Projects:', 'success');
                otherProjects.forEach((project, index) => {
                    this.addOutput(`${index + 1}. ${project.name}`, 'success');
                    this.addOutput(`   ${project.description}`);
                    this.addOutput(`   URL: ${project.url}`, 'info');
                    this.addOutput('');
                });
            }
        }
        
        this.addOutput('Check out more projects on my GitHub:', 'info');
        this.addOutput('https://github.com/Githubguy132010', 'info');
    }
    
    showSkills() {
        this.addOutput('Technical Skills', 'info');
        this.addOutput('');
        
        if (typeof siteData !== 'undefined' && siteData.content.skills) {
            // Group skills by category
            const categories = {};
            siteData.content.skills.forEach(skill => {
                if (!categories[skill.category]) {
                    categories[skill.category] = [];
                }
                categories[skill.category].push(skill);
            });
            
            // Display skills by category
            Object.keys(categories).forEach(category => {
                this.addOutput(`${category}:`, 'success');
                categories[category].forEach(skill => {
                    this.addOutput(`  • ${skill.name} (${skill.level})`, 'success');
                    this.addOutput(`    ${skill.description}`);
                });
                this.addOutput('');
            });
        } else {
            // Fallback for old format
            const fallbackSkills = [
                "Linux System Configuration",
                "Shell Scripting (Bash)", 
                "Infrastructure as Code (YAML)",
                "GitHub Actions Automation",
                "WSL Development"
            ];
            fallbackSkills.forEach((skill, index) => {
                this.addOutput(`• ${skill}`, 'success');
            });
        }
        
        this.addOutput('Always learning and exploring new technologies!', 'info');
    }
    
    showContact() {
        this.addOutput('Contact Information', 'info');
        this.addOutput('');
        this.addOutput('📧 Email: thomas.brugman.teb3@gmail.com', 'success');
        this.addOutput('🐙 GitHub: https://github.com/Githubguy132010', 'success');
        this.addOutput('');
        this.addOutput('Feel free to reach out for:', 'info');
        this.addOutput('• Linux configurations', 'success');
        this.addOutput('• Open source collaboration', 'success');
        this.addOutput('• Automation projects', 'success');
        this.addOutput('• Development tools', 'success');
    }
    
    renderBlogList() {
        // Remove existing blog list if any
        const existingList = document.getElementById('blog-list');
        if (existingList) {
            existingList.remove();
        }
        
        const listContainer = document.createElement('div');
        listContainer.id = 'blog-list';
        
        this.availablePosts.forEach((post, index) => {
            const isSelected = index === this.selectedPostIndex;
            const line = document.createElement('div');
            line.className = `terminal-line ${isSelected ? 'selected-post' : ''}`;
            line.innerHTML = `<span class="${isSelected ? 'success' : ''}">${isSelected ? '► ' : '  '}${index + 1}. ${post.title}</span>`;
            listContainer.appendChild(line);
            
            const dateLine = document.createElement('div');
            dateLine.className = 'terminal-line';
            dateLine.innerHTML = `<span class="info">    Date: ${post.date}</span>`;
            listContainer.appendChild(dateLine);
            
            const summaryLine = document.createElement('div');
            summaryLine.className = 'terminal-line';
            summaryLine.textContent = `    ${post.summary}`;
            listContainer.appendChild(summaryLine);
            
            const spacerLine = document.createElement('div');
            spacerLine.className = 'terminal-line';
            listContainer.appendChild(spacerLine);
        });
        
        this.output.appendChild(listContainer);
        this.scrollToBottom();
    }
    
    navigateBlogSelection(direction) {
        if (direction === -1 && this.selectedPostIndex > 0) {
            this.selectedPostIndex--;
        } else if (direction === 1 && this.selectedPostIndex < this.availablePosts.length - 1) {
            this.selectedPostIndex++;
        }
        this.renderBlogList();
    }
    
    selectBlogPost() {
        const selectedPost = this.availablePosts[this.selectedPostIndex];
        this.addOutput(`Opening "${selectedPost.title}"...`, 'info');
        
        // Add a smooth transition effect
        setTimeout(() => {
            this.addOutput('Navigating to blog post...', 'success');
            setTimeout(() => {
                window.location.href = selectedPost.url;
            }, 800);
        }, 500);
        
        this.exitBlogSelection();
    }
    
    exitBlogSelection() {
        this.blogSelectionMode = false;
        this.selectedPostIndex = 0;
        this.availablePosts = [];
        
        // Re-enable input
        this.input.style.opacity = '1';
        this.input.readOnly = false;
        this.input.value = '';
        this.input.focus();
        
        // Remove blog list
        const existingList = document.getElementById('blog-list');
        if (existingList) {
            existingList.remove();
        }
        
        // Update cursor position
        setTimeout(() => this.updateCursor(), 10);
    }
    
    readPost(postNumber) {
        const index = parseInt(postNumber) - 1;
        
        if (typeof siteData !== 'undefined' && siteData.content.posts && siteData.content.posts.length > 0) {
            if (index >= 0 && index < siteData.content.posts.length) {
                const post = siteData.content.posts[index];
                this.addOutput(`Opening "${post.title}"...`, 'info');
                
                // Add a smooth transition effect
                setTimeout(() => {
                    this.addOutput('Navigating to blog post...', 'success');
                    setTimeout(() => {
                        window.location.href = post.url;
                    }, 800);
                }, 500);
            } else {
                this.addOutput(`Post ${postNumber} not found. Use "blog" to see available posts.`, 'error');
            }
        } else {
            this.addOutput('No blog posts available.', 'error');
        }
    }
    
    showBlog() {
        if (typeof siteData !== 'undefined' && siteData.content.posts && siteData.content.posts.length > 0) {
            this.availablePosts = siteData.content.posts.slice(0, 10); // Show up to 10 posts
            this.selectedPostIndex = 0;
            this.blogSelectionMode = true;
            
            this.addOutput('Latest Blog Posts', 'info');
            this.addOutput('');
            this.addOutput('Use ↑/↓ arrow keys to navigate, Enter to select, Esc to cancel', 'info');
            this.addOutput('');
            
            this.renderBlogList();
            
            // Keep input focused but visually indicate selection mode
            this.input.style.opacity = '0.3';
            this.input.readOnly = true;
            this.input.value = '[Blog Selection Mode]';
            this.input.focus();
        } else {
            this.addOutput('No blog posts available yet.', 'info');
            this.addOutput('Check back soon for updates!');
        }
    }
    
    clearTerminal() {
        this.output.innerHTML = `
            <div class="terminal-line">
                <span class="info">Terminal cleared</span>
            </div>
        `;
    }
    
    toggleTheme() {
        const body = document.body;
        if (this.currentTheme === 'dark') {
            body.style.background = '#f8f9fa';
            body.style.color = '#212529';
            this.currentTheme = 'light';
            this.addOutput('Switched to light theme', 'success');
        } else {
            body.style.background = '#000';
            body.style.color = '#00ff00';
            this.currentTheme = 'dark';
            this.addOutput('Switched to dark theme', 'success');
        }
    }
    
    reboot() {
        this.addOutput('Rebooting system...', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
    shutdown() {
        this.addOutput('System shutting down...', 'info');
        this.addOutput('Thank you for visiting!', 'success');
        setTimeout(() => {
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:monospace;font-size:24px;">System halted.</div>';
        }, 2000);
    }
    
    matrixEffect() {
        this.addOutput('Initiating Matrix mode...', 'success');
        // Simple matrix effect
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
        let output = '';
        for (let i = 0; i < 20; i++) {
            let line = '';
            for (let j = 0; j < 50; j++) {
                line += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            output += line + '\n';
        }
        this.addOutput(output, 'success');
        this.addOutput('Welcome to the Matrix, Neo...', 'success');
    }
    
    sudoCommand() {
        this.addOutput('thomas is not in the sudoers file. This incident will be reported.', 'error');
        setTimeout(() => {
            this.addOutput('Just kidding! 😄', 'success');
            this.addOutput('With great power comes great responsibility!', 'info');
        }, 2000);
    }
    
    whoamiCommand() {
        this.addOutput('thomas', 'success');
        this.addOutput('Full name: Thomas Brugman', 'info');
        this.addOutput('Role: Linux Enthusiast & Hobby Developer', 'info');
        this.addOutput('Location: Netherlands', 'info');
        this.addOutput('Superpower: Making computers do exactly what I want (most of the time)', 'success');
    }
    
    lsCommand() {
        this.addOutput('total 42', 'info');
        this.addOutput('drwxr-xr-x  about/', 'success');
        this.addOutput('drwxr-xr-x  projects/', 'success');
        this.addOutput('drwxr-xr-x  blog/', 'success');
        this.addOutput('drwxr-xr-x  skills/', 'success');
        this.addOutput('-rw-r--r--  contact.txt', 'success');
        this.addOutput('-rw-r--r--  .secrets', 'error');
        this.addOutput('');
        this.addOutput('Tip: Use specific commands like "about", "projects" to explore these directories!', 'info');
    }
    
    pwdCommand() {
        this.addOutput('/home/thomas/website', 'success');
    }
    
    suggestCommand(command) {
        const commands = ['help', 'about', 'projects', 'skills', 'contact', 'blog', 'read', 'clear', 'theme', 'reboot', 'shutdown', 'whoami', 'pwd', 'ls', 'sudo', 'matrix'];
        const suggestions = commands.filter(cmd => {
            const distance = this.levenshteinDistance(command, cmd);
            return distance <= 2;
        });
        
        if (suggestions.length > 0) {
            this.addOutput(`Did you mean: ${suggestions.join(', ')}?`, 'info');
        }
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }
    
    addOutput(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        line.style.opacity = '0';
        line.style.transform = 'translateY(10px)';
        this.output.appendChild(line);
        
        // Animate the new line in
        setTimeout(() => {
            line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 10);
    }
    
    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// Global functions for terminal controls
function handleShutdown() {
    if (window.terminal) {
        window.terminal.shutdown();
    }
}

function minimizeTerminal() {
    const container = document.querySelector('.terminal-container');
    container.style.transform = 'scale(0.8)';
    container.style.opacity = '0.5';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
        container.style.opacity = '1';
    }, 1000);
}

function maximizeTerminal() {
    const container = document.querySelector('.terminal-container');
    container.style.transform = 'scale(1.02)';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 200);
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});