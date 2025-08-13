const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Create Express app
const app = express();
const port = process.env.PORT || 8080;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(compression());
app.use(cors());

// Body parsing middleware with increased limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static file serving with caching
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Global headers middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance headers
  res.setHeader('X-Robots-Tag', 'all');
  
  // Canonical headers for HTML routes
  if (req.method === 'GET' && (!path.extname(req.path) || req.path.endsWith('.html') || req.path === '/')) {
    const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim();
    const host = req.get('host');
    const pathname = req.path === '' ? '/' : req.path;
    const url = `${proto}://${host}${pathname}`;
    res.setHeader('Link', `<${url}>; rel="canonical"`);
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0'
  });
});

// Google Analytics loader
app.get('/ga.js', (req, res) => {
  const id = process.env.GOOGLE_ANALYTICS_ID || '';
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  if (!id) {
    res.send('// Google Analytics disabled');
    return;
  }
  
  const js = `
    (function(){
      var s=document.createElement('script');
      s.async=1;
      s.src='https://www.googletagmanager.com/gtag/js?id=${id}';
      document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments);}
      window.gtag=gtag;
      gtag('js', new Date());
      gtag('config','${id}',{anonymize_ip:true});
    })();
  `;
  res.send(js);
});

// RSS feed for blog posts
app.get('/rss.xml', (req, res) => {
  try {
    const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim();
    const host = req.get('host');
    const base = `${proto}://${host}`;

    function safeLoad(file) {
      try {
        if (!fs.existsSync(file)) return null;
        const txt = fs.readFileSync(file, 'utf8');
        if (!txt.trim()) return null;
        return JSON.parse(txt);
      } catch (_) { return null; }
    }

    const content = safeLoad(path.join(__dirname, 'content.json')) || {};
    const posts = Array.isArray(content.blogPosts) ? 
      content.blogPosts.slice().sort((a,b) => new Date(b.timestamp||0) - new Date(a.timestamp||0)) : [];

    const items = posts.map(p => {
      const title = (p && p.title) ? p.title : 'Blog Post';
      const desc = (p && p.content) ? String(p.content).replace(/<[^>]*>/g,'').slice(0, 500) : '';
      const link = `${base}/blog/${p.id}`;
      const pubDate = new Date(p.timestamp || Date.now()).toUTCString();
      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[Shukla & Shukla Associates - Blog]]></title>
    <link>${base}</link>
    <description><![CDATA[Latest posts from Shukla & Shukla Associates]]></description>
    <language>en</language>${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(rss);
  } catch (e) {
    console.error('Error generating RSS:', e);
    res.status(500).send('');
  }
});

// Dynamic sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  try {
    const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim();
    const host = req.get('host');
    const base = `${proto}://${host}`;

    function safeLoad(file) {
      try {
        if (!fs.existsSync(file)) return null;
        const txt = fs.readFileSync(file, 'utf8');
        if (!txt.trim()) return null;
        return JSON.parse(txt);
      } catch (_) { return null; }
    }

    const content = safeLoad(path.join(__dirname, 'content.json')) || {};
    const posts = Array.isArray(content.blogPosts) ? content.blogPosts : [];
    const gallery = safeLoad(path.join(__dirname, 'gallery.json')) || [];

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/practice.html', priority: '0.9', changefreq: 'weekly' },
      { url: '/blogs.html', priority: '0.8', changefreq: 'daily' },
      { url: '/gallery.html', priority: '0.7', changefreq: 'weekly' }
    ];

    const blogUrls = posts.map(p => ({
      url: `/blog/${p.id}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: new Date(p.timestamp || Date.now()).toISOString().split('T')[0]
    }));

    const galleryUrls = gallery.map(item => ({
      url: `/gallery/${item.id}`,
      priority: '0.5',
      changefreq: 'monthly'
    }));

    const allUrls = [...staticPages, ...blogUrls, ...galleryUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `
  <url>
    <loc>${base}${url.url}</loc>
    <priority>${url.priority}</priority>
    <changefreq>${url.changefreq}</changefreq>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`).join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(sitemap);
  } catch (e) {
    console.error('Error generating sitemap:', e);
    res.status(500).send('');
  }
});

// API routes
app.use('/api', require('./api/index.js'));

// HTML route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/practice.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'practice.html'));
});

app.get('/blogs.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blogs.html'));
});

app.get('/gallery.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'gallery.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin-reset.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-reset.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔗 Main site: http://localhost:${port}`);
  console.log(`⚙️ Admin panel: http://localhost:${port}/admin.html`);
});

module.exports = app;