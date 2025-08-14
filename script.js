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

      submenu.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
      });

      submenu.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          this.closeDesktopDropdown(dropdown);
        }, 150);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.desktop-nav .dropdown')) {
        this.closeAllDesktopDropdowns();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDesktopDropdowns();
      }
    });
  }

  setupMobileNavigation() {
    // Mobile navigation is completely disabled - only desktop navigation is used
    // This ensures consistent layout across all devices
    return;
  }

  setupResponsiveHandling() {
    // No responsive handling needed since we use desktop navigation on all devices
    return;
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
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const animatedElements = section.querySelectorAll('.reveal, .fadeup, .service-card, .review-card');

          animatedElements.forEach(element => {
            element.classList.add('active');
          });

          sectionObserver.unobserve(section);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      if (section.querySelector('.reveal, .fadeup, .service-card, .review-card')) {
        sectionObserver.observe(section);
      }
    });
  }

  setupHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title .fadeup');
    const heroSubtext = document.querySelector('.hero-subtext');
    const heroButton = document.querySelector('.hero-section .btn-primary');
    const heroQuote = document.querySelector('.hero-quote');

    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('active'), 100);
    }
    if (heroSubtext) {
      setTimeout(() => heroSubtext.classList.add('active'), 300);
    }
    if (heroButton) {
      setTimeout(() => heroButton.classList.add('active'), 500);
    }
    if (heroQuote) {
      setTimeout(() => heroQuote.classList.add('active'), 700);
    }
  }

  setupLoader() {
    const loader = document.getElementById('loader');
    const main = document.querySelector('main');
    const header = document.querySelector('.main-site-nav');
    const footer = document.querySelector('.footer');

    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
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

    const name = formData.get('name') || document.getElementById('name')?.value;
    const email = formData.get('email') || document.getElementById('email')?.value;
    const phone = formData.get('phone') || document.getElementById('phone')?.value;
    const message = formData.get('message') || document.getElementById('message')?.value;

    if (!name || !email || !phone || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.className = "error";
      return;
    }

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

// ===== CONTENT LOADING =====
function loadContentFromServer() {
  fetch('/api/content')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
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

// ===== REVIEWS SYSTEM =====
function loadReviews() {
  const reviewsData = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      text: "Exceptional legal expertise. Shukla & Shukla Associates handled my corporate case with utmost professionalism and achieved excellent results."
    },
    {
      name: "Priya Sharma",
      rating: 5,
      text: "The team's dedication to client success is remarkable. They provided clear guidance throughout my family law proceedings."
    },
    {
      name: "Amit Patel",
      rating: 5,
      text: "Outstanding criminal defense representation. Their strategic approach and courtroom skills are truly impressive."
    },
    {
      name: "Meera Singh",
      rating: 5,
      text: "Professional, responsive, and results-driven. I highly recommend their real estate law services."
    },
    {
      name: "Vikram Malhotra",
      rating: 5,
      text: "The firm's expertise in labor law helped resolve my employment dispute efficiently and fairly."
    },
    {
      name: "Anjali Desai",
      rating: 5,
      text: "Comprehensive legal solutions with personalized attention. Their trademark and IPR services are top-notch."
    }
  ];

  const leftTrack = document.querySelector('.reviews-track-left');
  const rightTrack = document.querySelector('.reviews-track-right');

  if (leftTrack) {
    reviewsData.forEach(review => {
      const reviewCard = createReviewCard(review);
      leftTrack.appendChild(reviewCard.cloneNode(true));
    });
  }

  if (rightTrack) {
    reviewsData.forEach(review => {
      const reviewCard = createReviewCard(review);
      rightTrack.appendChild(reviewCard.cloneNode(true));
    });
  }
}

function createReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `
    <div style="margin-bottom: 1rem;">
      ${'⭐'.repeat(review.rating)}
    </div>
    <p style="margin-bottom: 1rem; font-style: italic;">"${review.text}"</p>
    <strong>${review.name}</strong>
  `;
  return card;
}

// ===== BLOG SYSTEM =====
function loadBlogPosts() {
  const blogSlider = document.querySelector('.blog-slider');
  if (!blogSlider) return;

  const blogPosts = [
    {
      title: "Understanding Corporate Law in India",
      excerpt: "A comprehensive guide to corporate legal frameworks and compliance requirements for businesses operating in India.",
      date: "2024-01-15"
    },
    {
      title: "Family Law: Recent Developments",
      excerpt: "Key updates in family law legislation and their implications for divorce, custody, and inheritance cases.",
      date: "2024-01-10"
    },
    {
      title: "Real Estate Law: Protecting Your Investment",
      excerpt: "Essential legal considerations for property transactions and how to safeguard your real estate investments.",
      date: "2024-01-05"
    }
  ];

  blogPosts.forEach(post => {
    const blogCard = document.createElement('div');
    blogCard.className = 'service-card';
    blogCard.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <small style="color: var(--slate);">${new Date(post.date).toLocaleDateString()}</small>
    `;
    blogSlider.appendChild(blogCard);
  });
}

// ===== GALLERY SYSTEM =====
function loadGalleryImages() {
  const galleryStrip = document.querySelector('.gallery-strip');
  if (!galleryStrip) return;

  const galleryImages = [
    { src: '/api/content/gallery1', alt: 'Courtroom proceedings' },
    { src: '/api/content/gallery2', alt: 'Legal consultation' },
    { src: '/api/content/gallery3', alt: 'Team meeting' },
    { src: '/api/content/gallery4', alt: 'Award ceremony' }
  ];

  galleryImages.forEach(image => {
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = 'aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: var(--surface); display: flex; align-items: center; justify-content: center;';
    imgContainer.innerHTML = `
      <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--accent), var(--primary)); opacity: 0.1;"></div>
    `;
    galleryStrip.appendChild(imgContainer);
  });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  new ResponsiveNavigation();
  new UnifiedAnimationSystem();
  loadContentFromServer();
  loadReviews();
  loadBlogPosts();
  loadGalleryImages();
  setupContactForm();
  setupFAQ();
  setupSmoothScrolling();
  setupThemeToggle();
});
