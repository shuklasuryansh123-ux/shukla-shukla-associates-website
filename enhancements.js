// Enhanced UX Improvements for Shukla & Shukla Associates Website

// Blog Section Enhancement
function enhanceBlogSection() {
  const blogSection = document.querySelector('#blog .blog-slider');
  if (!blogSection) return;

  // Add loading state
  if (!blogSection.innerHTML.trim()) {
    blogSection.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--grey-mid);">
        <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid var(--grey-light); border-top: 2px solid var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 1rem;">Loading blog posts...</p>
      </div>
    `;
  }

  // Add enhanced styling for blog cards
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .blog-section .blog-slider {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    
    .blog-card {
      position: relative;
      background: var(--surface-weak);
      border: 1px solid var(--border);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .blog-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.12);
      border-color: var(--accent);
    }
    
    .blog-card .blog-content {
      padding: 16px;
    }
    
    .blog-card h3 {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--slate);
      line-height: 1.4;
    }
    
    .blog-card .blog-excerpt {
      color: var(--grey-mid);
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 8px 0 16px 0;
    }
    
    .blog-nav-btn {
      transition: all 0.2s ease;
    }
    
    .blog-nav-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .blog-nav-btn:active {
      transform: scale(0.95);
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .blog-card {
        min-width: 85vw !important;
      }
      
      .blog-nav-btn {
        padding: 8px 12px !important;
        font-size: 1.1rem !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Performance optimizations
function addPerformanceOptimizations() {
  // Lazy loading images
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.transition = 'opacity 0.3s ease';
      this.style.opacity = '1';
    });
    img.addEventListener('error', function() {
      this.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = 'background: var(--surface); display: flex; align-items: center; justify-content: center; color: var(--grey-mid); font-size: 0.9rem; width: 100%; height: 100%;';
      fallback.textContent = 'Image unavailable';
      this.parentNode.appendChild(fallback);
    });
  });

  // Intersection Observer for enhanced animations
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
      revealObserver.observe(el);
    });
  }
}

// Enhanced form validation
function enhanceFormValidation() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Add real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      // Clear error state on input
      const errorDiv = document.getElementById(this.id + '-error');
      if (errorDiv) {
        errorDiv.textContent = '';
        this.classList.remove('error');
      }
    });
  });
}

function validateField(field) {
  const errorDiv = document.getElementById(field.id + '-error');
  let errorMessage = '';

  if (field.hasAttribute('required') && !field.value.trim()) {
    errorMessage = `${field.labels[0]?.textContent || field.id} is required.`;
  } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
    errorMessage = 'Please enter a valid email address.';
  } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
    errorMessage = 'Please enter a valid phone number.';
  }

  if (errorMessage) {
    field.classList.add('error');
    if (errorDiv) errorDiv.textContent = errorMessage;
  } else {
    field.classList.remove('error');
    if (errorDiv) errorDiv.textContent = '';
  }

  return !errorMessage;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Accessibility enhancements
function enhanceAccessibility() {
  // Add skip links
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = 'position: absolute; top: -40px; left: 6px; background: var(--accent); color: white; padding: 8px; text-decoration: none; z-index: 1000; border-radius: 4px; transition: top 0.3s;';
  skipLink.addEventListener('focus', () => skipLink.style.top = '6px');
  skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Enhanced keyboard navigation for dropdowns
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-trigger');
    const submenu = dropdown.querySelector('.submenu');
    
    if (trigger && submenu) {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const firstLink = submenu.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      });
    }
  });

  // Add focus indicators for custom elements
  const style = document.createElement('style');
  style.textContent = `
    .error {
      border-color: #dc3545 !important;
      background-color: rgba(220, 53, 69, 0.1) !important;
    }
    
    *:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    
    .btn-primary:focus-visible,
    .service-card:focus-visible,
    .review-card:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 4px;
    }
    
    .no-scroll {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
}

// Enhanced Navigation System
function enhanceNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (!header || !menuToggle || !navList) return;

  // Scroll-based header styling (fixed visibility)
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    // Header always stays visible
    header.style.transform = 'translateY(0)';
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('show');
    document.body.classList.toggle('no-scroll');
  });

  // Advanced dropdown behavior
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-trigger');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('open');
    });
    
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dropdown.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // Smooth scrolling and active section highlighting
  const navLinks = document.querySelectorAll('.nav-link[data-nav-link]');
  const sections = Array.from(navLinks).map(link => document.getElementById(link.getAttribute('href').substring(1)));

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Initial check

  // Progress indicator
  const progressIndicator = document.createElement('div');
  progressIndicator.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent), var(--slate));
    width: 0%;
    z-index: 1021;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressIndicator);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressIndicator.style.width = scrollPercent + '%';
  });
}

// SEO enhancements
function enhanceSEO() {
  // Add breadcrumb schema for practice page
  if (window.location.pathname.includes('practice')) {
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Practice Areas",
          "item": window.location.href
        }
      ]
    });
    document.head.appendChild(breadcrumbScript);
  }

  // Dynamic meta description for blog pages
  if (window.location.pathname.includes('blog')) {
    const firstParagraph = document.querySelector('main p')?.textContent;
    if (firstParagraph) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = firstParagraph.substring(0, 155) + (firstParagraph.length > 155 ? '...' : '');
    }
  }
}

// Initialize all enhancements
function initializeEnhancements() {
  // Wait for DOM and initial scripts to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEnhancements);
  } else {
    runEnhancements();
  }
}

function runEnhancements() {
  try {
    enhanceBlogSection();
    addPerformanceOptimizations();
    enhanceFormValidation();
    enhanceNavigation(); // Add navigation enhancements
    enhanceAccessibility();
    enhanceSEO();
    
    console.log('✅ UX enhancements loaded successfully');
  } catch (error) {
    console.warn('⚠️ Some enhancements failed to load:', error);
  }
}

// Auto-initialize
initializeEnhancements();

// Export for manual initialization if needed
window.ShuklaEnhancements = {
  init: runEnhancements,
  enhanceBlogSection,
  addPerformanceOptimizations,
  enhanceFormValidation,
  enhanceAccessibility,
  enhanceSEO
};
