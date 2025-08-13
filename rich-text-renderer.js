// Rich Text Content Renderer
// This script handles the rendering of rich text content from the admin panel

class RichTextRenderer {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.renderAllContent());
    } else {
      this.renderAllContent();
    }
  }

  renderAllContent() {
    this.renderAboutContent();
    this.renderContactInfo();
    this.renderBlogPosts();
    this.renderGalleryDescriptions();
  }

  // Render about us content with rich text formatting
  renderAboutContent() {
    const aboutElements = document.querySelectorAll('.about-content, [data-content="about"]');
    aboutElements.forEach(element => {
      if (element.innerHTML && !element.classList.contains('rich-text-rendered')) {
        element.classList.add('rich-text-content');
        element.classList.add('rich-text-rendered');
        this.sanitizeAndRender(element);
      }
    });
  }

  // Render contact information with rich text formatting
  renderContactInfo() {
    const contactElements = document.querySelectorAll('.contact-info, [data-content="contact"]');
    contactElements.forEach(element => {
      if (element.innerHTML && !element.classList.contains('rich-text-rendered')) {
        element.classList.add('rich-text-content');
        element.classList.add('rich-text-rendered');
        this.sanitizeAndRender(element);
      }
    });
  }

  // Render blog posts with rich text formatting
  renderBlogPosts() {
    const blogElements = document.querySelectorAll('.blog-content, [data-content="blog"]');
    blogElements.forEach(element => {
      if (element.innerHTML && !element.classList.contains('rich-text-rendered')) {
        element.classList.add('rich-text-content');
        element.classList.add('rich-text-rendered');
        this.sanitizeAndRender(element);
      }
    });
  }

  // Render gallery descriptions with rich text formatting
  renderGalleryDescriptions() {
    const galleryElements = document.querySelectorAll('.gallery-description, [data-content="gallery"]');
    galleryElements.forEach(element => {
      if (element.innerHTML && !element.classList.contains('rich-text-rendered')) {
        element.classList.add('rich-text-content');
        element.classList.add('rich-text-rendered');
        this.sanitizeAndRender(element);
      }
    });
  }

  // Sanitize HTML content to prevent XSS attacks
  sanitizeAndRender(element) {
    const allowedTags = {
      'b': 'strong',
      'i': 'em',
      'u': 'u',
      'strong': 'strong',
      'em': 'em',
      'ul': 'ul',
      'ol': 'ol',
      'li': 'li',
      'p': 'p',
      'br': 'br',
      'h1': 'h1',
      'h2': 'h2',
      'h3': 'h3',
      'h4': 'h4',
      'h5': 'h5',
      'h6': 'h6'
    };

    const allowedAttributes = {
      'class': ['rich-text-content'],
      'style': []
    };

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = element.innerHTML;

    // Recursively sanitize the content
    this.sanitizeNode(tempDiv, allowedTags, allowedAttributes);

    // Update the element with sanitized content
    element.innerHTML = tempDiv.innerHTML;
  }

  // Recursively sanitize DOM nodes
  sanitizeNode(node, allowedTags, allowedAttributes) {
    if (node.nodeType === Node.TEXT_NODE) {
      return; // Text nodes are safe
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      // Check if tag is allowed
      if (!allowedTags[tagName]) {
        // Replace disallowed tags with their content
        const parent = node.parentNode;
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
        return;
      }

      // Sanitize attributes
      const attributes = Array.from(node.attributes);
      attributes.forEach(attr => {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value;

        // Check if attribute is allowed
        if (!allowedAttributes[attrName]) {
          node.removeAttribute(attrName);
        } else if (attrName === 'style') {
          // Only allow safe CSS properties
          const safeStyles = this.sanitizeStyles(attrValue);
          if (safeStyles) {
            node.setAttribute('style', safeStyles);
          } else {
            node.removeAttribute('style');
          }
        }
      });

      // Recursively sanitize child nodes
      const children = Array.from(node.childNodes);
      children.forEach(child => {
        this.sanitizeNode(child, allowedTags, allowedAttributes);
      });
    }
  }

  // Sanitize CSS styles
  sanitizeStyles(styleString) {
    const allowedProperties = [
      'color', 'background-color', 'font-weight', 'font-style',
      'text-decoration', 'text-align', 'margin', 'padding',
      'font-size', 'line-height', 'font-family'
    ];

    const safeStyles = [];
    const stylePairs = styleString.split(';');

    stylePairs.forEach(pair => {
      const [property, value] = pair.split(':').map(s => s.trim());
      if (property && value && allowedProperties.includes(property.toLowerCase())) {
        safeStyles.push(`${property}: ${value}`);
      }
    });

    return safeStyles.join('; ');
  }

  // Update content dynamically (for AJAX-loaded content)
  updateContent(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = content;
      element.classList.add('rich-text-content');
      element.classList.add('rich-text-rendered');
      this.sanitizeAndRender(element);
    }
  }

  // Render specific content by ID
  renderById(elementId) {
    const element = document.getElementById(elementId);
    if (element && !element.classList.contains('rich-text-rendered')) {
      element.classList.add('rich-text-content');
      element.classList.add('rich-text-rendered');
      this.sanitizeAndRender(element);
    }
  }

  // Render content by class
  renderByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
      if (!element.classList.contains('rich-text-rendered')) {
        element.classList.add('rich-text-content');
        element.classList.add('rich-text-rendered');
        this.sanitizeAndRender(element);
      }
    });
  }
}

// Initialize the rich text renderer
const richTextRenderer = new RichTextRenderer();

// Export for use in other scripts
window.RichTextRenderer = RichTextRenderer;
window.richTextRenderer = richTextRenderer;

// Auto-render content when new content is loaded via AJAX
document.addEventListener('DOMContentLoaded', () => {
  // Create a MutationObserver to watch for new content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the new node contains rich text content
            const richTextElements = node.querySelectorAll('.about-content, .contact-info, .blog-content, .gallery-description, [data-content]');
            richTextElements.forEach(element => {
              if (!element.classList.contains('rich-text-rendered')) {
                richTextRenderer.renderAllContent();
              }
            });
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Helper function to render content from API responses
function renderApiContent(content, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (target) {
    target.innerHTML = content;
    richTextRenderer.updateContent(targetSelector, content);
  }
}

// Helper function to render blog content
function renderBlogContent(blogId, content) {
  const blogElement = document.querySelector(`[data-blog-id="${blogId}"]`);
  if (blogElement) {
    blogElement.innerHTML = content;
    richTextRenderer.updateContent(`[data-blog-id="${blogId}"]`, content);
  }
}

// Helper function to render gallery content
function renderGalleryContent(galleryId, content) {
  const galleryElement = document.querySelector(`[data-gallery-id="${galleryId}"]`);
  if (galleryElement) {
    galleryElement.innerHTML = content;
    richTextRenderer.updateContent(`[data-gallery-id="${galleryId}"]`, content);
  }
}
