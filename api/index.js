const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');

// For Railway deployment, we'll use in-memory storage as a temporary solution
// In a production environment, you should use a database
let inMemoryContent = null;

// GitHub integration for persisting content changes
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // Format: "username/repository"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

// Initialize in-memory content from file on startup if file exists
(function initializeContent() {
  try {
    const contentFile = path.join(__dirname, '..', 'content.json');
    if (fs.existsSync(contentFile)) {
      const fileContent = fs.readFileSync(contentFile, 'utf8');
      if (fileContent.trim() !== '') {
        inMemoryContent = JSON.parse(fileContent);
        console.log('Content initialized from file on startup');
      }
    }
  } catch (error) {
    console.error('Error initializing content from file on startup:', error);
  }
})();

// Simple lock for preventing race conditions
let contentLock = false;
let lockQueue = [];

// Load content from file with validation
function loadContentFromFile() {
  try {
    const contentFile = path.join(__dirname, '..', 'content.json');
    if (fs.existsSync(contentFile)) {
      const fileContent = fs.readFileSync(contentFile, 'utf8');
      if (fileContent.trim() === '') {
        console.log('Content file is empty');
        return null;
      }
      
      try {
        const parsedContent = JSON.parse(fileContent);
        console.log('Content successfully loaded from file');
        return parsedContent;
      } catch (parseError) {
        console.error('Error parsing content from file:', parseError);
        
        // Try to load from backup if available
        const backupFile = contentFile + '.backup';
        if (fs.existsSync(backupFile)) {
          try {
            const backupContent = fs.readFileSync(backupFile, 'utf8');
            if (backupContent.trim() !== '') {
              const parsedBackupContent = JSON.parse(backupContent);
              console.log('Content loaded from backup file');
              return parsedBackupContent;
            }
          } catch (backupError) {
            console.error('Error loading content from backup file:', backupError);
          }
        }
        
        return null;
      }
    }
    console.log('Content file does not exist');
    return null;
  } catch (error) {
    console.error('Error loading content from file:', error);
    return null;
  }
}

// Save content to file with retry logic
function saveContentToFile(content) {
  const contentFile = path.join(__dirname, '..', 'content.json');
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      // Create backup of existing file before overwriting
      if (fs.existsSync(contentFile)) {
        const backupFile = contentFile + '.backup';
        fs.copyFileSync(contentFile, backupFile);
      }
      
      // Save content to file
      fs.writeFileSync(contentFile, JSON.stringify(content, null, 2));
      console.log('Content successfully saved to file');
      return true;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} - Error saving content to file:`, error);
      
      // If this was the last attempt, restore from backup if available
      if (attempts >= maxAttempts) {
        const backupFile = contentFile + '.backup';
        if (fs.existsSync(backupFile)) {
          try {
            fs.copyFileSync(backupFile, contentFile);
            console.log('Restored content from backup after failed save attempts');
          } catch (restoreError) {
            console.error('Failed to restore content from backup:', restoreError);
          }
        }
        return false;
      }
      
      // Wait a bit before retrying
      try {
        require('child_process').execSync('sleep 0.1');
      } catch (sleepError) {
        // If sleep fails, just continue immediately
      }
    }
  }
  
  return false;
}

// Commit and push content.json to GitHub
async function commitAndPushToGitHub(content) {
  // Check if GitHub integration is configured
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.log('GitHub integration not configured. Skipping commit and push.');
    return false;
  }
  
  try {
    const contentFile = path.join(__dirname, '..', 'content.json');
    const fileContent = fs.readFileSync(contentFile, 'utf8');
    const encodedContent = Buffer.from(fileContent).toString('base64');
    
    // Get the current SHA of the file
    let fileSha = null;
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/content.json`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      fileSha = response.data.sha;
    } catch (error) {
      // File doesn't exist yet, which is fine
      if (error.response && error.response.status !== 404) {
        throw error;
      }
    }
    
    // Commit the file
    const commitMessage = `Update content.json - ${new Date().toISOString()}`;
    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/content.json`,
      {
        message: commitMessage,
        content: encodedContent,
        sha: fileSha,
        branch: GITHUB_BRANCH
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    console.log('Content successfully committed and pushed to GitHub');
    return true;
  } catch (error) {
    console.error('Error committing and pushing to GitHub:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Generic commit/push helper for any file in repo root
async function commitAndPushFile(filename) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.log('GitHub integration not configured. Skipping commit and push for', filename);
    return false;
  }
  try {
    const filePath = path.join(__dirname, '..', filename);
    const fileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    const encodedContent = Buffer.from(fileContent).toString('base64');

    let fileSha = null;
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filename}`,
        { headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' } }
      );
      fileSha = response.data.sha;
    } catch (error) {
      if (!error.response || error.response.status !== 404) throw error;
    }

    const commitMessage = `Update ${filename} - ${new Date().toISOString()}`;
    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filename}`,
      { message: commitMessage, content: encodedContent, sha: fileSha, branch: GITHUB_BRANCH },
      { headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' } }
    );
    console.log(`${filename} committed and pushed to GitHub`);
    return true;
  } catch (error) {
    console.error(`Error committing ${filename} to GitHub:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Save content (to file and to memory for Railway)
