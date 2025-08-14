// ===== COMPLETELY REWRITTEN NAVIGATION SYSTEM =====

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
    // Desktop dropdown functionality
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

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

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

    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }

  setupResponsiveHandling() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Initial check
    this.handleResize();
  }

  handleResize() {
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
      this.closeAllDesktopDropdowns();
    } else {
      this.closeMobileMenu();
    }
  }

  // Desktop dropdown methods
  openDesktopDropdown(dropdown) {
    dropdown.classList.add('open');
  }

  closeDesktopDropdown(dropdown) {
    dropdown.classList.remove('open');
  }

  closeAllDesktopDropdowns() {
    document.querySelectorAll('.desktop-nav .dropdown.open').forEach(dropdown => {
      dropdown.classList.remove('open');
    });
  }

  // Mobile menu methods
  toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuToggle = document.querySelector('.menu-toggle');

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
    const menuToggle = document.querySelector('.menu-toggle');

    if (mobileMenu) {
      mobileMenu.classList.add('active');
      document.body.classList.add('menu-open');
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.add('show');
    }

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuToggle = document.querySelector('.menu-toggle');

    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('show');
    }

    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    // Close all mobile dropdowns
    document.querySelectorAll('.mobile-dropdown-menu').forEach(menu => {
      menu.style.display = 'none';
    });

    document.querySelectorAll('.mobile-dropdown-trigger').forEach(trigger => {
      trigger.classList.remove('active');
    });
  }
}

// ===== SIMPLIFIED ANIMATION SYSTEM =====

class SimpleAnimationSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupRevealAnimations();
    this.setupLoaderAnimation();
    this.setupThemeToggle();
  }

  setupRevealAnimations() {
    // Simple reveal animation using Intersection Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .fadeup, .service-card, .review-card').forEach(el => {
      revealObserver.observe(el);
    });
  }

  setupLoaderAnimation() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Simple loader animation
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        this.revealContent();
      }, 500);
    }, 1500);
  }

  revealContent() {
    const header = document.querySelector('.main-site-nav');
    const main = document.querySelector('main');
    const footer = document.querySelector('.footer');

    if (header) header.style.opacity = '1';
    if (main) main.style.opacity = '1';
    if (footer) footer.style.opacity = '1';
  }

  setupThemeToggle() {
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
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.setAttribute('aria-pressed', isDark);
    });
  }
}

// ===== CONTENT LOADING =====

function loadContentFromServer() {
  console.log('Loading content from server...');
  fetch('/api/content')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Content loaded successfully:', data);
      updateContent(data);
    })
    .catch(error => {
      console.error('Error loading content:', error);
    });
}

function updateContent(data) {
  // Update About section
  if (data.aboutContent) {
    const aboutSection = document.querySelector('#about .about-bloc');
    if (aboutSection) {
      const paragraphs = data.aboutContent.split('\n\n');
      aboutSection.innerHTML = '<h2>About the Firm</h2>';

      paragraphs.forEach(paragraph => {
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

  // Update Founders section
  if (data.suryanshBio || data.divyanshBio) {
    const foundersSection = document.querySelector('.founders-section');
    if (foundersSection) {
      foundersSection.innerHTML = '<div class="container"><h2>Founders</h2></div>';
      const container = foundersSection.querySelector('.container');

      if (data.suryanshBio) {
        const founderDiv = document.createElement('div');
        founderDiv.className = 'founder';
        founderDiv.innerHTML = `
          <div class="founder-photo">
            <img src="${data.suryanshPhoto || ''}" alt="Advocate Suryansh Shukla" />
          </div>
          <div class="founder-info">
            <h3>Advocate Suryansh Shukla</h3>
            <p class="founder-bio">${data.suryanshBio}</p>
          </div>
        `;
        container.appendChild(founderDiv);
      }

      if (data.divyanshBio) {
        const founderDiv = document.createElement('div');
        founderDiv.className = 'founder';
        founderDiv.innerHTML = `
          <div class="founder-photo">
            <img src="${data.divyanshPhoto || ''}" alt="Advocate Divyansh Shukla" />
          </div>
          <div class="founder-info">
            <h3>Advocate Divyansh Shukla</h3>
            <p class="founder-bio">${data.divyanshBio}</p>
          </div>
        `;
        container.appendChild(founderDiv);
      }
    }
  }

  // Update logo
  if (data.aboutLogo) {
    const logoElement = document.querySelector('#about .about-visual img');
    if (logoElement) {
      logoElement.src = data.aboutLogo;
    }
  }
}

// ===== CONTACT FORM =====

function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    const formStatus = document.getElementById('formStatus');

    // Reset error messages
    document.querySelectorAll('.error-message').forEach(error => {
      error.textContent = '';
    });

    let isValid = true;

    // Validate name
    if (!name.value.trim()) {
      document.getElementById('name-error').textContent = 'Name is required';
      isValid = false;
    }

    // Validate email
    if (!email.value.trim()) {
      document.getElementById('email-error').textContent = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate phone
    if (!phone.value.trim()) {
      document.getElementById('phone-error').textContent = 'Phone number is required';
      isValid = false;
    } else {
      const cleanPhone = phone.value.replace(/\D/g, '');
      if (!/^\d{10,15}$/.test(cleanPhone)) {
        document.getElementById('phone-error').textContent = 'Please enter a valid phone number';
        isValid = false;
      }
    }

    // Validate message
    if (!message.value.trim()) {
      document.getElementById('message-error').textContent = 'Message is required';
      isValid = false;
    }

    if (!isValid) {
      formStatus.textContent = "Please fill in all required fields correctly.";
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
        name: name.value,
        email: email.value,
        phone: phone.value,
        message: message.value
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          formStatus.textContent = "Thank you! We will get back to you soon.";
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
  });
}

// ===== FAQ TOGGLES =====

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

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  new ResponsiveNavigation();

  // Initialize animations
  new SimpleAnimationSystem();

  // Load content from server
  loadContentFromServer();

  // Setup contact form
  setupContactForm();

  // Setup FAQ toggles
  setupFAQ();

  // Setup smooth scrolling
  setupSmoothScrolling();
});
