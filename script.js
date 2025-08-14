// Load content from server
function loadContentFromServer() {
  console.log('Loading content from server...');
  // Return a promise for better error handling
  return fetch('/api/content')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Content loaded successfully:', data);
      // Load About section content
      const aboutContent = data.aboutContent;
      if (aboutContent) {
        const aboutParagraphs = aboutContent.split('\n\n');
        const aboutSection = document.querySelector('#about .about-bloc');
        if (aboutSection) {
          // Clear existing content
          aboutSection.innerHTML = '<h2>About the Firm</h2>';

          // Add paragraphs
          aboutParagraphs.forEach(paragraph => {
            if (paragraph.trim() !== '') {
              const p = document.createElement('p');
              p.textContent = paragraph;
              aboutSection.appendChild(p);
            }
          });

          // Add list items
          const listItems = [
            data.aboutList1 || 'Decades of courtroom success & legislative experience',
            data.aboutList2 || 'Uncompromising confidentiality & personalized advocacy',
            data.aboutList3 || 'Clients across India, from start-ups to families'
          ];

          const ul = document.createElement('ul');
          ul.className = 'about-list';
          listItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
          });
          aboutSection.appendChild(ul);
        }
      }

      // Load Founders section content
      const suryanshBio = data.suryanshBio;
      const divyanshBio = data.divyanshBio;

      if (suryanshBio || divyanshBio) {
        const foundersSection = document.querySelector('.founders-section');
        if (foundersSection) {
          // Clear existing content
          foundersSection.innerHTML = '<div class="container"><h2>Founders</h2></div>';

          const container = foundersSection.querySelector('.container');

          // Add Suryansh Shukla
          if (suryanshBio) {
            const founderDiv = document.createElement('div');
            founderDiv.className = 'founder';
            founderDiv.innerHTML = `
              <div class="founder-photo">
                <img src="${data.suryanshPhoto || ''}" alt="Advocate Suryansh Shukla" />
              </div>
              <div class="founder-info">
                <h3>Advocate Suryansh Shukla</h3>
                <p class="founder-bio">${suryanshBio}</p>
              </div>
            `;
            container.appendChild(founderDiv);
          }

          // Add Divyansh Shukla
          if (divyanshBio) {
            const founderDiv = document.createElement('div');
            founderDiv.className = 'founder';
            founderDiv.innerHTML = `
              <div class="founder-photo">
                <img src="${data.divyanshPhoto || ''}" alt="Advocate Divyansh Shukla" />
              </div>
              <div class="founder-info">
                <h3>Advocate Divyansh Shukla</h3>
                <p class="founder-bio">${divyanshBio}</p>
              </div>
            `;
            container.appendChild(founderDiv);
          }
        }
      }

      // Load logo image
      const logoImage = data.aboutLogo;
      if (logoImage) {
        const logoElement = document.querySelector('#about .about-visual img');
        if (logoElement) {
          logoElement.src = logoImage;
        }
      }

      // Load logo image
      const firmLogo = data.firmLogo;
      if (firmLogo) {
        const firmLogoElement = document.getElementById('firmLogoImage');
        if (firmLogoElement) {
          firmLogoElement.src = firmLogo;
        }
      }

      // Load founder images
      const suryanshPhoto = data.suryanshPhoto;
      if (suryanshPhoto) {
        const suryanshPhotoElement = document.getElementById('suryanshPhotoImage');
        if (suryanshPhotoElement) {
          suryanshPhotoElement.src = suryanshPhoto;
        }
      }

      const divyanshPhoto = data.divyanshPhoto;
      if (divyanshPhoto) {
        const divyanshPhotoElement = document.getElementById('divyanshPhotoImage');
        if (divyanshPhotoElement) {
          divyanshPhotoElement.src = divyanshPhoto;
        }
      }

      // Load blog posts
      return loadBlogPosts();
    })
    .catch(err => {
      console.error('Error loading content from server:', err);
      // Fallback to localStorage if server request fails
      loadContentFromStorage();
      throw err; // Re-throw to maintain promise chain
    });
}

// Safe fallback to avoid ReferenceError if server content fails
function loadContentFromStorage() {
  try {
    const c = JSON.parse(localStorage.getItem('siteContent') || 'null');
    if (c && c.aboutContent) {
      const aboutSection = document.querySelector('#about .about-bloc');
      if (aboutSection && !aboutSection.querySelector('p')) {
        const p = document.createElement('p');
        p.textContent = c.aboutContent.split('\n\n')[0];
        aboutSection.appendChild(p);
      }
    }
  } catch (_) { }
}