async function saveContent(content) {
  // Simple locking mechanism to prevent race conditions
  if (contentLock) {
    // If locked, add to queue and return a promise
    return new Promise((resolve) => {
      lockQueue.push(() => {
        resolve(saveContent(content));
      });
    });
  }
  
  contentLock = true;
  
  try {
    // For Railway, save to in-memory storage
    inMemoryContent = content;
    
    // Also save to file for persistence
    const fileSaveSuccess = saveContentToFile(content);
    
    // Commit and push to GitHub for Render deployment persistence
    if (fileSaveSuccess) {
      await commitAndPushToGitHub(content);
    }
    
    // Clear caches when content is saved
    clearContentCache();
    clearBlogPostsCache();
    
    // Release lock and process queue
    contentLock = false;
    processLockQueue();
    
    // Return true only if file save succeeded
    // File persistence is critical for data to survive server restarts
    return fileSaveSuccess;
  } catch (error) {
    console.error('Error saving content:', error);
    
    // Clear caches even if there's an error
    clearContentCache();
    clearBlogPostsCache();
    
    // Release lock and process queue even if there's an error
    contentLock = false;
    processLockQueue();
    
    // Return false only if both save methods fail
    return false;
  }
}

// Get content (optimized for performance)
function getContent() {
  try {
    // Return in-memory content if available (fastest option)
    if (inMemoryContent !== null) {
      return inMemoryContent;
    }
    
    // Try to load from file if it exists (for initial deployment or server restart)
    const fileContent = loadContentFromFile();
    if (fileContent) {
      inMemoryContent = fileContent;
      return fileContent;
    }
    
    // Return default content
    const defaultContent = {
      aboutContent: "Shukla & Shukla Associates is an award-winning law practice pursuing clarity and justice across business, real estate, criminal, civil, and family matters.\n\nOur cross-disciplinary team works at the intersection of law and strategy, treating every case as unique—meticulous in research, elegant in argument, and client-focused in execution.",
      aboutList1: "Decades of courtroom success & legislative experience",
      aboutList2: "Uncompromising confidentiality & personalized advocacy",
      aboutList3: "Clients across India, from start-ups to families",
      suryanshBio: "With over 15 years of experience in corporate law, civil litigation, and criminal defense, Advocate Suryansh Shukla has established himself as one of Indore's most respected legal minds. He specializes in complex commercial disputes and has successfully represented clients in high-stakes cases across multiple jurisdictions.",
      divyanshBio: "Advocate Divyansh Shukla brings expertise in family law, real estate disputes, and labor & employment matters. His client-focused approach and deep understanding of legal complexities have earned him recognition among both peers and clients.",
      blogPosts: [],
      contactMessages: []
    };
    
    // Cache default content in memory
    inMemoryContent = defaultContent;
    return defaultContent;
  } catch (error) {
    console.error('Error getting content:', error);
    // Return default content in case of error
    const defaultContent = {
      aboutContent: "Shukla & Shukla Associates is an award-winning law practice pursuing clarity and justice across business, real estate, criminal, civil, and family matters.\n\nOur cross-disciplinary team works at the intersection of law and strategy, treating every case as unique—meticulous in research, elegant in argument, and client-focused in execution.",
      aboutList1: "Decades of courtroom success & legislative experience",
      aboutList2: "Uncompromising confidentiality & personalized advocacy",
      aboutList3: "Clients across India, from start-ups to families",
      suryanshBio: "With over 15 years of experience in corporate law, civil litigation, and criminal defense, Advocate Suryansh Shukla has established himself as one of Indore's most respected legal minds. He specializes in complex commercial disputes and has successfully represented clients in high-stakes cases across multiple jurisdictions.",
      divyanshBio: "Advocate Divyansh Shukla brings expertise in family law, real estate disputes, and labor & employment matters. His client-focused approach and deep understanding of legal complexities have earned him recognition among both peers and clients.",
      blogPosts: [],
      contactMessages: []
    };
    
    // Cache default content in memory even in error case
    inMemoryContent = defaultContent;
    return defaultContent;
  }
}

