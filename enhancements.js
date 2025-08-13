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
    img.addEventListener('load', function () {
      this.style.transition = 'opacity 0.3s ease';
      this.style.opacity = '1';
    });
    img.addEventListener('error', function () {
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
    input.addEventListener('blur', function () {
      validateField(this);
    });

    input.addEventListener('input', function () {
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

// Optimized Mobile Modal System
function initMobileModal() {
  const mobileModal = document.querySelector('.mobile-modal');
  const mobileModalOverlay = document.querySelector('.mobile-modal-overlay');
  const mobileModalClose = document.querySelector('.mobile-modal-close');
  const menuToggle = document.querySelector('.menu-toggle');

  if (!mobileModal || !mobileModalOverlay || !mobileModalClose || !menuToggle) {
    console.warn('Mobile modal elements not found');
    return;
  }

  // Open mobile modal
  function openMobileModal() {
    mobileModal.classList.add('active');
    mobileModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  // Close mobile modal
  function closeMobileModal() {
    mobileModal.classList.remove('active');
    mobileModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');

    // Close all mobile dropdowns
    document.querySelectorAll('.mobile-dropdown.active').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }

  // Event listeners
  menuToggle.addEventListener('click', openMobileModal);
  mobileModalClose.addEventListener('click', closeMobileModal);
  mobileModalOverlay.addEventListener('click', closeMobileModal);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileModal.classList.contains('active')) {
      closeMobileModal();
    }
  });

  // Enhanced Mobile dropdown functionality with direct DOM manipulation
  function setupMobileDropdowns() {
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    
    mobileDropdowns.forEach((dropdown, index) => {
      const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
      const menu = dropdown.querySelector('.mobile-dropdown-menu');
      
      if (trigger && menu) {
        // Remove any existing event listeners
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const isActive = dropdown.classList.contains('active');
          
          // Close other dropdowns first
          mobileDropdowns.forEach(d => {
            if (d !== dropdown) {
              d.classList.remove('active');
              const otherMenu = d.querySelector('.mobile-dropdown-menu');
              if (otherMenu) {
                otherMenu.style.maxHeight = '0px';
                otherMenu.style.opacity = '0';
              }
            }
          });
          
          // Toggle current dropdown
          if (isActive) {
            dropdown.classList.remove('active');
            menu.style.maxHeight = '0px';
            menu.style.opacity = '0';
          } else {
            dropdown.classList.add('active');
            menu.style.maxHeight = '500px';
            menu.style.opacity = '1';
          }
        });
        
        // Initialize menu state
        menu.style.maxHeight = '0px';
        menu.style.opacity = '0';
        menu.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
      }
    });
  }

  // Setup dropdowns when modal opens
  menuToggle.addEventListener('click', () => {
    setTimeout(setupMobileDropdowns, 100); // Small delay to ensure modal is rendered
  });

  // Close modal when clicking on links
  const mobileLinks = mobileModal.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileModal();
    });
  });
}

// Optimized Animation System
function optimizeAnimations() {
  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    document.documentElement.style.setProperty('--transition-duration', '0.1s');
  }

  // Optimize scroll animations with throttling
  let ticking = false;
  function updateScrollAnimations() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolledElements = document.querySelectorAll('.reveal, .fadeup');
        scrolledElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8;

          if (isVisible && !element.classList.contains('active')) {
            element.classList.add('active');
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  // Throttled scroll listener
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      updateScrollAnimations();
      scrollTimeout = null;
    }, 16); // ~60fps
  });

  // Initial check
  updateScrollAnimations();
}

