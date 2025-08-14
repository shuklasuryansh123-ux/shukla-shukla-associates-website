// ===== MAIN APPLICATION =====
class App {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoader();
    this.setupNavigation();
    this.setupScrollAnimations();
    this.setupFAQ();
    this.setupContactForm();
    this.loadContent();
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-link]');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Handle dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-trigger');
      const submenu = dropdown.querySelector('.submenu');

      if (trigger && submenu) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.classList.toggle('open');
        });
      }
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Observe all elements with reveal or fadeup classes
    const animatedElements = document.querySelectorAll('.reveal, .fadeup');
    animatedElements.forEach(el => observer.observe(el));
  }

  setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isExpanded = question.getAttribute('aria-expanded') === 'true';

        // Close all other answers
        faqQuestions.forEach(q => {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling.classList.remove('active');
        });

        // Toggle current answer
        if (!isExpanded) {
          question.setAttribute('aria-expanded', 'true');
          answer.classList.add('active');
        }
      });
    });
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

  async loadContent() {
    try {
      // Load firm logo
      const firmLogoResponse = await fetch('/api/content/firmLogo');
      if (firmLogoResponse.ok) {
        const firmLogoImage = document.getElementById('firmLogoImage');
        if (firmLogoImage) {
          firmLogoImage.src = '/api/content/firmLogo';
        }
      }

      // Load founder photos
      const suryanshPhotoResponse = await fetch('/api/content/suryanshPhoto');
      if (suryanshPhotoResponse.ok) {
        const suryanshPhotoImage = document.getElementById('suryanshPhotoImage');
        if (suryanshPhotoImage) {
          suryanshPhotoImage.src = '/api/content/suryanshPhoto';
        }
      }

      const divyanshPhotoResponse = await fetch('/api/content/divyanshPhoto');
      if (divyanshPhotoResponse.ok) {
        const divyanshPhotoImage = document.getElementById('divyanshPhotoImage');
        if (divyanshPhotoImage) {
          divyanshPhotoImage.src = '/api/content/divyanshPhoto';
        }
      }

      // Load reviews
      const reviewsResponse = await fetch('/api/reviews');
      if (reviewsResponse.ok) {
        const reviews = await reviewsResponse.json();
        this.populateReviews(reviews);
      }

      // Load blog posts
      const blogResponse = await fetch('/api/blogs');
      if (blogResponse.ok) {
        const blogs = await blogResponse.json();
        this.populateBlogs(blogs);
      }

      // Load gallery images
      const galleryResponse = await fetch('/api/gallery');
      if (galleryResponse.ok) {
        const gallery = await galleryResponse.json();
        this.populateGallery(gallery);
      }

    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  populateReviews(reviews) {
    const leftTrack = document.querySelector('.reviews-track-left');
    const rightTrack = document.querySelector('.reviews-track-right');

    if (leftTrack && rightTrack) {
      // Clear existing content
      leftTrack.innerHTML = '';
      rightTrack.innerHTML = '';

      // Add reviews to both tracks for seamless scrolling
      reviews.forEach(review => {
        const reviewCard = this.createReviewCard(review);
        leftTrack.appendChild(reviewCard.cloneNode(true));
        rightTrack.appendChild(reviewCard.cloneNode(true));
      });
    }
  }

  createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <h4>${review.name}</h4>
      <p>${review.comment}</p>
    `;
    return card;
  }

  populateBlogs(blogs) {
    const blogSlider = document.querySelector('.blog-slider');
    if (blogSlider) {
      blogSlider.innerHTML = '';

      blogs.slice(0, 3).forEach(blog => {
        const blogCard = this.createBlogCard(blog);
        blogSlider.appendChild(blogCard);
      });
    }
  }

  createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.excerpt}</p>
      <a href="/blogs.html#${blog.id}" class="btn-primary">Read More</a>
    `;
    return card;
  }

  populateGallery(gallery) {
    const galleryStrip = document.querySelector('.gallery-strip');
    if (galleryStrip) {
      galleryStrip.innerHTML = '';

      gallery.slice(0, 6).forEach(image => {
        const imageElement = document.createElement('img');
        imageElement.src = `/api/gallery/${image.id}`;
        imageElement.alt = image.caption || 'Gallery image';
        imageElement.style.width = '100%';
        imageElement.style.height = '200px';
        imageElement.style.objectFit = 'cover';
        imageElement.style.borderRadius = '4px';
        galleryStrip.appendChild(imageElement);
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

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
  new App();
  setupContactForm();
});