// Function to clear content cache
function clearContentCache() {
  inMemoryContent = null;
}

// Process the lock queue
function processLockQueue() {
  while (lockQueue.length > 0) {
    const next = lockQueue.shift();
    next();
  }
}

// Create transporter for sending emails
let transporter;
try {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  if (EMAIL_USER && EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
    transporter.verify((error) => {
      if (error) {
        console.log('Email transporter configuration error:', error);
      } else {
        console.log('Email transporter is ready to send messages');
      }
    });
  } else {
    console.log('Email credentials not provided; email sending disabled.');
    transporter = null;
  }
} catch (error) {
  console.log('Error initializing email transporter:', error);
  transporter = null;
}

// Auth store helpers (auth.json with hashed password)
const AUTH_FILE = path.join(__dirname, '..', 'auth.json');

function readJsonSafe(fp) {
  try {
    if (!fs.existsSync(fp)) return null;
    const txt = fs.readFileSync(fp, 'utf8');
    if (!txt.trim()) return null;
    return JSON.parse(txt);
  } catch (_) { return null; }
}

function writeJsonSafe(fp, obj) {
  try {
    // backup
    if (fs.existsSync(fp)) fs.copyFileSync(fp, fp + '.backup');
    fs.writeFileSync(fp, JSON.stringify(obj, null, 2));
    return true;
  } catch (e) {
    try { if (fs.existsSync(fp + '.backup')) fs.copyFileSync(fp + '.backup', fp); } catch {}
    return false;
  }
}

function pbkdf2Hash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
}

function getAdminAuth() {
  // Prefer file-based auth if available
  const auth = readJsonSafe(AUTH_FILE);
  if (auth && auth.username && auth.passwordHash && auth.passwordSalt) {
    return { source: 'file', username: auth.username, passwordHash: auth.passwordHash, passwordSalt: auth.passwordSalt, reset: auth.reset || null };
  }
  // Fallback to env, then hardcoded defaults
  const envUser = process.env.ADMIN_USERNAME || 'shukla.suryansh123@gmail.com';
  const envPass = process.env.ADMIN_PASSWORD || '12032003';
  return { source: 'env', username: envUser, envPassword: envPass };
}

function verifyPassword(inputPassword, authRec) {
  if (authRec.passwordHash && authRec.passwordSalt) {
    const calc = pbkdf2Hash(inputPassword, authRec.passwordSalt);
    return crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(authRec.passwordHash));
  }
  // Env/plain fallback
  return inputPassword === authRec.envPassword;
}