function loadBlogPosts() {
  console.log('Loading blog posts...');
  // Return a promise for better error handling
  return fetch('/api/blog-posts')
    .then(response => response.json())
    .then(blogPosts => {
      console.log('Blog posts loaded:', blogPosts);
      const blogContainer = document.querySelector('.blog-slider');
      if (blogContainer) {
        // Clear existing posts
        blogContainer.innerHTML = '';

        // Add subtitle if it doesn't exist
        const blogSection = document.querySelector('.blog-section .container');
        if (blogSection && !blogSection.querySelector('.blog-subtitle')) {
          const subtitle = document.createElement('p');
          subtitle.className = 'blog-subtitle';
          subtitle.textContent = 'Insights from our legal expertise and case experiences';
          blogSection.insertBefore(subtitle, blogContainer);
        }

        // Latest 3 posts only, newest first
        const latest = (blogPosts || []).slice(-3).reverse();
        if (latest.length > 0) {
          latest.forEach(post => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';

            // Clean excerpt
            let excerpt = (post.content || '').replace(/<[^>]*>/g, '');
            excerpt = excerpt.length > 150 ? excerpt.substring(0, 140).replace(/\s\S*$/, '') + '...' : excerpt;

            // Format date
            const postDate = new Date(post.timestamp || Date.now());
            const formattedDate = postDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            blogCard.innerHTML = `
              ${post.photo ? `<div class="blog-image"><img src="${post.photo}" alt="${post.title}" loading="lazy"></div>` : ''}
              <div class="blog-content">
                <div class="blog-meta">
                  <span class="blog-date">${formattedDate}</span>
                </div>
                <h3>${post.title}</h3>
                <div class="blog-excerpt rich-text-content">${excerpt}</div>
              </div>
            `;

            // Make entire card clickable
            blogCard.style.cursor = 'pointer';
            blogCard.setAttribute('data-post-id', post.id);
            blogCard.addEventListener('click', function () {
              loadBlogPost(post.id);
            });
            blogContainer.appendChild(blogCard);
          });

          // Render rich text content for blog posts
          if (window.richTextRenderer) {
            window.richTextRenderer.renderByClass('blog-excerpt');
          }

          // Add left/right nav buttons
          (function addNav(container) {
            const wrapper = container.parentElement; if (!wrapper) return;
            const existingNav = wrapper.querySelector('.strip-nav');
            if (existingNav) existingNav.remove();
            const nav = document.createElement('div');
            nav.className = 'strip-nav';
            nav.style.display = 'flex';
            nav.style.justifyContent = 'space-between';
            nav.style.alignItems = 'center';
            nav.style.margin = '8px 0 0';
            const left = document.createElement('button'); left.textContent = '‹';
            const right = document.createElement('button'); right.textContent = '›';
            [left, right].forEach(btn => {
              btn.className = 'btn-primary blog-nav-btn';
              btn.style.border = 'none';
              btn.style.background = 'var(--slate)';
              btn.style.color = '#fff';
              btn.style.borderRadius = '12px';
              btn.style.padding = '10px 16px';
              btn.style.fontWeight = '700';
              btn.style.fontSize = '1.3rem';
              btn.style.margin = '0 8px';
              btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              btn.style.cursor = 'pointer';
              btn.style.transition = 'background 0.2s';
            });
            left.addEventListener('click', () => { container.scrollLeft -= Math.max(300, container.clientWidth * 0.8); });
            right.addEventListener('click', () => { container.scrollLeft += Math.max(300, container.clientWidth * 0.8); });
            nav.appendChild(left); nav.appendChild(right);
            wrapper.appendChild(nav);
          })(blogContainer);

          // Enhanced swipe/drag support with touch events
          (function makeSwipeable(container) {
            let isDown = false, startX, scrollLeft;

            // Mouse events
            container.addEventListener('mousedown', e => {
              isDown = true;
              container.classList.add('dragging');
              startX = e.pageX - container.offsetLeft;
              scrollLeft = container.scrollLeft;
            });

            container.addEventListener('mouseleave', () => {
              isDown = false;
              container.classList.remove('dragging');
            });

            container.addEventListener('mouseup', () => {
              isDown = false;
              container.classList.remove('dragging');
            });

            container.addEventListener('mousemove', e => {
              if (!isDown) return;
              e.preventDefault();
              const x = e.pageX - container.offsetLeft;
              const walk = (x - startX) * 2;
              container.scrollLeft = scrollLeft - walk;
            });

            // Touch events for mobile
            container.addEventListener('touchstart', e => {
              isDown = true;
              container.classList.add('dragging');
              startX = e.touches[0].pageX - container.offsetLeft;
              scrollLeft = container.scrollLeft;
            });

            container.addEventListener('touchend', () => {
              isDown = false;
              container.classList.remove('dragging');
            });

            container.addEventListener('touchmove', e => {
              if (!isDown) return;
              e.preventDefault();
              const x = e.touches[0].pageX - container.offsetLeft;
              const walk = (x - startX) * 2;
              container.scrollLeft = scrollLeft - walk;
            });

            // Wheel scroll support
            container.addEventListener('wheel', e => {
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                container.scrollLeft += e.deltaY;
                e.preventDefault();
              }
            }, { passive: false });
            container.addEventListener('touchmove', e => { if (!isDown) return; const x = e.touches[0].pageX; const walk = (x - startX); container.scrollLeft = scrollLeft - walk; }, { passive: true });
          })(blogContainer);

          // Reveal animation for cards
          (function revealCards() {
            if (typeof gsap === 'undefined') return;
            const cards = blogContainer.querySelectorAll('.blog-card');
            cards.forEach((c, i) => {
              gsap.fromTo(c, { opacity: 0, y: 20, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, delay: i * 0.06, ease: 'power2.out' });
            });
          })();

          // Remove any previous See all blogs actions
          const existing = blogContainer.parentElement.querySelector('#seeAllBlogsActions');
          if (existing) existing.remove();
          // Append See all blogs button
          const actions = document.createElement('div');
          actions.id = 'seeAllBlogsActions';
          actions.style.textAlign = 'center';
          actions.style.marginTop = '1.2rem';
          actions.innerHTML = `<a href="/blogs.html" class="btn-primary" style="display:inline-block;">See all blogs</a>`;
          blogContainer.parentElement.appendChild(actions);
        } else {
          blogContainer.innerHTML = '<p style="text-align: center; width: 100%;">No blog posts available yet.</p>';
        }
      }
    })
    .catch(err => {
      console.error('Error loading blog posts from server:', err);
      const blogContainer = document.querySelector('.blog-slider');
      if (blogContainer) {
        blogContainer.innerHTML = '<p style="text-align: center; width: 100%;">Error loading blog posts. Please try again later.</p>';
      }
      throw err; // Re-throw to maintain promise chain
    });
}

// Build the Gallery strip on the homepage (latest 5)
function loadGalleryStrip() {
  console.log('Loading gallery strip...');
  const strip = document.querySelector('.gallery-strip');
  if (!strip) return Promise.resolve();
  return fetch('/api/gallery')
    .then(r => r.json())
    .then(items => {
      strip.innerHTML = '';
      strip.style.display = 'flex';
      strip.style.gap = '16px';
      strip.style.overflow = 'hidden';
      strip.style.scrollBehavior = 'smooth';
      strip.style.padding = '4px 2px';
      const ordered = (items || []).slice().sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)).slice(0, 5);
      ordered.forEach(it => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.style.minWidth = 'clamp(220px, 24vw, 300px)';
        card.style.flex = '0 0 auto';
        card.style.background = 'var(--surface-weak)';
        card.style.borderRadius = '12px';
        card.style.boxShadow = '0 10px 24px rgba(0,0,0,.08)';
        card.style.overflow = 'hidden';
        card.innerHTML = `
          <div style="width:100%; height:180px; background:#111;">
            ${it.photo ? `<img src="${it.photo}" alt="Gallery Image" style="width:100%; height:100%; object-fit:cover; display:block;">` : ''}
          </div>
          ${it.caption ? `<div style="padding:10px 12px; color:#444;">${it.caption}</div>` : ''}
        `;
        strip.appendChild(card);
      });
      // Add left/right nav buttons
      (function addNav(container) {
        const wrapper = container.parentElement; if (!wrapper) return;
        const existingNav = wrapper.querySelector('.strip-nav');
        if (existingNav) existingNav.remove();
        const nav = document.createElement('div');
        nav.className = 'strip-nav';
        nav.style.display = 'flex';
        nav.style.justifyContent = 'space-between';
        nav.style.alignItems = 'center';
        nav.style.margin = '8px 0 0';
        const left = document.createElement('button'); left.textContent = '‹';
        const right = document.createElement('button'); right.textContent = '›';
        [left, right].forEach(btn => { btn.style.border = 'none'; btn.style.background = '#1f2937'; btn.style.color = '#fff'; btn.style.borderRadius = '10px'; btn.style.padding = '8px 12px'; btn.style.fontWeight = '700'; });
        left.addEventListener('click', () => { container.scrollLeft -= Math.max(300, container.clientWidth * 0.8); });
        right.addEventListener('click', () => { container.scrollLeft += Math.max(300, container.clientWidth * 0.8); });
        nav.appendChild(left); nav.appendChild(right);
        wrapper.appendChild(nav);
      })(strip);

      // swipe/drag support
      (function makeSwipeable(container) {
        let isDown = false, startX, scrollLeft;
        container.addEventListener('mousedown', e => { isDown = true; container.classList.add('dragging'); startX = e.pageX - container.offsetLeft; scrollLeft = container.scrollLeft; });
        container.addEventListener('mouseleave', () => { isDown = false; container.classList.remove('dragging'); });
        container.addEventListener('mouseup', () => { isDown = false; container.classList.remove('dragging'); });
        container.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - container.offsetLeft; const walk = (x - startX); container.scrollLeft = scrollLeft - walk; });
        container.addEventListener('wheel', e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { container.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
        container.addEventListener('touchstart', e => { isDown = true; startX = e.touches[0].pageX; scrollLeft = container.scrollLeft; }, { passive: true });
        container.addEventListener('touchend', () => { isDown = false; });
        container.addEventListener('touchmove', e => { if (!isDown) return; const x = e.touches[0].pageX; const walk = (x - startX); container.scrollLeft = scrollLeft - walk; }, { passive: true });
      })(strip);

      // Reveal animation for gallery cards
      (function revealStrip() {
        if (typeof gsap === 'undefined') return;
        const cards = strip.querySelectorAll('.gallery-card');
        cards.forEach((c, i) => {
          gsap.fromTo(c, { opacity: 0, y: 20, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, delay: i * 0.06, ease: 'power2.out' });
        });
      })();
    })
    .catch((err) => {
      console.error('Error loading gallery strip:', err);
    });
}

