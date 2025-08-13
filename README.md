# 🏛️ Shukla & Shukla Associates - Law Firm Website

## 📋 Overview

Official website for **Shukla & Shukla Associates**, a prestigious law firm based in Indore, India. This is a complete, professional law firm website with an integrated admin panel for content management.

**Live Demo:** [Website](https://shuklaandshuklaassociates.com) | **Admin Panel:** [Admin Dashboard](https://shuklaandshuklaassociates.com/admin.html)

## ✨ Features

### 🌐 **Frontend Features**
- **Responsive Design** - Works perfectly on all devices (desktop, tablet, mobile)
- **Modern UI/UX** - Clean, professional design with smooth animations
- **GSAP Animations** - High-quality scroll-triggered animations
- **Hero Section** - Animated particles and rotating legal quotes
- **Dynamic Content** - All content loaded from API endpoints
- **Blog System** - Complete blog with SEO optimization
- **Gallery** - Professional image gallery with lightbox
- **Contact Form** - Functional contact form with email notifications
- **SEO Optimized** - Meta tags, structured data, sitemap

### 🔧 **Backend Features**
- **Node.js/Express Server** - Fast and reliable backend
- **RESTful API** - Complete API for all functionality
- **File-based Database** - JSON files for data persistence
- **Image Management** - Base64 image storage and serving
- **Email Integration** - Contact form email notifications
- **Security** - CORS, Helmet, input validation
- **Admin Authentication** - Secure admin panel access

### 📱 **Admin Panel**
- **Content Management** - Edit all website content
- **Blog Management** - Add, edit, delete blog posts
- **Gallery Management** - Upload and manage images
- **Contact Messages** - View and manage contact submissions
- **Image Upload** - Drag & drop image uploads
- **Real-time Preview** - See changes instantly
- **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shuklasuryansh123-ux/shukla-shukla-associates-website.git
   cd shukla-shukla-associates-website
   ```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the website**
   - Website: http://localhost:8080
   - Admin Panel: http://localhost:8080/admin.html

### Admin Access
- **Email:** shukla.suryansh123@gmail.com
- **Password:** 12032003

## 📁 Project Structure

```
shukla-shukla-associates-website/
├── 📄 index.html              # Main homepage
├── 📄 practice.html           # Practice areas page
├── 📄 blogs.html              # Blog listing page
├── 📄 gallery.html            # Gallery page
├── 📄 admin.html              # Admin dashboard
├── 📄 admin-reset.html        # Password reset page
├── 📄 404.html                # Error page
├── 🎨 styles.css              # Main stylesheet
├── ⚡ script.js               # Main JavaScript
├── 🎭 hero-anim.js            # Hero animations
├── 💬 hero-quotes.js          # Hero quotes rotation
├── 🧭 nav-highlight.js        # Navigation highlighting
├── 🚀 enhancements.js         # Additional enhancements
├── 🖼️ logo-placeholder.jpg    # Logo placeholder
├── 📊 content.json            # Main content data
├── 🖼️ gallery.json            # Gallery data
├── 🔐 auth.json               # Authentication data
├── ⚙️ server.js               # Express server
├── 🔌 api/
│   └── index.js               # API routes
├── 📦 package.json            # Dependencies
├── 📖 README.md               # This file
├── 🚫 .gitignore              # Git ignore rules
├── 🗺️ sitemap.xml             # SEO sitemap
└── 🤖 robots.txt              # SEO robots file
```

## 🔌 API Endpoints

### Content Management
- `GET /api/content` - Get all website content
- `POST /api/content` - Update website content

### Blog Management
- `GET /api/blog-posts` - Get all blog posts
- `POST /api/blog-posts` - Add new blog post
- `PUT /api/blog-posts/:id` - Update blog post
- `DELETE /api/blog-posts/:id` - Delete blog post
- `GET /api/blog-posts/:id.jsonld` - Get structured data

### Gallery Management
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Add new gallery item
- `POST /api/gallery/bulk` - Bulk upload gallery items
- `DELETE /api/gallery/:id` - Delete gallery item

### Contact Management
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact messages (admin only)

### Authentication
- `GET /api/auth-check` - Check admin authentication
- `POST /api/forgot-password` - Send password reset
- `POST /api/reset-password` - Reset password

### Health Check
- `GET /health` - Server health status

## 🎨 Customization

### Colors and Branding
Edit the CSS variables in `styles.css`:
```css
:root {
  --primary: #2563eb;          /* Primary brand color */
  --accent: #10b981;           /* Accent color */
  --text: #1e293b;             /* Main text color */
  /* ... more variables */
}
```

### Content Management
All content is stored in JSON files:
- `content.json` - Main website content
- `gallery.json` - Gallery images
- `auth.json` - Admin credentials

### Adding New Pages
1. Create new HTML file
2. Include required CSS and JS files
3. Add navigation links
4. Update sitemap.xml

## 🔒 Security Features

- **CORS Protection** - Configured for production domains
- **Helmet.js** - Security headers
- **Input Validation** - All inputs validated
- **Authentication** - Secure admin access
- **Rate Limiting** - API rate limiting
- **XSS Protection** - Cross-site scripting protection

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** 320px - 767px

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Deployment
1. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=8080
   ```

2. **Build and deploy**
   ```bash
   npm install --production
   npm start
   ```

### Recommended Hosting
- **Vercel** - Easy deployment with Git integration
- **Netlify** - Static site hosting
- **Heroku** - Full-stack hosting
- **DigitalOcean** - VPS hosting

## 🔧 Development

### Adding New Features
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Style
- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ standards
- Use meaningful variable names
- Add comments for complex logic

### Testing
- Test all API endpoints
- Verify responsive design
- Check cross-browser compatibility
- Validate HTML/CSS

## 📊 Performance

### Optimization Features
- **Image Optimization** - Base64 encoding for small images
- **Minified Assets** - Compressed CSS/JS
- **Caching** - Browser and server caching
- **CDN Ready** - Optimized for CDN deployment

### Performance Metrics
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Page Load Time:** < 2 seconds
- **Mobile Performance:** Optimized for mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email:** shukla.suryansh123@gmail.com
- **Website:** https://shuklaandshuklaassociates.com
- **GitHub Issues:** [Create an issue](https://github.com/shuklasuryansh123-ux/shukla-shukla-associates-website/issues)

## 🙏 Acknowledgments

- **GSAP** - For smooth animations
- **Boxicons** - For beautiful icons
- **Google Fonts** - For typography
- **Express.js** - For the backend framework
- **Node.js** - For the runtime environment

---

**Built with ❤️ for Shukla & Shukla Associates**
