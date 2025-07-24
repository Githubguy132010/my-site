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
        this.currentWelcomeIndex = 0;
        
        this.init();
        this.startWelcomeRotation();
    }
    
    init() {
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', () => this.updateCursor());
        this.input.focus();
        
        // Keep focus on input
        document.addEventListener('click', () => this.input.focus());
    }
    
    startWelcomeRotation() {
        setInterval(() => {
            this.currentWelcomeIndex = (this.currentWelcomeIndex + 1) % this.welcomeMessages.length;
            this.typeText('welcome-message', this.welcomeMessages[this.currentWelcomeIndex]);
        }, 5000);
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
            } else {
                clearInterval(typing);
            }
        }, 50);
    }
    
    handleKeyDown(e) {
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
        // Hide cursor when typing, show when idle
        this.cursor.style.opacity = '0';
        clearTimeout(this.cursorTimeout);
        this.cursorTimeout = setTimeout(() => {
            this.cursor.style.opacity = '1';
        }, 500);
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
    }
    
    autocomplete() {
        const partial = this.input.value.toLowerCase();
        const commands = ['help', 'about', 'projects', 'skills', 'contact', 'blog', 'clear', 'theme', 'reboot', 'shutdown'];
        const matches = commands.filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`Available commands: ${matches.join(', ')}`, 'info');
        }
    }
    
    processCommand(command) {
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
        this.addOutput('  blog      - Read my latest blog posts', 'success');
        this.addOutput('  clear     - Clear the terminal screen', 'success');
        this.addOutput('  theme     - Toggle light/dark theme', 'success');
        this.addOutput('  reboot    - Reload the website', 'success');
        this.addOutput('  shutdown  - Close the terminal', 'success');
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
            siteData.content.projects.forEach((project, index) => {
                this.addOutput(`${index + 1}. ${project.name}`, 'success');
                this.addOutput(`   ${project.description}`);
                this.addOutput(`   URL: ${project.url}`, 'info');
                this.addOutput('');
            });
        }
        
        this.addOutput('Check out more projects on my GitHub:', 'info');
        this.addOutput('https://github.com/Githubguy132010', 'info');
    }
    
    showSkills() {
        this.addOutput('Technical Skills', 'info');
        this.addOutput('');
        
        if (typeof siteData !== 'undefined' && siteData.content.skills) {
            siteData.content.skills.forEach((skill, index) => {
                this.addOutput(`• ${skill}`, 'success');
            });
        }
        
        this.addOutput('');
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
    
    showBlog() {
        this.addOutput('Latest Blog Posts', 'info');
        this.addOutput('');
        
        if (typeof siteData !== 'undefined' && siteData.content.posts && siteData.content.posts.length > 0) {
            siteData.content.posts.slice(0, 5).forEach((post, index) => {
                this.addOutput(`${index + 1}. ${post.title}`, 'success');
                this.addOutput(`   Date: ${post.date}`, 'info');
                this.addOutput(`   ${post.summary}`);
                this.addOutput(`   Read more: ${window.location.origin}${post.url}`, 'info');
                this.addOutput('');
            });
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
    }
    
    suggestCommand(command) {
        const commands = ['help', 'about', 'projects', 'skills', 'contact', 'blog', 'clear', 'theme', 'reboot', 'shutdown'];
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
        this.output.appendChild(line);
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