// Simple authentication middleware using file/env
function getAuthCandidates() {
  const candidates = [];
  const file = readJsonSafe(AUTH_FILE);
  if (file && file.username && file.passwordHash && file.passwordSalt) {
    candidates.push({ username: file.username, passwordHash: file.passwordHash, passwordSalt: file.passwordSalt });
    return candidates;
  }
  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    candidates.push({ username: process.env.ADMIN_USERNAME, plainPassword: process.env.ADMIN_PASSWORD });
    return candidates;
  }
  // Final fallback (legacy)
  candidates.push({ username: 'shukla.suryansh123@gmail.com', plainPassword: '12032003' });
  return candidates;
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Basic ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }
  const b64 = authHeader.slice(6);
  let decoded = '';
  try { decoded = Buffer.from(b64, 'base64').toString(); } catch (e) {
    res.status(401).json({ success: false, message: 'Invalid authorization header' });
    return;
  }
  const sep = decoded.indexOf(':');
  if (sep === -1) { res.status(401).json({ success: false, message: 'Invalid authorization header' }); return; }
  const username = decoded.slice(0, sep);
  const password = decoded.slice(sep + 1);

  const candidates = getAuthCandidates();
  for (const c of candidates) {
    if (username === c.username) {
      if (c.passwordHash && c.passwordSalt) {
        const calc = pbkdf2Hash(password, c.passwordSalt);
        if (crypto.timingSafeEqual(Buffer.from(calc), Buffer.from(c.passwordHash))) {
          return next();
        }
      } else if (typeof c.plainPassword === 'string' && password === c.plainPassword) {
        return next();
      }
    }
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
}

// Create Express router
const router = express.Router();

// Auth check endpoint for admin login validation
router.get('/auth-check', authenticate, (req, res) => {
  res.json({ success: true });
});

// Middleware to parse JSON bodies with increased limit for base64 images
router.use(express.json({ limit: '1024mb' }));
// Middleware to parse URL-encoded bodies with increased limit
router.use(express.urlencoded({ limit: '1024mb', extended: true }));

// Add middleware to ensure responses are properly formatted
router.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    // Ensure we're not sending undefined or null data
    if (data === undefined || data === null) {
      data = '';
    }
    return originalSend.call(this, data);
  };

  // Lightweight caching for GET endpoints (improves crawl efficiency)
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=5');
  }
  next();
});

