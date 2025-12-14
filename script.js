/**
 * Math800 Landing Page - JavaScript
 * Handles all interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initMobileMenu();
  initSmoothScroll();
  initBooksCarousel();
  initNewsletterForm();
  initScrollAnimations();
  initSearchBox();
  initVideoPreview();
});

/**
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelector('.nav-links');
  
  // Create mobile menu button
  const menuBtn = document.createElement('button');
  menuBtn.className = 'mobile-menu-btn';
  menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
  menuBtn.innerHTML = `
    <span class="menu-line"></span>
    <span class="menu-line"></span>
    <span class="menu-line"></span>
  `;
  
  // Insert menu button after logo
  const headerContainer = document.querySelector('.header-container');
  const authButtons = document.querySelector('.auth-buttons');
  headerContainer.insertBefore(menuBtn, authButtons);
  
  // Toggle menu on click
  menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Close menu when clicking a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Books Carousel with Touch/Drag Support
 */
function initBooksCarousel() {
  const carousel = document.querySelector('.books-carousel');
  if (!carousel) return;
  
  let isDown = false;
  let startX;
  let scrollLeft;
  
  // Mouse events
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('active');
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('active');
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchScrollLeft = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX - carousel.offsetLeft;
    touchScrollLeft = carousel.scrollLeft;
  }, { passive: true });
  
  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - touchStartX) * 2;
    carousel.scrollLeft = touchScrollLeft - walk;
  }, { passive: true });
  
  // Add navigation arrows
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'carousel-wrapper';
  carousel.parentNode.insertBefore(carouselWrapper, carousel);
  carouselWrapper.appendChild(carousel);
  
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn prev';
  prevBtn.setAttribute('aria-label', 'Previous books');
  prevBtn.innerHTML = '‹';
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn next';
  nextBtn.setAttribute('aria-label', 'Next books');
  nextBtn.innerHTML = '›';
  
  carouselWrapper.appendChild(prevBtn);
  carouselWrapper.appendChild(nextBtn);
  
  const scrollAmount = 200;
  
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });
  
  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
  
  // Update button visibility based on scroll position
  function updateButtons() {
    prevBtn.style.opacity = carousel.scrollLeft <= 0 ? '0.3' : '1';
    nextBtn.style.opacity = 
      carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10 
        ? '0.3' 
        : '1';
  }
  
  carousel.addEventListener('scroll', updateButtons);
  updateButtons();
}

/**
 * Newsletter Form Validation and Submission
 */
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  const input = document.querySelector('.newsletter-input');
  const btn = document.querySelector('.newsletter-btn');
  
  if (!form || !input || !btn) return;
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Validate on input
  input.addEventListener('input', function() {
    if (this.value && !emailRegex.test(this.value)) {
      this.classList.add('invalid');
    } else {
      this.classList.remove('invalid');
    }
  });
  
  // Handle form submission
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    
    const email = input.value.trim();
    
    if (!email) {
      showNotification('Please enter your email address', 'error');
      input.focus();
      return;
    }
    
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      input.focus();
      return;
    }
    
    // Simulate form submission
    btn.disabled = true;
    btn.textContent = 'Subscribing...';
    
    setTimeout(() => {
      showNotification('Thank you for subscribing!', 'success');
      input.value = '';
      btn.disabled = false;
      btn.textContent = 'Subscribe';
    }, 1500);
  });
  
  // Handle Enter key
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      btn.click();
    }
  });
}

/**
 * Show Notification Toast
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Close on click
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto close after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

/**
 * Scroll Animations with Intersection Observer
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.feature-card, .stat-item, .feature-row, .book-card, .video-preview'
  );
  
  if (!animatedElements.length) return;
  
  // Add initial hidden state
  animatedElements.forEach(el => {
    el.classList.add('animate-on-scroll');
  });
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Search Box Functionality
 */
function initSearchBox() {
  const searchInput = document.querySelector('.search-input');
  const exploreBtn = document.querySelector('.explore-btn');
  
  if (!searchInput || !exploreBtn) return;
  
  // Create dropdown menu
  const dropdown = document.createElement('div');
  dropdown.className = 'search-dropdown';
  dropdown.innerHTML = `
    <div class="dropdown-category">
      <h4>Popular Topics</h4>
      <ul>
        <li><a href="#">Algebra Basics</a></li>
        <li><a href="#">Geometry</a></li>
        <li><a href="#">Quadratic Equations</a></li>
        <li><a href="#">Data Analysis</a></li>
        <li><a href="#">Trigonometry</a></li>
      </ul>
    </div>
  `;
  
  const searchBox = document.querySelector('.search-box');
  searchBox.appendChild(dropdown);
  
  // Toggle dropdown on explore button click
  exploreBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    this.classList.toggle('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchBox.contains(e.target)) {
      dropdown.classList.remove('show');
      exploreBtn.classList.remove('active');
    }
  });
  
  // Filter on input
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const items = dropdown.querySelectorAll('li');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'block' : 'none';
    });
    
    if (query) {
      dropdown.classList.add('show');
    }
  });
  
  // Handle enter key
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = this.value.trim();
      if (query) {
        showNotification(`Searching for "${query}"...`, 'info');
        // Here you would typically redirect to a search results page
      }
    }
  });
}

/**
 * Video Preview Play Button
 */
function initVideoPreview() {
  const videoPreview = document.querySelector('.video-preview');
  if (!videoPreview) return;
  
  // Play button click handler for the centered play button
  const playBtnCenter = videoPreview.querySelector('.play-button-center');
  if (playBtnCenter) {
    playBtnCenter.addEventListener('click', function() {
      showNotification('Video player would open here', 'info');
    });
  }
}

/**
 * Header Scroll Effect
 */
(function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
})();

/**
 * Lazy Loading Images
 */
(function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
})();

/**
 * Stat Counter Animation
 */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const text = element.textContent;
  const match = text.match(/(\d+)/);
  
  if (!match) return;
  
  const target = parseInt(match[1]);
  const suffix = text.replace(match[1], '');
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', initStatCounters);
