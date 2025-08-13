// Highlight current section in header nav as user scrolls

(function(){
  // Highlight current section
  const navLinks = document.querySelectorAll('.nav-link[data-nav-link]');
  const sections = Array.from(navLinks).map(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      return document.querySelector(href);
    }
    return null;
  });
  function onScroll(){
    let current = -1;
    const scrollY = window.scrollY + 120;
    sections.forEach((section, i) => {
      if (section && section.offsetTop <= scrollY) {
        current = i;
      }
    });
    navLinks.forEach((link, i) => {
      if (i === current && current !== -1) {
        link.classList.add('active');
        link.setAttribute('aria-current','page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile menu toggle fix
  var menuToggle = document.querySelector('.menu-toggle');
  var navList = document.querySelector('.nav-list');
  if(menuToggle && navList){
    menuToggle.addEventListener('click', function(){
      navList.classList.toggle('show');
      document.body.classList.toggle('no-scroll', navList.classList.contains('show'));
    });
  }
})();