// ===== COMPLETELY REVAMPED NAVIGATION SYSTEM =====

// Main site navigation - completely isolated from admin
class MainSiteNavigation {
  constructor() {
    this.init();
  }

  init() {
    // Only initialize if we're on the main site (not admin)
    if (document.querySelector('.main-site-nav')) {
      this.setupNavigation();
      this.setupMobileMenu();
      this.setupDropdowns();
      this.setupScrollEffects();
    }
  }

  setupNavigation() {
    this.nav = document.querySelector('.main-site-nav');
    this.menuToggle = this.nav?.querySelector('.menu-toggle');
    this.navList = this.nav?.querySelector('.nav-list');
    this.mobileClose = this.nav?.querySelector('.mobile-menu-close');
    this.overlay = this.nav?.querySelector('.mobile-menu-overlay');

    if (!this.nav) return;
  }

  setupMobileMenu() {
    if (!this.menuToggle || !this.navList) return;

    // Mobile menu toggle
    this.menuToggle.addEventListener('click', () => {
      this.openMobileMenu();
    });

    // Mobile menu close
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navList.classList.contains('show')) {
        this.closeMobileMenu();
      }
    });
  }

  openMobileMenu() {
    this.navList.classList.add('show');
    this.overlay?.classList.add('show');
    this.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.navList.classList.remove('show');
    this.overlay?.classList.remove('show');
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Close all dropdowns
    this.nav.querySelectorAll('.dropdown.open').forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }

  setupDropdowns() {
    const dropdowns = this.nav?.querySelectorAll('.dropdown');
    if (!dropdowns) return;

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-trigger');
      const submenu = dropdown.querySelector('.submenu');

      if (!trigger || !submenu) return;

      let hoverTimeout;

      // Desktop hover events with improved timing
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        if (window.innerWidth > 900) {
          this.closeAllDropdowns();
          this.openDropdown(dropdown);
        }
      });

      dropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > 900) {
          hoverTimeout = setTimeout(() => {
            this.closeDropdown(dropdown);
          }, 150); // Small delay to prevent accidental closing
        }
      });

      // Prevent submenu from closing when hovering over it
      submenu.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
      });

      submenu.addEventListener('mouseleave', () => {
        if (window.innerWidth > 900) {
          hoverTimeout = setTimeout(() => {
            this.closeDropdown(dropdown);
          }, 150);
        }
      });

      // Mobile click events
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          e.stopPropagation();
          this.toggleDropdown(dropdown);
        }
      });

      // Keyboard support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.innerWidth <= 900) {
            this.toggleDropdown(dropdown);
          }
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => this.closeDropdown(dropdown));
      }
    });

    // Close dropdowns on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach(dropdown => this.closeDropdown(dropdown));
      }
    });
  }

  openDropdown(dropdown) {
    dropdown.classList.add('open');
  }

  closeDropdown(dropdown) {
    dropdown.classList.remove('open');
  }

  closeAllDropdowns() {
    this.nav.querySelectorAll('.dropdown.open').forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }

  toggleDropdown(dropdown) {
    if (dropdown.classList.contains('open')) {
      this.closeDropdown(dropdown);
    } else {
      // Close other dropdowns first
      this.nav.querySelectorAll('.dropdown.open').forEach(d => {
        if (d !== dropdown) this.closeDropdown(d);
      });
      this.openDropdown(dropdown);
    }
  }

  setupScrollEffects() {
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add/remove scrolled class for styling
      if (scrollTop > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }

      // Hide/show nav on scroll (optional)
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        this.nav.style.transform = 'translateY(-100%)';
      } else {
        this.nav.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop;
    });
  }
}

// ===== OPTIMIZED ANIMATION SYSTEM =====