// Optimized Reviews Section (Fix crashes)
function optimizeReviewsSection() {
  const reviewsSection = document.querySelector('.reviews-section');
  if (!reviewsSection) return;

  // Disable complex animations on mobile to prevent crashes
  if (window.innerWidth <= 768) {
    const marqueeTracks = reviewsSection.querySelectorAll('.marquee-track');
    marqueeTracks.forEach(track => {
      track.style.animation = 'none';
      track.style.transform = 'none';
    });
  }

  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Only animate when visible
        const marqueeTrack = entry.target.querySelector('.marquee-track');
        if (marqueeTrack && window.innerWidth > 768) {
          marqueeTrack.style.animation = 'marquee-left 32s linear infinite';
        }
      } else {
        entry.target.classList.remove('visible');
        // Pause animation when not visible
        const marqueeTrack = entry.target.querySelector('.marquee-track');
        if (marqueeTrack) {
          marqueeTrack.style.animationPlayState = 'paused';
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  observer.observe(reviewsSection);
}

// Enhanced Navigation System with Mobile-Friendly Dropdowns
function enhanceNavigation() {
  const header = document.querySelector('.main-site-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!header || !menuToggle || !navList) {
    console.warn('Navigation elements not found');
    return;
  }

  console.log('Setting up enhanced navigation...');

  // Scroll-based header styling with enhanced effects
  let lastScrollY = window.scrollY;
  let scrollTimeout;

  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      const currentScrollY = window.scrollY;

      // Add scrolled class for enhanced styling
      header.classList.toggle('scrolled', currentScrollY > 50);

      // Smooth header hide/show on scroll (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header slightly
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show header
        header.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
      scrollTimeout = null;
    }, 16); // Throttle to ~60fps
  });

  // Enhanced Mobile menu toggle (now opens modal instead)
  menuToggle.addEventListener('click', () => {
    // This will be handled by the mobile modal system
    console.log('Mobile menu toggle clicked');
  });

  // Enhanced dropdown behavior for desktop only
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-trigger');
    const submenu = dropdown.querySelector('.submenu');

    if (!trigger || !submenu) {
      console.warn('Dropdown missing trigger or submenu:', dropdown);
      return;
    }

    console.log('Setting up desktop dropdown:', trigger.textContent);

    // Desktop hover behavior only
    dropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth > 900) {
        // Close other dropdowns first
        document.querySelectorAll('.dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.add('open');
      }
    });

    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 900) {
        dropdown.classList.remove('open');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
  });

  // Enhanced smooth scrolling and active section highlighting
  const navLinks = document.querySelectorAll('.nav-link[data-nav-link]');
  const sections = Array.from(navLinks).map(link => {
    const href = link.getAttribute('href');
    return href.startsWith('#') ? document.getElementById(href.substring(1)) : null;
  }).filter(Boolean);

  function updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  // Throttled scroll listener for active links
  let activeLinkTimeout;
  window.addEventListener('scroll', () => {
    if (activeLinkTimeout) return;
    activeLinkTimeout = setTimeout(() => {
      updateActiveLink();
      activeLinkTimeout = null;
    }, 100);
  });
  updateActiveLink(); // Initial check

  // Enhanced progress indicator
  const progressIndicator = document.createElement('div');
  progressIndicator.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), #3b82f6, var(--accent));
    width: 0%;
    z-index: 1021;
    transition: width 0.1s ease;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(progressIndicator);

  let progressTimeout;
  window.addEventListener('scroll', () => {
    if (progressTimeout) return;
    progressTimeout = setTimeout(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressIndicator.style.width = scrollPercent + '%';
      progressTimeout = null;
    }, 16);
  });

  // Handle window resize for responsive behavior
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) return;
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 900) {
        // Reset dropdown behavior for desktop
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }
      resizeTimeout = null;
    }, 250);
  });

  console.log('Enhanced navigation system initialized successfully');
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
    initMobileModal(); // Add mobile modal enhancements
    optimizeAnimations(); // Add animation optimizations
    optimizeReviewsSection(); // Add reviews optimizations

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
  enhanceSEO,
  initMobileModal,
  optimizeAnimations,
  optimizeReviewsSection
};

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('Initializing enhanced navigation system...');
  enhanceNavigation();
  initMobileModal();
  optimizeAnimations();
  optimizeReviewsSection();
  enhanceSEO();
  enhanceAccessibility();
  enhancePerformance();
});
