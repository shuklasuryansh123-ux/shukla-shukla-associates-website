# Shukla & Shukla Associates Website

## Overview
Official website for Shukla & Shukla Associates, a law firm based in Indore, India. The site showcases services, founders, a blog, a public gallery, and includes a lightweight admin interface to manage content.

## Features
- Responsive, performant frontend with animations (GSAP)

## Recent UI/UX Enhancements (2025, by GitHub Copilot)

- Hero section revamped with:
  - Animated gradient background matching site color scheme
  - Smooth fadeup text/button animation
  - Well-known quote from Martin Luther King Jr. (no illustration)
- Header navigation now highlights only the active section text (bold/color)
- Hero section visually improved with testimonial quote
- All enhancements preserve backend compatibility and dynamic features
- Admin panel to manage site content
- Blog: add/delete posts with optional images
- Public Gallery: view photos; admin can upload single or up to 50 at once
- Contact form with server-side validation and optional email confirmation
- File-based persistence with automatic backup/recovery
- GitHub persistence for deployments with ephemeral disks (e.g., Render)

## Tech Stack
- Frontend: HTML, CSS, JavaScript, GSAP
- Backend: Node.js, Express
- Email: Nodemailer (Gmail App Password or SMTP creds)

## Getting Started

### Prerequisites
- Node.js 18+ (Node 20.x recommended)
- npm

### Install
```bash
npm install
```

### Run locally
```bash
npm start
# Visit http://localhost:8080
```

### Admin Panel
The admin UI is a static page:
- http://localhost:8080/admin.html

Use it to:
- Update About text and founder bios/photos
- Add blog posts (with image)
- Manage the Gallery (single or bulk upload up to 50 photos)

Authentication is Basic Auth using environment variables:
- ADMIN_USERNAME
- ADMIN_PASSWORD

## Data Persistence
Two separate JSON files are used at the project root:
- content.json: general site content (about, bios, blogPosts, contactMessages)
- gallery.json: gallery items only

Safeguards:
- Backup created before each save (e.g., content.json.backup)
- On parse/save error, attempts restore from backup
- In-memory caching to minimize disk IO

GitHub persistence (recommended on Render):
- After successful save, files are committed and pushed to your GitHub repository via the GitHub API.
- Required environment variables:
  - GITHUB_TOKEN: GitHub Personal Access Token with repo scope
  - GITHUB_REPO: "username/repository"
  - GITHUB_BRANCH: branch name (default: main)

## Environment Variables
Create a .env file for local development (dotenv is loaded automatically) or set these in your hosting provider:

Required for Admin Auth:
- ADMIN_USERNAME=your-admin-email-or-username
- ADMIN_PASSWORD=your-strong-password

Optional (Email confirmations for contact form):
- EMAIL_USER=your-gmail-address@example.com
- EMAIL_PASS=your-app-password
  - For Gmail, use an App Password (2FA must be enabled).

GitHub persistence (set on Render or locally if desired):
- GITHUB_TOKEN=ghp_...
- GITHUB_REPO=username/repository
- GITHUB_BRANCH=main

Other:
- PORT=8080 (optional)

## API
Base path: /api

Content
- GET /api/content
  - Returns current site content JSON.
- POST /api/content (Auth: Basic)
  - Updates content. Supports base64 image data for firmLogo, suryanshPhoto, divyanshPhoto.

Blog
- GET /api/blog-posts
  - Returns the last 10 posts (cached briefly).
- GET /api/blog-posts?all=true
  - Returns all posts (newest first), bypassing the 10-post limit.
- GET /api/blog-posts/:id
  - Returns a single post by ID.
- POST /api/blog-posts (Auth: Basic)
  - Adds a new post; fields merged from body (e.g., title, content, photo).
- DELETE /api/blog-posts/:id (Auth: Basic)
  - Deletes a post by ID.

Gallery
- GET /api/gallery
  - Returns all gallery items.
- POST /api/gallery (Auth: Basic)
  - Add a single photo: { photo: "data-url", caption?: string }.
- POST /api/gallery/bulk (Auth: Basic)
  - Add up to 50 photos at once: { items: Array<{ photo: "data-url", caption?: string }> }.
- DELETE /api/gallery/:id (Auth: Basic)
  - Deletes a gallery item by ID.

Contact
- POST /api/contact
  - Validates and stores the message in content.json, then emails the user (if EMAIL_* configured).

Health
- GET /health
  - Returns server health JSON.

Auth format
- Basic Auth via Authorization header: "Basic base64(username:password)" using ADMIN_USERNAME/ADMIN_PASSWORD.

## Frontend Pages
- index.html: Main site
- admin.html: Admin panel (requires Basic Auth to perform changes)
- gallery.html: Public gallery that fetches /api/gallery and displays a responsive grid

## File Structure (key files)
- index.html
- admin.html
- gallery.html
- styles.css
- script.js
- server.js
- api/index.js (Express router + all API endpoints)
- content.json (auto-created/updated)
- gallery.json (auto-created/updated)
- render.yaml (Render deployment config with env var keys)
- package.json

## Deployment
### Render (recommended for public hosting)
- Ensure the following environment variables are set:
  - NODE_ENV=production
  - PORT=8080
  - RENDER=true
  - ADMIN_USERNAME, ADMIN_PASSWORD
  - EMAIL_USER, EMAIL_PASS (optional)
  - GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH (for persistence)
- Build Command: npm install
- Start Command: node server.js
- The server commits/pushes content.json and gallery.json via GitHub API to persist data across restarts.

### Vercel/Netlify
- The app is a Node server and not purely static. If deploying to a static platform, consider using their serverless functions or use a Node-friendly host.

## Notes & Best Practices
- Images are stored in JSON as data URLs (base64). Consider resizing/compressing images client-side to keep payloads small.
- Never commit real secrets to the repository. Use environment variables.
- .gitignore already excludes .env and backups.

## Support
For any issues, open a GitHub issue or contact the site administrator.