// Single DOMContentLoaded listener to prevent conflicts
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - Starting optimized website initialization...');

  // Initialize navigation (disabled - using enhancements.js instead)
  // new MainSiteNavigation();

  // Mark preloading state to avoid abrupt reveal
  document.body.classList.add('is-loading');

  // Load content from server with error handling
  loadContentFromServer().then(() => {
    console.log('Content loaded successfully');
  }).catch((error) => {
    console.error('Failed to load content:', error);
  });

  // Build homepage gallery strip
  loadGalleryStrip().then(() => {
    console.log('Gallery strip loaded successfully');
  }).catch((error) => {
    console.error('Failed to load gallery strip:', error);
  });

  // Initialize animations after content is loaded
  initializeAnimations();

  // Theme initialization and animated toggle (sun/moon)
  console.log('DOM Content Loaded - Starting website initialization...');
  // Mark preloading state to avoid abrupt reveal
  document.body.classList.add('is-loading');

  // Load content from server with error handling
  loadContentFromServer().then(() => {
    console.log('Content loaded successfully');
  }).catch((error) => {
    console.error('Failed to load content:', error);
  });

  // Build homepage gallery strip
  loadGalleryStrip().then(() => {
    console.log('Gallery strip loaded successfully');
  }).catch((error) => {
    console.error('Failed to load gallery strip:', error);
  });

  // Theme initialization and animated toggle (sun/moon)
  const themeToggleButton = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  // Always start in light mode unless user has explicitly chosen dark mode
  const initialTheme = savedTheme || 'light';
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');

  // Inject minimal CSS to ensure the toggle has no default button chrome and the hidden text is actually hidden
  (function injectThemeToggleCSS() {
    const css = `
      .theme-toggle-btn{background:transparent;border:0;padding:0;margin-left:1rem;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;}
      .theme-toggle-btn:focus{outline: none;}
      .theme-toggle-btn:focus-visible{outline:2px solid var(--accent); outline-offset:2px; border-radius:999px;}
      .visually-hidden{position:absolute !important;height:1px;width:1px;overflow:hidden;clip:rect(1px, 1px, 1px, 1px);white-space:nowrap;border:0;padding:0;margin:-1px;}
      .toggle-track{background:var(--surface-strong);border:1px solid var(--border);border-radius:999px;width:64px;height:32px;display:inline-block;box-shadow: inset 0 1px 3px rgba(0,0,0,.1);}
      .toggle-knob{background:var(--white);border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.18);}
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  })();

  if (themeToggleButton) {
    const isDarkInit = initialTheme === 'dark';
    themeToggleButton.setAttribute('aria-pressed', String(isDarkInit));
    themeToggleButton.setAttribute('role', 'switch');
    themeToggleButton.setAttribute('aria-label', 'Toggle dark mode');

    // Build switch UI if not present
    if (!themeToggleButton.querySelector('.toggle-track')) {
      themeToggleButton.innerHTML = `
        <span class="visually-hidden">Toggle dark mode</span>
        <div class="toggle-track" style="position:relative; width:64px; height:32px; background:var(--surface-strong); border:1px solid var(--border); border-radius:999px; display:inline-block; box-shadow: inset 0 1px 3px rgba(0,0,0,.1);"></div>
      `;
      const track = themeToggleButton.querySelector('.toggle-track');
      const sun = document.createElement('div');
      sun.className = 'toggle-icon toggle-icon--left';
      sun.setAttribute('aria-hidden', 'true');
      sun.textContent = '☀️';
      sun.style.cssText = 'position:absolute; left:8px; top:50%; transform:translateY(-50%); pointer-events:none; font-size:14px; opacity:1;';
      const moon = document.createElement('div');
      moon.className = 'toggle-icon toggle-icon--right';
      moon.setAttribute('aria-hidden', 'true');
      moon.textContent = '🌙';
      moon.style.cssText = 'position:absolute; right:8px; top:50%; transform:translateY(-50%); pointer-events:none; font-size:14px; opacity:.25;';
      const knob = document.createElement('div');
      knob.className = 'toggle-knob';
      knob.style.cssText = 'position:absolute; left:2px; top:2px; width:28px; height:28px; background:var(--white); border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,.18);';
      track.appendChild(sun); track.appendChild(moon); track.appendChild(knob);
    }

    const track = themeToggleButton.querySelector('.toggle-track');
    const knob = themeToggleButton.querySelector('.toggle-knob');
    const sun = themeToggleButton.querySelector('.toggle-icon--left');
    const moon = themeToggleButton.querySelector('.toggle-icon--right');

    function setPositions(isDark, immediate) {
      if (!track || !knob) return;
      const w = track.clientWidth || 64;
      const r = knob.clientWidth || 28;
      const travel = Math.max(0, w - r - 4); // 2px padding each side
      const x = isDark ? travel : 0;
      if (typeof gsap !== 'undefined') {
        gsap.to(knob, { x, duration: immediate ? 0 : 0.35, ease: 'power2.out' });
        if (sun && moon) {
          gsap.to(sun, { opacity: isDark ? 0.25 : 1, duration: immediate ? 0 : 0.25, ease: 'power1.out' });
          gsap.to(moon, { opacity: isDark ? 1 : 0.25, duration: immediate ? 0 : 0.25, ease: 'power1.out' });
        }
        gsap.fromTo(knob, { rotate: isDark ? 0 : 180 }, { rotate: isDark ? 180 : 0, duration: immediate ? 0 : 0.35, ease: 'power2.out' });
      } else {
        knob.style.transform = `translateX(${x}px)`;
        if (sun && moon) { sun.style.opacity = isDark ? '0.25' : '1'; moon.style.opacity = isDark ? '1' : '0.25'; }
      }
    }

    // Initial position
    setTimeout(() => setPositions(isDarkInit, true), 0);

    themeToggleButton.addEventListener('click', () => {
      const isDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggleButton.setAttribute('aria-pressed', String(isDark));
      setPositions(isDark, false);
    });
  }


  // Loader (GSAP enhanced)
  const loader = document.getElementById('loader');
  if (loader) {
    const circle = loader.querySelector('.loader-circle');
    const logo = loader.querySelector('.loader-logo');
    if (typeof gsap !== 'undefined') {
      gsap.set([circle, logo], { opacity: 0, y: 10 });
      // Intro reveal
      gsap.timeline()
        .to(logo, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
        .to(circle, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 0.1);
      // Continuous subtle motion
      gsap.to(circle, { rotate: 360, repeat: -1, duration: 1.2, ease: 'linear' });
      gsap.to(circle, { scale: 1.06, repeat: -1, yoyo: true, duration: 0.8, ease: 'sine.inOut' });
    }
    const revealContent = () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(['.header', 'main', '.footer'], { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.05 });
      } else {
        document.querySelectorAll('.header, main, .footer').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      }
      document.body.classList.remove('is-loading');
    };

    const hideLoader = () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(loader, { opacity: 0, duration: 0.45, ease: 'power2.out', onComplete() { loader.style.display = 'none'; revealContent(); } });
      } else {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; revealContent(); }, 450);
      }
    };
    // Minimum display time before fade-out
    setTimeout(hideLoader, 1200);
  } else {
    // No loader present; ensure content is visible
    document.body.classList.remove('is-loading');
  }

  // Hero blob disabled for new hero design
  const enableBlob = false;
  const morphPath = document.getElementById('morphPath');
  const heroBlobMorphs = [
    "M370,370Q370,540,185,540Q0,540,0,370Q0,200,185,200Q370,200,370,370Z", // initial
    "M320,380Q370,540,75,515Q15,395,60,320Q80,185,185,180Q340,100,372,220Q448,328,320,380Z",  // slightly stretched
    "M370,370Q444,510,210,520Q10,415,110,330Q140,170,260,180Q480,70,544,225Q572,344,370,370Z",
    "M300,300Q400,600,100,500Q0,400,50,300Q100,200,200,200Q300,200,300,300Z",
    "M400,400Q500,700,150,600Q50,500,100,400Q150,300,250,300Q350,300,400,400Z"
  ];
  let morphIndex = 0;
  if (enableBlob && morphPath) {
    setInterval(() => {
      morphIndex = (morphIndex + 1) % heroBlobMorphs.length;
      gsap.to(morphPath, { duration: 2, attr: { d: heroBlobMorphs[morphIndex] }, ease: "power1.inOut" });
    }, 3400);
  }

  // Add floating animation to the blob
  if (enableBlob) {
    gsap.to(".hero-blob", {
      y: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }

  // Animation preferences
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // GSAP hero staggered fade in (enhanced)
  if (!prefersReduced) {
    gsap.set(".hero-title .fadeup, .hero-subtext, .btn-primary, .btn-secondary, .hero-stats .stat, .hero-card, .hero-highlights li", { opacity: 0, y: 32, filter: "blur(6px)" });
    gsap.timeline()
      .to(".hero-title .fadeup", { y: 0, opacity: 1, filter: "blur(0px)", stagger: .06, duration: .7, ease: "power3.out" }, 0.2)
      .to(".hero-subtext", { y: 0, opacity: 1, filter: "blur(0px)", duration: .9, ease: "power2.out" }, "-=.2")
      .to(".btn-primary", { y: 0, opacity: 1, filter: "blur(0px)", duration: .8, ease: "power3.out" }, "-=.45")
      .to(".btn-secondary", { y: 0, opacity: 1, filter: "blur(0px)", duration: .7, ease: "power3.out" }, "-=.5")
      .to(".hero-card", { y: 0, opacity: 1, filter: "blur(0px)", duration: .75, ease: "power3.out" }, "-=.4")
      .to(".hero-stats .stat", { y: 0, opacity: 1, filter: "blur(0px)", duration: .6, ease: "power2.out", stagger: .06 }, "-=.5")
      .to(".hero-highlights li", { y: 0, opacity: 1, filter: "blur(0px)", duration: .6, ease: "power2.out", stagger: .06 }, "-=.5");

    // Subtle parallax on hero gradient
    const gradient = document.querySelector(".hero-gradient");
    if (gradient) {
      gsap.to(gradient, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
      });
    }
  }

  // Section reveals (enhanced) - Fixed to trigger earlier
  if (!prefersReduced) {
    gsap.utils.toArray(".reveal").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 30, filter: "blur(6px)" }, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none none" }
      });
    });
  }

  // Stagger in service and review cards (enhanced) - Fixed to trigger earlier
  if (!prefersReduced) {
    gsap.utils.toArray(".service-card").forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 24, scale: 0.96, filter: "blur(4px)" }, {
        opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8, delay: i * 0.03,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 75%", toggleActions: "play none none none" }
      });
    });
    gsap.utils.toArray(".review-card").forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" }, {
        opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.85, delay: i * 0.02,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none none" }
      });
    });
  }

  // NEW: Enhanced About Section Animation
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    // Set initial state for elements within the about section
    gsap.set(aboutSection.querySelectorAll('h2, p, .about-list li, .about-visual img'), { opacity: 0, y: 30 });
    // For the image, also set initial scale
    gsap.set(aboutSection.querySelector('.about-visual img'), { scale: 0.95 });

    gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top 75%", // When the top of the section is 75% down the viewport
        toggleActions: "play none none none", // Play animation once
      }
    })
      .to(aboutSection.querySelector('h2'), { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(aboutSection.querySelector('p'), { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5") // Start 0.5s before previous ends
      .to(aboutSection.querySelectorAll('.about-list li'), { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.15 }, "-=0.4") // Stagger list items
      .to(aboutSection.querySelector('.about-visual img'), { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8"); // Image scales to 1 (original size)
  }

  // Founders section animations
  const founders = document.querySelectorAll('.founder');
  founders.forEach((el) => {
    const photo = el.querySelector('.founder-photo');
    const info = el.querySelector('.founder-info');
    if (photo && info) {
      gsap.set([photo, info], { opacity: 0, y: 30 });
      gsap.set(photo, { scale: 0.95 });

      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      })
        .to(photo, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" })
        .to(info, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");
    }
  });

  // FAQ toggles
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      // The visibility of faq-answer is now controlled by CSS based on aria-expanded
    });
  });

  // Enhanced reveal animation observer for better performance
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animation to improve performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger 50px before element enters viewport
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .fadeup, .service-card, .review-card').forEach(el => {
    revealObserver.observe(el);
  });

  // Testimonials Slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;

  // Hide all slides except the first one
  for (let i = 1; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }

  // Next button click event
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      slides[currentSlide].style.display = 'none';
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].style.display = 'flex';
    });
  }

  // Previous button click event
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      slides[currentSlide].style.display = 'none';
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].style.display = 'flex';
    });
  }

  // Auto slide every 5 seconds
  setInterval(function () {
    if (slides.length > 0) {
      slides[currentSlide].style.display = 'none';
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].style.display = 'flex';
    }
  }, 5000);

  // Statistics Counter Animation (GSAP)
  const statItems = document.querySelectorAll('.stat-item');
  if (!prefersReduced && statItems.length) {
    statItems.forEach(item => {
      const countElement = item.querySelector('.stat-number');
      if (!countElement) return;
      const countTo = parseInt(countElement.getAttribute('data-count') || "0", 10);
      const obj = { val: 0 };
      gsap.fromTo(obj, { val: 0 }, {
        val: countTo, duration: 1.8, ease: "power1.out",
        snap: { val: 1 },
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        onUpdate() {
          countElement.textContent = Math.floor(obj.val);
        }
      });
    });
  }

  // Gallery Slider
  const gallerySlider = document.querySelector('.gallery-slider');
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  let currentIndex = 0;

  // Function to move to the next slide
  function nextSlide() {
    if (gallerySlides.length > 0) {
      currentIndex = (currentIndex + 1) % gallerySlides.length;
      if (gallerySlider) {
        gallerySlider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    }
  }

  // Auto slide every 4 seconds
  setInterval(nextSlide, 4000);

  // Blog Slider
  // Reset interval when user interacts with slider
  const blogSlider = document.querySelector('.blog-slider');
  if (blogSlider) {
    blogSlider.addEventListener('mouseenter', () => {
      clearInterval(window.blogSlideInterval);
    });

    blogSlider.addEventListener('mouseleave', () => {
      window.blogSlideInterval = setInterval(loadBlogPosts, 6000);
    });
  }

  // Contact form validation and submission
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm && formStatus) {
    contactForm.onsubmit = e => {
      e.preventDefault();

      // Get form elements
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const message = document.getElementById('message');
      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const phoneError = document.getElementById('phone-error');
      const messageError = document.getElementById('message-error');

      // Reset previous error messages
      formStatus.textContent = '';
      name.classList.remove('error');
      email.classList.remove('error');
      phone.classList.remove('error');
      message.classList.remove('error');
      nameError.textContent = '';
      emailError.textContent = '';
      phoneError.textContent = '';
      messageError.textContent = '';

      // Validate form fields
      let isValid = true;

      if (!name.value.trim()) {
        name.classList.add('error');
        nameError.textContent = 'Name is required';
        isValid = false;
      }

      if (!email.value.trim()) {
        email.classList.add('error');
        emailError.textContent = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }

      if (!phone.value.trim()) {
        phone.classList.add('error');
        phoneError.textContent = 'Phone number is required';
        isValid = false;
      } else if (!/^\d{10,15}$/.test(phone.value.replace(/\D/g, ''))) {
        phone.classList.add('error');
        phoneError.textContent = 'Please enter a valid phone number';
        isValid = false;
      }

      if (!message.value.trim()) {
        message.classList.add('error');
        messageError.textContent = 'Message is required';
        isValid = false;
      }

      if (!isValid) {
        formStatus.textContent = "Please fill in all required fields correctly.";
        formStatus.className = "error";
        return;
      }

      // If validation passes, submit the form
      formStatus.textContent = "Sending...";
      formStatus.className = "sending";

      // Send form data to server
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          phone: phone.value,
          message: message.value
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            formStatus.textContent = "Thank you! We will get back to you soon. A confirmation email has been sent to your email address.";
            formStatus.className = "success";
            contactForm.reset();
          } else {
            formStatus.textContent = "Error: " + data.message;
            formStatus.className = "error";
          }
        })
        .catch(err => {
          console.error('Error submitting form:', err);
          formStatus.textContent = "Error sending message. Please try again.";
          formStatus.className = "error";
        });
    }
  }

  // Navigation system is now handled by MainSiteNavigation class above

  // Enhanced mobile dropdown functionality
  document.querySelectorAll('.mobile-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = trigger.closest('.mobile-dropdown');
      const menu = dropdown.querySelector('.mobile-dropdown-menu');

      // Close other dropdowns
      document.querySelectorAll('.mobile-dropdown-menu').forEach(otherMenu => {
        if (otherMenu !== menu) {
          otherMenu.style.display = 'none';
        }
      });

      // Remove active class from other triggers
      document.querySelectorAll('.mobile-dropdown-trigger').forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.classList.remove('active');
        }
      });

      // Toggle current dropdown
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
        trigger.classList.remove('active');
      } else {
        menu.style.display = 'block';
        trigger.classList.add('active');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const clickedElement = e.target;

    // Don't close if clicking on menu toggle or inside nav
    if (clickedElement.closest('.menu-toggle') || clickedElement.closest('.nav-list')) {
      return;
    }

    // Close all dropdowns and mobile menu
    dropdowns.forEach(dropdown => dropdown.classList.remove('open'));

    // Close mobile dropdowns
    document.querySelectorAll('.mobile-dropdown-menu').forEach(menu => {
      menu.style.display = 'none';
    });

    // Remove active classes from mobile dropdown triggers
    document.querySelectorAll('.mobile-dropdown-trigger').forEach(trigger => {
      trigger.classList.remove('active');
    });

    if (navList) {
      navList.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close mobile menu when clicking on nav links
  document.querySelectorAll('.nav-list .nav-link:not(.nav-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      if (navList) {
        navList.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
    });
  });

  // Close mobile menu when clicking on submenu links
  document.querySelectorAll('.nav-list .submenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (navList) {
        navList.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
    });
  });

  // Hide mobile menu on nav click
  document.querySelectorAll('.nav-list .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navList) navList.classList.remove('show');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        if (typeof gsap !== 'undefined') {
          gsap.to(window, { duration: .8, scrollTo: href, ease: "power2.inOut" });
        } else {
          document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Ensure Blogs item exists under More dropdown (scrolls to #blog)
  (function ensureBlogsInMore() {
    const dropdowns = document.querySelectorAll('.main-nav .nav-list .dropdown');
    if (!dropdowns || dropdowns.length === 0) return;
    const moreDropdown = dropdowns[dropdowns.length - 1];
    const submenu = moreDropdown.querySelector('.submenu');
    if (!submenu) return;
    if (!submenu.querySelector('a[href="#blog"]')) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="#blog" class="submenu-link">Blogs</a>';
      // insert after FAQs if present, else append
      const faqs = submenu.querySelector('a[href="#faq"]');
      if (faqs && faqs.parentElement && faqs.parentElement.nextSibling) {
        submenu.insertBefore(li, faqs.parentElement.nextSibling);
      } else {
        submenu.appendChild(li);
      }
    }
  })();

  // Note: Practice Area "Learn more" links are now handled directly in HTML
  // No JavaScript injection needed to prevent duplicate buttons

  // Blog "Read More" buttons
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('blog-link')) {
      e.preventDefault();
      const postId = e.target.getAttribute('data-post-id');
      if (postId) {
        showFullBlogPost(postId);
      }
    }
  });
});

function showFullBlogPost(postId) {
  // Fetch the specific blog post from server
  fetch(`/api/blog-posts/${postId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(post => {

      if (post) {
        // Create a modal or overlay to display the full blog post
        const overlay = document.createElement('div');
        overlay.className = 'blog-modal-overlay';
        overlay.innerHTML = `
          <div class="blog-modal">
            <div class="blog-modal-content">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                <h2 style="margin:0; font-size:1.4rem;">${post.title}</h2>
                <div class="blog-modal-actions" style="display:flex; gap:8px;">
                  <button class="blog-modal-contact btn-primary">Contact</button>
                  <button class="blog-modal-close">Close</button>
                </div>
              </div>
              ${post.photo ? `<div class="blog-modal-image"><img src="${post.photo}" alt="${post.title}"></div>` : ''}
              <div class="blog-modal-text">
                ${formatBlogContent(post.content)}
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(overlay);

        // Render rich text content in the modal
        if (window.richTextRenderer) {
          setTimeout(() => {
            const modalContent = overlay.querySelector('.blog-modal-content');
            if (modalContent) {
              window.richTextRenderer.renderById(modalContent.id || 'blog-modal-content');
            }
          }, 100);
        }

        // Add close functionality
        const closeModal = function () {
          // Add fade out animation
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity 0.3s ease';

          // Remove element after transition
          setTimeout(() => {
            if (overlay.parentNode) {
              document.body.removeChild(overlay);
            }
          }, 300);
        };

        overlay.querySelector('.blog-modal-close').addEventListener('click', closeModal);
        const contactBtn = overlay.querySelector('.blog-modal-contact');
        if (contactBtn) {
          contactBtn.addEventListener('click', function () {
            closeModal();
            const target = document.querySelector('#contact');
            if (target && typeof gsap !== 'undefined') {
              gsap.to(window, { duration: .8, scrollTo: '#contact', ease: 'power2.inOut' });
            } else if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }

        // Close when clicking outside the modal
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            closeModal();
          }
        });

        // Close with Escape key
        document.addEventListener('keydown', function escClose(e) {
          if (e.key === 'Escape' && overlay) {
            closeModal();
            document.removeEventListener('keydown', escClose);
          }
        });
      }
    })
    .catch(err => {
      console.error('Error loading blog post from server:', err);
      // Show error message to user
      alert('Error loading blog post. Please try again later.');
    });
}

// Enhanced blog post loading function with modal
function loadBlogPost(postId) {
  fetch(`/api/blog-posts/${postId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(post => {
      if (post) {
        // Create enhanced modal with better animations
        const overlay = document.createElement('div');
        overlay.className = 'blog-modal-overlay';
        overlay.innerHTML = `
          <div class="blog-modal">
            <div class="blog-modal-header">
              <div class="blog-modal-title-section">
                <h2>${post.title}</h2>
                <div class="blog-modal-meta">
                  <span class="blog-modal-date">${new Date(post.timestamp || Date.now()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</span>
                </div>
              </div>
              <div class="blog-modal-actions">
                <button class="blog-modal-contact btn-primary">Contact Us</button>
                <button class="blog-modal-close">×</button>
              </div>
            </div>
            ${post.photo ? `<div class="blog-modal-image"><img src="${post.photo}" alt="${post.title}"></div>` : ''}
            <div class="blog-modal-content">
              ${formatBlogContent(post.content)}
            </div>
          </div>
        `;

        // Add enhanced styles
        const style = document.createElement('style');
        style.textContent = `
          .blog-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            animation: modalFadeIn 0.3s ease forwards;
          }

          .blog-modal {
            background: var(--white);
            border-radius: 20px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: scale(0.9) translateY(20px);
            animation: modalSlideIn 0.3s ease forwards;
            position: relative;
          }

          .blog-modal-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid var(--border);
            gap: 1rem;
          }

          .blog-modal-title-section h2 {
            margin: 0 0 0.5rem 0;
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--slate);
            line-height: 1.3;
          }

          .blog-modal-meta {
            color: var(--grey-mid);
            font-size: 0.9rem;
          }

          .blog-modal-actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }

          .blog-modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--grey-mid);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.2s ease;
            line-height: 1;
          }

          .blog-modal-close:hover {
            background: var(--grey-lightest);
            color: var(--slate);
          }

          .blog-modal-image {
            padding: 0 2rem;
            margin-bottom: 1rem;
          }

          .blog-modal-image img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 12px;
          }

          .blog-modal-content {
            padding: 0 2rem 2rem;
            line-height: 1.8;
            color: var(--text);
          }

          .blog-modal-content p {
            margin-bottom: 1.5rem;
          }

          .blog-modal-content a {
            color: var(--accent);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s ease;
          }

          .blog-modal-content a:hover {
            border-bottom-color: var(--accent);
          }

          @keyframes modalFadeIn {
            to { opacity: 1; }
          }

          @keyframes modalSlideIn {
            to {
              transform: scale(1) translateY(0);
            }
          }

          @media (max-width: 768px) {
            .blog-modal {
              margin: 10px;
              max-height: calc(100vh - 20px);
            }

            .blog-modal-header {
              padding: 1.5rem 1.5rem 1rem;
              flex-direction: column;
              align-items: stretch;
            }

            .blog-modal-title-section h2 {
              font-size: 1.4rem;
            }

            .blog-modal-actions {
              justify-content: space-between;
            }

            .blog-modal-image,
            .blog-modal-content {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }

            .blog-modal-image img {
              height: 200px;
            }
          }
        `;
        document.head.appendChild(style);

        document.body.appendChild(overlay);

        // Render rich text content in the modal
        if (window.richTextRenderer) {
          setTimeout(() => {
            const modalContent = overlay.querySelector('.blog-modal-content');
            if (modalContent) {
              window.richTextRenderer.renderById(modalContent.id || 'blog-modal-content');
            }
          }, 100);
        }

        // Enhanced close functionality with animations
        const closeModal = function () {
          overlay.style.animation = 'modalFadeOut 0.3s ease forwards';
          const modal = overlay.querySelector('.blog-modal');
          modal.style.animation = 'modalSlideOut 0.3s ease forwards';

          setTimeout(() => {
            if (overlay.parentNode) {
              document.body.removeChild(overlay);
            }
            // Remove the style element
            if (style.parentNode) {
              document.head.removeChild(style);
            }
          }, 300);
        };

        // Add close animations
        const closeStyle = document.createElement('style');
        closeStyle.textContent = `
          @keyframes modalFadeOut {
            to { opacity: 0; }
          }

          @keyframes modalSlideOut {
            to {
              transform: scale(0.9) translateY(20px);
            }
          }
        `;
        document.head.appendChild(closeStyle);

        overlay.querySelector('.blog-modal-close').addEventListener('click', closeModal);
        const contactBtn = overlay.querySelector('.blog-modal-contact');
        if (contactBtn) {
          contactBtn.addEventListener('click', function () {
            closeModal();
            const target = document.querySelector('#contact');
            if (target && typeof gsap !== 'undefined') {
              gsap.to(window, { duration: .8, scrollTo: '#contact', ease: 'power2.inOut' });
            } else if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }

        // Close when clicking outside the modal
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            closeModal();
          }
        });

        // Close with Escape key
        document.addEventListener('keydown', function escClose(e) {
          if (e.key === 'Escape' && overlay) {
            closeModal();
            document.removeEventListener('keydown', escClose);
          }
        });
      }
    })
    .catch(err => {
      console.error('Error loading blog post:', err);
      // Show error message to user
      alert('Error loading blog post. Please try again later.');
    });
}

// Function to format blog content with proper paragraph breaks and link detection
function formatBlogContent(content) {
  // If content already contains HTML tags, return it as is for rich text
  if (content.includes('<') && content.includes('>')) {
    return `<div class="blog-content rich-text-content">${content}</div>`;
  }

  // Convert line breaks to paragraphs for plain text
  const paragraphs = content.split('\n\n');
  let formattedContent = '';

  paragraphs.forEach(paragraph => {
    if (paragraph.trim() !== '') {
      // Detect URLs and convert them to links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const linkedParagraph = paragraph.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);

      formattedContent += `<p>${linkedParagraph}</p>`;
    }
  });

  return `<div class="blog-content rich-text-content">${formattedContent}</div>`;
}

// Enhanced Reviews System with 100+ Madhya Pradesh-based Clients
function initializeReviews() {
  // Array of 100+ Madhya Pradesh-based client reviews
  const reviews = [
    // Corporate & Business Clients
    { text: "Meticulous, strategic, and always honest. Our business saved significantly on contracts thanks to their expertise.", author: "– Anil Rastogi, Rastogi Industries, Indore" },
    { text: "Amazing support during our corporate merger. Transparent process, outcome-oriented approach.", author: "– Arvind Jain, Jain Group, Bhopal" },
    { text: "Best consultation for our startup. High value at a fair price with excellent guidance.", author: "– Rakesh Nema, TechStart MP, Indore" },
    { text: "Professional handling of our trademark registration. Quick and efficient service.", author: "– Priya Sharma, Sharma Foods, Bhopal" },
    { text: "Outstanding corporate law expertise. Helped us navigate complex business regulations.", author: "– Rajesh Verma, Verma Constructions, Gwalior" },
    { text: "Excellent IPR protection for our software company. Comprehensive strategy implementation.", author: "– Amit Patel, Digital Solutions MP, Indore" },
    { text: "Reliable legal partner for our manufacturing unit. Consistent quality service.", author: "– Suresh Gupta, Gupta Steel, Jabalpur" },
    { text: "Strategic advice for our retail chain expansion. Professional and trustworthy.", author: "– Meena Singh, Singh Retail, Bhopal" },
    { text: "Outstanding contract negotiations. Protected our interests effectively.", author: "– Vikram Malhotra, Malhotra Pharma, Indore" },
    { text: "Excellent corporate compliance guidance. Kept us updated with all legal requirements.", author: "– Deepak Sharma, Sharma Electronics, Gwalior" },

    // Civil Litigation Clients
    { text: "Secured a favorable property verdict after years of struggle. Strongly recommended for civil cases.", author: "– Sushma Tiwari, Indore" },
    { text: "Brilliant handling of our property dispute. Professional and result-oriented.", author: "– Ramesh Kumar, Bhopal" },
    { text: "Excellent contract dispute resolution. Fair and transparent process.", author: "– Sunita Devi, Gwalior" },
    { text: "Outstanding civil litigation expertise. Won our case efficiently.", author: "– Harish Patel, Jabalpur" },
    { text: "Professional handling of our land dispute. Quick resolution achieved.", author: "– Laxmi Bai, Ujjain" },
    { text: "Excellent property law knowledge. Guided us through complex legal procedures.", author: "– Mohan Singh, Ratlam" },
    { text: "Outstanding civil court representation. Professional and dedicated.", author: "– Geeta Sharma, Sagar" },
    { text: "Brilliant contract enforcement case. Protected our rights effectively.", author: "– Rajendra Prasad, Dewas" },
    { text: "Excellent property registration assistance. Smooth and hassle-free process.", author: "– Kamlesh Verma, Mandsaur" },
    { text: "Outstanding civil litigation support. Professional and result-oriented.", author: "– Pushpa Devi, Neemuch" },

    // Criminal Defense Clients
    { text: "My son's criminal defense was handled brilliantly and discreetly. True professionals.", author: "– Sanjay Malhotra, Indore" },
    { text: "Excellent criminal defense expertise. Professional and confidential service.", author: "– Ravi Shankar, Bhopal" },
    { text: "Outstanding criminal case handling. Fair and transparent approach.", author: "– Anita Desai, Gwalior" },
    { text: "Brilliant defense strategy. Protected our family's reputation effectively.", author: "– Prakash Verma, Jabalpur" },
    { text: "Professional criminal defense service. Quick and efficient resolution.", author: "– Rekha Singh, Ujjain" },
    { text: "Excellent criminal law expertise. Guided us through difficult times.", author: "– Mahesh Kumar, Ratlam" },
    { text: "Outstanding defense representation. Professional and dedicated service.", author: "– Suman Patel, Sagar" },
    { text: "Brilliant criminal case handling. Fair and transparent process.", author: "– Ashok Sharma, Dewas" },
    { text: "Excellent criminal defense support. Professional and result-oriented.", author: "– Kavita Gupta, Mandsaur" },
    { text: "Outstanding criminal law expertise. Protected our interests effectively.", author: "– Vinod Malhotra, Neemuch" },

    // Family Law Clients
    { text: "Most caring advocates. Made a tough family case easier for everyone involved.", author: "– Meenu Patel, Indore" },
    { text: "Excellent family law expertise. Compassionate and professional service.", author: "– Rajesh Tiwari, Bhopal" },
    { text: "Outstanding divorce case handling. Fair and sensitive approach.", author: "– Priya Sharma, Gwalior" },
    { text: "Brilliant child custody resolution. Professional and caring service.", author: "– Amit Kumar, Jabalpur" },
    { text: "Excellent family law guidance. Helped us through difficult times.", author: "– Sunita Devi, Ujjain" },
    { text: "Outstanding inheritance case handling. Fair and transparent process.", author: "– Harish Patel, Ratlam" },
    { text: "Professional family law service. Compassionate and dedicated.", author: "– Laxmi Bai, Sagar" },
    { text: "Excellent divorce proceedings. Professional and sensitive handling.", author: "– Mohan Singh, Dewas" },
    { text: "Outstanding family law expertise. Protected our interests effectively.", author: "– Geeta Verma, Mandsaur" },
    { text: "Brilliant child custody case. Professional and caring approach.", author: "– Rajendra Prasad, Neemuch" },

    // Real Estate Clients
    { text: "Excellent property law expertise. Smooth transaction process.", author: "– Ramesh Kumar, Indore" },
    { text: "Outstanding real estate guidance. Professional and reliable service.", author: "– Sushma Tiwari, Bhopal" },
    { text: "Brilliant property dispute resolution. Quick and efficient service.", author: "– Anil Rastogi, Gwalior" },
    { text: "Excellent land registration assistance. Hassle-free process.", author: "– Meena Singh, Jabalpur" },
    { text: "Outstanding property law knowledge. Professional and trustworthy.", author: "– Vikram Malhotra, Ujjain" },
    { text: "Excellent real estate expertise. Protected our interests effectively.", author: "– Deepak Sharma, Ratlam" },
    { text: "Outstanding property transaction guidance. Professional and reliable.", author: "– Priya Patel, Sagar" },
    { text: "Brilliant real estate law service. Fair and transparent approach.", author: "– Rajesh Verma, Dewas" },
    { text: "Excellent property dispute handling. Quick and efficient resolution.", author: "– Sunita Devi, Mandsaur" },
    { text: "Outstanding real estate expertise. Professional and dedicated service.", author: "– Harish Kumar, Neemuch" },

    // Labour & Employment Clients
    { text: "Excellent employment law guidance. Protected our rights effectively.", author: "– Ravi Shankar, Indore" },
    { text: "Outstanding labour dispute resolution. Professional and fair approach.", author: "– Anita Desai, Bhopal" },
    { text: "Brilliant employment contract handling. Comprehensive legal protection.", author: "– Prakash Verma, Gwalior" },
    { text: "Excellent labour law expertise. Professional and reliable service.", author: "– Rekha Singh, Jabalpur" },
    { text: "Outstanding employment dispute handling. Fair and transparent process.", author: "– Mahesh Kumar, Ujjain" },
    { text: "Excellent labour court representation. Professional and dedicated.", author: "– Suman Patel, Ratlam" },
    { text: "Outstanding employment law service. Protected our interests effectively.", author: "– Ashok Sharma, Sagar" },
    { text: "Brilliant labour dispute resolution. Quick and efficient service.", author: "– Kavita Gupta, Dewas" },
    { text: "Excellent employment guidance. Professional and trustworthy.", author: "– Vinod Malhotra, Mandsaur" },
    { text: "Outstanding labour law expertise. Fair and transparent approach.", author: "– Pushpa Devi, Neemuch" },

    // Service Matters Clients
    { text: "Excellent service matter representation. Professional and dedicated.", author: "– Rajesh Tiwari, Govt. Employee, Indore" },
    { text: "Outstanding service dispute resolution. Protected our career effectively.", author: "– Priya Sharma, Teacher, Bhopal" },
    { text: "Brilliant service matter handling. Fair and transparent process.", author: "– Amit Kumar, Police Officer, Gwalior" },
    { text: "Excellent service law expertise. Professional and reliable guidance.", author: "– Sunita Devi, Nurse, Jabalpur" },
    { text: "Outstanding service dispute case. Quick and efficient resolution.", author: "– Harish Patel, Bank Officer, Ujjain" },
    { text: "Excellent service matter representation. Protected our rights effectively.", author: "– Laxmi Bai, Municipal Employee, Ratlam" },
    { text: "Outstanding service law guidance. Professional and dedicated service.", author: "– Mohan Singh, Railway Employee, Sagar" },
    { text: "Brilliant service dispute handling. Fair and transparent approach.", author: "– Geeta Verma, Teacher, Dewas" },
    { text: "Excellent service matter expertise. Professional and trustworthy.", author: "– Rajendra Prasad, Govt. Officer, Mandsaur" },
    { text: "Outstanding service law representation. Protected our career effectively.", author: "– Pushpa Devi, Healthcare Worker, Neemuch" },

    // Trade Mark & IPR Clients
    { text: "Excellent trademark registration. Professional and efficient service.", author: "– Ramesh Kumar, Brand Owner, Indore" },
    { text: "Outstanding IPR protection. Comprehensive strategy implementation.", author: "– Sushma Tiwari, Inventor, Bhopal" },
    { text: "Brilliant trademark opposition handling. Protected our brand effectively.", author: "– Anil Rastogi, Business Owner, Gwalior" },
    { text: "Excellent IPR litigation. Professional and result-oriented.", author: "– Meena Singh, Startup Founder, Jabalpur" },
    { text: "Outstanding trademark portfolio management. Comprehensive legal protection.", author: "– Vikram Malhotra, Entrepreneur, Ujjain" },
    { text: "Excellent IPR enforcement. Professional and dedicated service.", author: "– Deepak Sharma, Tech Company, Ratlam" },
    { text: "Outstanding trademark licensing. Fair and transparent process.", author: "– Priya Patel, Brand Manager, Sagar" },
    { text: "Brilliant IPR litigation expertise. Protected our innovations effectively.", author: "– Rajesh Verma, Research Institute, Dewas" },
    { text: "Excellent trademark opposition. Professional and strategic approach.", author: "– Sunita Devi, Designer, Mandsaur" },
    { text: "Outstanding IPR portfolio management. Comprehensive legal guidance.", author: "– Harish Kumar, Software Developer, Neemuch" },

    // Additional diverse clients for variety
    { text: "Professional legal guidance for our NGO. Excellent service and support.", author: "– Dr. Meena Patel, NGO Director, Indore" },
    { text: "Outstanding legal support for our educational institution. Professional and reliable.", author: "– Prof. Rajesh Kumar, College Principal, Bhopal" },
    { text: "Excellent contract drafting for our hospital. Comprehensive legal protection.", author: "– Dr. Anil Sharma, Hospital Director, Gwalior" },
    { text: "Brilliant legal guidance for our cooperative society. Fair and transparent.", author: "– Suresh Verma, Society President, Jabalpur" },
    { text: "Outstanding legal support for our religious trust. Professional and respectful.", author: "– Swami Ji, Trust Chairman, Ujjain" },
    { text: "Excellent legal guidance for our sports club. Professional and dedicated.", author: "– Rajesh Singh, Club Secretary, Ratlam" },
    { text: "Brilliant legal support for our cultural organization. Comprehensive service.", author: "– Priya Devi, Cultural Head, Sagar" },
    { text: "Outstanding legal guidance for our farmers' cooperative. Fair and supportive.", author: "– Harish Patel, Farmer Leader, Dewas" },
    { text: "Excellent legal support for our women's self-help group. Empowering service.", author: "– Sunita Bai, SHG President, Mandsaur" },
    { text: "Brilliant legal guidance for our youth organization. Professional and inspiring.", author: "– Amit Kumar, Youth Leader, Neemuch" }
  ];

  // Function to create a review card
  function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-q">"</div>
      <div class="review-text">${review.text}</div>
      <div class="review-author">${review.author}</div>
    `;
    return card;
  }

  // Function to populate reviews with infinite scrolling effect
  function populateReviews() {
    const leftTrack = document.querySelector('.reviews-track-left');
    const rightTrack = document.querySelector('.reviews-track-right');

    if (!leftTrack || !rightTrack) return;

    // Clear existing content
    leftTrack.innerHTML = '';
    rightTrack.innerHTML = '';

    // Create duplicate reviews for seamless infinite scrolling
    const reviewsForLeft = [...reviews, ...reviews, ...reviews, ...reviews];
    const reviewsForRight = [...reviews, ...reviews, ...reviews, ...reviews];

    // Populate left track (slides left to right)
    reviewsForLeft.forEach(review => {
      leftTrack.appendChild(createReviewCard(review));
    });

    // Populate right track (slides right to left)
    reviewsForRight.forEach(review => {
      rightTrack.appendChild(createReviewCard(review));
    });

    // Set initial positions for seamless animation and start both at same time
    leftTrack.style.transform = 'translateX(-50%)';
    rightTrack.style.transform = 'translateX(0%)';

    // Force animation restart to ensure both start simultaneously
    leftTrack.style.animation = 'none';
    rightTrack.style.animation = 'none';
    setTimeout(() => {
      leftTrack.style.animation = '';
      rightTrack.style.animation = '';
    }, 10);
  }

  // Initialize reviews when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populateReviews);
  } else {
    populateReviews();
  }
}

// Initialize reviews system
initializeReviews();
