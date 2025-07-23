import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('No frontmatter found');
  }
  
  const frontmatterString = match[1];
  const markdownContent = match[2];
  
  // Simple YAML parser for frontmatter
  const data = {};
  const lines = frontmatterString.split('\n');
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle arrays (tags)
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(item => 
        item.trim().replace(/^["']|["']$/g, '')
      ).filter(item => item.length > 0);
    }
    
    // Handle boolean values
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    
    data[key] = value;
  }
  
  return { data, content: markdownContent };
}

function extractDescription(content) {
  // Remove markdown headers and get first meaningful paragraph
  const paragraphs = content.split('\n\n');
  for (const paragraph of paragraphs) {
    const cleaned = paragraph.trim()
      .replace(/^#+\s+/, '') // Remove markdown headers
      .replace(/\n/g, ' ')   // Replace newlines with spaces
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1');    // Remove italic markdown
    
    if (cleaned && !cleaned.startsWith('#') && cleaned.length > 50) {
      return cleaned.slice(0, 160) + (cleaned.length > 160 ? '...' : '');
    }
  }
  return '';
}

function createFrontmatter(astroData) {
  const lines = [
    '---',
    `title: "${astroData.title}"`,
    `date: ${astroData.date.toISOString()}`,
    `draft: ${astroData.draft}`,
    `tags: [${astroData.tags.map(tag => `"${tag}"`).join(', ')}]`,
    `author: "${astroData.author}"`,
  ];
  
  if (astroData.description) {
    lines.push(`description: "${astroData.description}"`);
  }
  
  lines.push('---', '');
  
  return lines.join('\n');
}

async function migrateContent() {
  const hugoContentDir = path.join(__dirname, '../../content');
  const astroContentDir = path.join(__dirname, '../src/content');
  
  console.log('Starting content migration...');
  console.log('Hugo content dir:', hugoContentDir);
  console.log('Astro content dir:', astroContentDir);
  
  // Migrate posts
  const postsDir = path.join(hugoContentDir, 'posts');
  const astroPostsDir = path.join(astroContentDir, 'posts');
  
  try {
    await fs.mkdir(astroPostsDir, { recursive: true });
    
    const years = await fs.readdir(postsDir);
    let migrated = 0;
    
    for (const year of years) {
      const yearDir = path.join(postsDir, year);
      const stats = await fs.stat(yearDir);
      
      if (stats.isDirectory()) {
        console.log(`Processing year: ${year}`);
        const posts = await fs.readdir(yearDir);
        
        for (const post of posts) {
          if (post.endsWith('.md')) {
            try {
              const postPath = path.join(yearDir, post);
              const content = await fs.readFile(postPath, 'utf-8');
              const { data, content: markdown } = parseFrontmatter(content);
              
              const hugoData = data;
              
              const astroData = {
                title: hugoData.title || 'Untitled',
                date: new Date(hugoData.date || new Date()),
                draft: hugoData.draft || false,
                tags: Array.isArray(hugoData.tags) ? hugoData.tags : [],
                description: extractDescription(markdown),
                author: 'Thomas Brugman',
              };
              
              const newFrontmatter = createFrontmatter(astroData);
              const newContent = newFrontmatter + markdown;
              
              // Create a slug from the title
              const slug = astroData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
              
              const newPath = path.join(astroPostsDir, `${year}-${slug}.md`);
              
              await fs.writeFile(newPath, newContent);
              console.log(`✓ Migrated: ${post} -> ${year}-${slug}.md`);
              migrated++;
            } catch (error) {
              console.error(`✗ Failed to migrate ${post}:`, error.message);
            }
          }
        }
      }
    }
    
    console.log(`\nMigration complete! Migrated ${migrated} posts.`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateContent().catch(console.error);