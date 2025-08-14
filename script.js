// ===== COMPLETELY REWRITTEN WEBSITE SYSTEM =====

// ===== RESPONSIVE NAVIGATION SYSTEM =====
class ResponsiveNavigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupDesktopNavigation();
    this.setupMobileNavigation();
    this.setupResponsiveHandling();
  }

  setupDesktopNavigation() {
    const desktopDropdowns = document.querySelectorAll('.desktop-nav .dropdown');

    desktopDropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-trigger');
      const submenu = dropdown.querySelector('.submenu');

      if (!trigger || !submenu) return;

      let hoverTimeout;

      // Desktop hover events
      dropdown.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        this.closeAllDesktopDropdowns();
        this.openDesktopDropdown(dropdown);
      });

      dropdown.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          this.closeDesktopDropdown(dropdown);
        }, 150);
      });

      // Prevent submenu from closing when hovering over it
      submenu.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
      });

      submenu.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          this.closeDesktopDropdown(dropdown);
        }, 150);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.desktop-nav .dropdown')) {
        this.closeAllDesktopDropdowns();
      }
    });

    // Close dropdowns on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDesktopDropdowns();
      }
    });
  }

  setupMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (!menuToggle || !mobileMenu) return;

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Close on overlay click
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Mobile dropdown functionality
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

    mobileDropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
      const menu = dropdown.querySelector('.mobile-dropdown-menu');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', () => {
        // Close other mobile dropdowns
        mobileDropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            const otherMenu = otherDropdown.querySelector('.mobile-dropdown-menu');
            const otherTrigger = otherDropdown.querySelector('.mobile-dropdown-trigger');
            if (otherMenu && otherTrigger) {
              otherMenu.style.display = 'none';
              otherTrigger.classList.remove('active');
            }
          }
        });

        // Toggle current dropdown
        const isOpen = menu.style.display === 'block';
        menu.style.display = isOpen ? 'none' : 'block';
        trigger.classList.toggle('active', !isOpen);
      });
    });

    // Close mobile dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mobile-dropdown')) {
        mobileDropdowns.forEach(dropdown => {
          const menu = dropdown.querySelector('.mobile-dropdown-menu');
          const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
          if (menu && trigger) {
            menu.style.display = 'none';
            trigger.classList.remove('active');
          }
        });
      }
    });
  }

  setupResponsiveHandling() {
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        this.closeMobileMenu();
      }
    });
  }

  openDesktopDropdown(dropdown) {
    dropdown.classList.add('open');
  }

  closeDesktopDropdown(dropdown) {
    dropdown.classList.remove('open');
  }

  closeAllDesktopDropdowns() {
    document.querySelectorAll('.desktop-nav .dropdown.open').forEach(dropdown => {
      this.closeDesktopDropdown(dropdown);
    });
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (!mobileMenu) return;

    const isOpen = mobileMenu.classList.contains('active');

    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (mobileMenu) {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.add('show');
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('show');
    }
  }
}

// ===== UNIFIED ANIMATION SYSTEM =====
class UnifiedAnimationSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupSectionAnimations();
    this.setupHeroAnimations();
    this.setupLoader();
  }

  setupSectionAnimations() {
    // Create Intersection Observer for section-based animations
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // When a section becomes visible, animate ALL elements within it at once
          const section = entry.target;
          const animatedElements = section.querySelectorAll('.reveal, .fadeup, .service-card, .review-card');

          // Add active class to all elements in the section simultaneously - NO DELAYS
          animatedElements.forEach(element => {
            element.classList.add('active');
          });

          // Unobserve the section after animation
          sectionObserver.unobserve(section);
        }
      });
    }, {
      threshold: 0.3, // Even earlier trigger - 30% visibility
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe all sections that contain animated elements
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      if (section.querySelector('.reveal, .fadeup, .service-card, .review-card')) {
        sectionObserver.observe(section);
      }
    });
  }

  setupHeroAnimations() {
    // Hero section animations
    const heroTitle = document.querySelector('.hero-title .fadeup');
    const heroSubtext = document.querySelector('.hero-subtext');
    const heroButton = document.querySelector('.hero-section .btn-primary');

    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('active'), 100);
    }
    if (heroSubtext) {
      setTimeout(() => heroSubtext.classList.add('active'), 300);
    }
    if (heroButton) {
      setTimeout(() => heroButton.classList.add('active'), 500);
    }
  }

  setupLoader() {
    const loader = document.getElementById('loader');
    const main = document.querySelector('main');
    const header = document.querySelector('.main-site-nav');
    const footer = document.querySelector('.footer');

    if (loader) {
      // Hide loader after page loads
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
            // Show main content
            if (main) main.style.opacity = '1';
            if (header) header.style.opacity = '1';
            if (footer) footer.style.opacity = '1';
          }, 500);
        }, 1000);
      });
    }
  }
}

// ===== CONTACT FORM SYSTEM =====
function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formStatus = document.getElementById('formStatus');

    // Basic validation
    const name = formData.get('name') || document.getElementById('name')?.value;
    const email = formData.get('email') || document.getElementById('email')?.value;
    const phone = formData.get('phone') || document.getElementById('phone')?.value;
    const message = formData.get('message') || document.getElementById('message')?.value;

    if (!name || !email || !phone || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.className = "error";
      return;
    }

    // Submit form
    formStatus.textContent = "Sending...";
    formStatus.className = "sending";

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        message: message
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          formStatus.textContent = "Thank you! We will get back to you soon.";
          formStatus.className = "success";
          contactForm.reset();
        } else {
          formStatus.textContent = "Error: " + (data.message || "Failed to send message");
          formStatus.className = "error";
        }
      })
      .catch(err => {
        console.error('Error submitting form:', err);
        formStatus.textContent = "Error sending message. Please try again.";
        formStatus.className = "error";
      });
  });
}

// ===== FAQ SYSTEM =====
function setupFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ===== THEME TOGGLE =====
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    themeToggle.setAttribute('aria-pressed', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Shukla & Shukla Associates website...');

  // Initialize all systems
  new ResponsiveNavigation();
  new UnifiedAnimationSystem();
  setupContactForm();
  setupFAQ();
  setupSmoothScrolling();
  setupThemeToggle();

  console.log('✅ Website initialized successfully!');
});