// API endpoint to get content
router.get('/content', (req, res) => {
  try {
    // Get content using our new function
    const content = getContent();
    
    if (content) {
      res.json(content);
    } else {
      // Return default content if no content exists
      res.json({
        aboutContent: "Shukla & Shukla Associates is an award-winning law practice pursuing clarity and justice across business, real estate, criminal, civil, and family matters.\n\nOur cross-disciplinary team works at the intersection of law and strategy, treating every case as unique—meticulous in research, elegant in argument, and client-focused in execution.",
        aboutList1: "Decades of courtroom success & legislative experience",
        aboutList2: "Uncompromising confidentiality & personalized advocacy",
        aboutList3: "Clients across India, from start-ups to families",
        suryanshBio: "With over 15 years of experience in corporate law, civil litigation, and criminal defense, Advocate Suryansh Shukla has established himself as one of Indore's most respected legal minds. He specializes in complex commercial disputes and has successfully represented clients in high-stakes cases across multiple jurisdictions.",
        divyanshBio: "Advocate Divyansh Shukla brings expertise in family law, real estate disputes, and labor & employment matters. His client-focused approach and deep understanding of legal complexities have earned him recognition among both peers and clients.",
        blogPosts: [],
        contactMessages: []
      });
    }
  } catch (error) {
    console.error('Error in /content endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint to save content
router.post('/content', authenticate, async (req, res) => {
  try {
    // Get existing content
    let existingContent = getContent() || {};
    
    // Merge new content with existing content
    // This ensures that if a field is not provided in the request, it retains its existing value
    const updatedContent = { ...existingContent, ...req.body };
    
    // Handle image data
    if (req.body.firmLogo) {
      updatedContent.firmLogo = req.body.firmLogo;
    }
    
    if (req.body.suryanshPhoto) {
      updatedContent.suryanshPhoto = req.body.suryanshPhoto;
    }
    
    if (req.body.divyanshPhoto) {
      updatedContent.divyanshPhoto = req.body.divyanshPhoto;
    }
    
    // Save updated content using our new function
    const success = await saveContent(updatedContent);
    
    if (success) {
      // Try pinging search engines about updated sitemap
      try {
        const siteUrl = (req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'].split(',')[0].trim() : req.protocol) + '://' + req.get('host');
        const sitemapUrl = encodeURIComponent(siteUrl + '/sitemap.xml');
        axios.get(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
        axios.get(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
      } catch (_) {}
      res.json({ success: true, message: 'Content saved successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Error saving content' });
    }
  } catch (error) {
    console.error('Error in /content POST endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Simple cache for blog posts
let blogPostsCache = null;
let lastBlogPostsFetch = 0;
const BLOG_CACHE_DURATION = 3000; // 3 seconds cache

// Function to clear blog posts cache
function clearBlogPostsCache() {
  blogPostsCache = null;
  lastBlogPostsFetch = 0;
}

// API endpoint to get blog posts (return all by default; cache briefly)
router.get('/blog-posts', (req, res) => {
  try {
    const content = getContent();
    if (!content) { res.json([]); return; }
    const allPosts = content.blogPosts || [];

    // Newest first by default
    const result = allPosts.slice().reverse();

    // Simple short cache
    const now = Date.now();
    if (blogPostsCache && (now - lastBlogPostsFetch) < BLOG_CACHE_DURATION) {
      res.json(blogPostsCache);
      return;
    }
    blogPostsCache = result;
    lastBlogPostsFetch = now;
    res.json(result);
  } catch (error) {
    console.error('Error in /blog-posts endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint to get a specific blog post by ID
router.get('/blog-posts/:id', (req, res) => {
  try {
    // Get content using our new function
    const content = getContent();
    
    if (content && content.blogPosts) {
      const blogPosts = content.blogPosts || [];
      const post = blogPosts.find(p => p.id == req.params.id);
      
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ success: false, message: 'Blog post not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Blog post not found' });
    }
  } catch (error) {
    console.error('Error in /blog-posts/:id endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// JSON-LD for a specific blog post
router.get('/blog-posts/:id.jsonld', (req, res) => {
  try {
    const content = getContent();
    const blogPosts = (content && content.blogPosts) || [];
    const post = blogPosts.find(p => p.id == req.params.id);
    if (!post) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }
    const proto = (req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'].split(',')[0].trim() : req.protocol);
    const base = `${proto}://${req.get('host')}`;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title || 'Blog Post',
      articleBody: post.content || '',
      datePublished: post.timestamp || new Date().toISOString(),
      author: { '@type': 'Person', name: 'Shukla & Shukla Associates' },
      image: post.photo || undefined,
      mainEntityOfPage: `${base}/#blog`
    };
    res.setHeader('Content-Type', 'application/ld+json');
    res.send(JSON.stringify(data));
  } catch (error) {
    console.error('Error in /blog-posts/:id.jsonld endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint to add a blog post
router.post('/blog-posts', authenticate, async (req, res) => {
  try {
    // Get existing content
    let content = getContent() || {};
    
    // Initialize blogPosts array if it doesn't exist
    if (!content.blogPosts) {
      content.blogPosts = [];
    }
    
    // Add new blog post
    const newPost = {
      id: Date.now(),
      ...req.body
    };
    
    content.blogPosts.push(newPost);
    
    // Save updated content using our new function
    const success = await saveContent(content);
    
    if (success) {
      res.json({ success: true, post: newPost });
    } else {
      res.status(500).json({ success: false, message: 'Error saving blog post' });
    }
  } catch (error) {
    console.error('Error in /blog-posts POST endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint to delete a blog post
router.delete('/blog-posts/:id', authenticate, async (req, res) => {
  try {
    // Get existing content
    const content = getContent();
    
    if (content && content.blogPosts) {
      // Filter out the blog post with the specified ID
      const originalLength = content.blogPosts.length;
      content.blogPosts = content.blogPosts.filter(post => post.id != req.params.id);
      
      // Check if we actually removed a post
      if (content.blogPosts.length < originalLength) {
        // Save updated content using our new function
        const success = await saveContent(content);
        
        if (success) {
          res.json({ success: true, message: 'Blog post deleted successfully' });
          return;
        } else {
          res.status(500).json({ success: false, message: 'Error saving content after deletion' });
          return;
        }
      }
    }
    
    res.json({ success: false, message: 'Blog post not found' });
  } catch (error) {
    console.error('Error in /blog-posts DELETE endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint to update a blog post
router.put('/blog-posts/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    let content = getContent() || {};
    if (!content.blogPosts) content.blogPosts = [];

    const idx = content.blogPosts.findIndex(p => p.id == id);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    // Merge allowed fields from body (title, content, photo)
    const existing = content.blogPosts[idx] || {};
    const updated = { ...existing, ...req.body, id: existing.id };
    content.blogPosts[idx] = updated;

    const success = await saveContent(content);
    if (success) {
      clearBlogPostsCache();
      res.json({ success: true, post: updated });
    } else {
      res.status(500).json({ success: false, message: 'Error saving updated blog post' });
    }
  } catch (error) {
    console.error('Error in /blog-posts PUT endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Gallery storage in separate gallery.json with GitHub persistence
let inMemoryGallery = null;
let galleryLock = false;

function loadGalleryFromFile() {
  try {
    const file = path.join(__dirname, '..', 'gallery.json');
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch (e) {
    console.error('Error loading gallery.json:', e);
    return [];
  }
}

function saveGalleryToFile(items) {
  const file = path.join(__dirname, '..', 'gallery.json');
  try {
    // backup
    if (fs.existsSync(file)) fs.copyFileSync(file, file + '.backup');
    fs.writeFileSync(file, JSON.stringify(items, null, 2));
    return true;
  } catch (e) {
    console.error('Error saving gallery.json:', e);
    try { if (fs.existsSync(file + '.backup')) fs.copyFileSync(file + '.backup', file); } catch {}
    return false;
  }
}

async function saveGallery(items) {
  if (galleryLock) return new Promise(resolve => setTimeout(() => resolve(saveGallery(items)), 50));
  galleryLock = true;
  try {
    inMemoryGallery = items;
    const ok = saveGalleryToFile(items);
    if (ok) await commitAndPushFile('gallery.json');
    galleryLock = false;
    return ok;
  } catch (e) {
    galleryLock = false;
    return false;
  }
}

function getGallery() {
  if (inMemoryGallery !== null) return inMemoryGallery;
  const loaded = loadGalleryFromFile();
  inMemoryGallery = loaded;
  return loaded;
}

// Gallery endpoints (separate file)
router.get('/gallery', (req, res) => {
  try {
    res.json(getGallery());
  } catch (error) {
    console.error('Error in /gallery endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/gallery', authenticate, async (req, res) => {
  try {
    const { photo, caption } = req.body;
    if (!photo) {
      res.status(400).json({ success: false, message: 'Photo is required' });
      return;
    }
    const items = getGallery();
    const item = { id: Date.now(), photo, caption: caption || '', timestamp: new Date().toISOString() };
    items.push(item);
    const ok = await saveGallery(items);
    if (ok) {
      // Ping search engines about updated sitemap
      try {
        const siteUrl = (req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'].split(',')[0].trim() : req.protocol) + '://' + req.get('host');
        const sitemapUrl = encodeURIComponent(siteUrl + '/sitemap.xml');
        axios.get(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
        axios.get(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
      } catch (_) {}
      res.json({ success: true, item });
    }
    else res.status(500).json({ success: false, message: 'Error saving photo' });
  } catch (error) {
    console.error('Error in /gallery POST endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Bulk upload up to 50 photos
router.post('/gallery/bulk', authenticate, async (req, res) => {
  try {
    const { items } = req.body; // array of {photo, caption}
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'items array is required' });
      return;
    }
        const gallery = getGallery();
    const now = Date.now();
    const created = items.map((it, idx) => ({ id: now + idx, photo: it.photo, caption: it.caption || '', timestamp: new Date().toISOString() }));
    gallery.push(...created);
    const ok = await saveGallery(gallery);
    if (ok) {
      try {
        const siteUrl = (req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'].split(',')[0].trim() : req.protocol) + '://' + req.get('host');
        const sitemapUrl = encodeURIComponent(siteUrl + '/sitemap.xml');
        axios.get(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
        axios.get(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
      } catch (_) {}
      res.json({ success: true, count: created.length, items: created });
    }
    else res.status(500).json({ success: false, message: 'Error saving photos' });
  } catch (error) {
    console.error('Error in /gallery/bulk endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/gallery/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const items = getGallery();
    const before = items.length;
    const filtered = items.filter(i => i.id != id);
    if (filtered.length === before) {
      res.json({ success: false, message: 'Photo not found' });
      return;
    }
    const ok = await saveGallery(filtered);
    if (ok) {
      try {
        const siteUrl = (req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'].split(',')[0].trim() : req.protocol) + '://' + req.get('host');
        const sitemapUrl = encodeURIComponent(siteUrl + '/sitemap.xml');
        axios.get(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
        axios.get(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
      } catch (_) {}
      res.json({ success: true, message: 'Photo deleted successfully' });
    }
    else res.status(500).json({ success: false, message: 'Error saving content after deletion' });
  } catch (error) {
    console.error('Error in /gallery DELETE endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint for forgot password (send reset link)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) { res.status(400).json({ success: false, message: 'Email is required' }); return; }

    const admin = getAdminAuth();
    if (!admin || (email !== admin.username)) {
      // Do not reveal whether email exists
      res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
      return;
    }

    // Generate token and store hashed token with expiry
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour

    // Persist to auth.json (create or update)
    const current = readJsonSafe(AUTH_FILE) || { username: admin.username };
    current.reset = { tokenHash, expiresAt };
    const ok = writeJsonSafe(AUTH_FILE, current);
    // Do not commit auth.json on reset-link creation for security and to avoid persisting tokens.
    // The file will be committed only after a successful password change.

    // Send email with link
    const proto = (req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'].split(',')[0].trim() : req.protocol);
    const base = `${proto}://${req.get('host')}`;
    const resetLink = `${base}/admin-reset.html?token=${rawToken}`;

    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'no-reply@example.com',
        to: email,
        subject: 'Password Reset - Shukla & Shukla Associates',
        text: `A password reset was requested for your admin account.\n\nReset Link (valid for 1 hour): ${resetLink}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>A password reset was requested for your admin account.</p><p><a href="${resetLink}">Reset Password</a> (valid for 1 hour)</p><p>If you did not request this, you can ignore this email.</p>`
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) console.error('Error sending reset email:', error);
      });
    }

    // Ping search engines for updated sitemap (optional)
    try {
      const sitemapUrl = encodeURIComponent(base + '/sitemap.xml');
      axios.get(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
      axios.get(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
    } catch (_) {}

    res.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Error in /forgot-password endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint to reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) { res.status(400).json({ success: false, message: 'Token and newPassword are required' }); return; }

    const store = readJsonSafe(AUTH_FILE);
    if (!store || !store.reset || !store.reset.tokenHash || !store.reset.expiresAt) {
      res.status(400).json({ success: false, message: 'Invalid or expired token' });
      return;
    }

    if (Date.now() > Number(store.reset.expiresAt)) {
      res.status(400).json({ success: false, message: 'Token expired' });
      return;
    }

    const suppliedHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenOk = crypto.timingSafeEqual(Buffer.from(suppliedHash), Buffer.from(store.reset.tokenHash));
    if (!tokenOk) { res.status(400).json({ success: false, message: 'Invalid or expired token' }); return; }

    // Update password
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = pbkdf2Hash(newPassword, salt);
    store.username = store.username || (process.env.ADMIN_USERNAME || 'shukla.suryansh123@gmail.com');
    store.passwordSalt = salt;
    store.passwordHash = hash;
    delete store.reset;
    store.updatedAt = new Date().toISOString();

    const ok = writeJsonSafe(AUTH_FILE, store);
    if (!ok) { res.status(500).json({ success: false, message: 'Failed to save new password' }); return; }

    await commitAndPushFile('auth.json');

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in /reset-password endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint for contact form submissions
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Check if all fields are provided
    if (!name || !email || !phone || !message) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, message: 'Please enter a valid email address' });
      return;
    }
    
    // Validate phone number format (remove all non-digit characters and check length)
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      res.status(400).json({ success: false, message: 'Please enter a valid phone number' });
      return;
    }
    
    // Get existing content
    let content = getContent() || {};
    
    // Initialize contactMessages array if it doesn't exist
    if (!content.contactMessages) {
      content.contactMessages = [];
    }
    
    // Add new contact message with timestamp
    const newMessage = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    };
    
    content.contactMessages.push(newMessage);
    
    // Save updated content using our new function
    const success = await saveContent(content);
    
    if (!success) {
      res.status(500).json({ success: false, message: 'Error saving message' });
      return;
    }
    
    // Send confirmation email to the client if transporter is available
    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'no-reply@example.com',
        to: email,
        subject: 'Thank You for Contacting Shukla & Shukla Associates',
        text: `Dear ${name},
        
Thank you for reaching out to Shukla & Shukla Associates. We have received your message and will get back to you within 24 business hours.

Here's a summary of your message:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}

We look forward to assisting you with your legal needs.

Best regards,
Shukla & Shukla Associates
shukla.suryansh123@gmail.com
+91 73899 94519`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending confirmation email:', error);
          // Note: We don't send an error response to the client even if email fails
          // The contact form submission was successful, email is just a notification
        } else {
          console.log('Confirmation email sent: ' + info.response);
        }
      });
    }
    
    res.json({ success: true, message: 'Message sent successfully! A confirmation email has been sent to your email address.' });
  } catch (error) {
    console.error('Error in /contact endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API endpoint to delete a contact message
router.delete('/contact-messages/:id', authenticate, async (req, res) => {
  try {
    // Get existing content
    const content = getContent();
    
    if (content && content.contactMessages) {
      // Find the message with the specified ID
      const messageIndex = content.contactMessages.findIndex(msg => msg.id == req.params.id);
      
      if (messageIndex !== -1) {
        // Remove the message from the array
        content.contactMessages.splice(messageIndex, 1);
        
        // Save updated content using our new function
        const success = await saveContent(content);
        
        if (success) {
          res.json({ success: true, message: 'Message deleted successfully' });
          return;
        } else {
          res.status(500).json({ success: false, message: 'Error saving content after deletion' });
          return;
        }
      }
    }
    
    res.json({ success: false, message: 'Message not found' });
  } catch (error) {
    console.error('Error in /contact-messages DELETE endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Export the router
module.exports = router;