// ==================== UTILITY FUNCTIONS ====================
function safeGetElement(id) {
  const element = document.getElementById(id);
  if (!element) console.warn(`Element with id "${id}" not found`);
  return element;
}

function safeQuerySelector(selector) {
  const element = document.querySelector(selector);
  if (!element) console.warn(`Element with selector "${selector}" not found`);
  return element;
}

function safeQuerySelectorAll(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) console.warn(`No elements found for selector "${selector}"`);
  return elements;
}

// ==================== LOADER ====================
function initLoader() {
  const loader = safeGetElement('loader');
  if (!loader) return;
  
  window.addEventListener('load', () => {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s, visibility 0.5s';
    
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  });
}

// ==================== COUNTERS ANIMATION ====================
function initCounters() {
  const aboutSection = safeQuerySelector('#about');
  if (!aboutSection) return;
  
  // Fix: Use correct selector based on CSS (.counter-item h3)
  const counters = safeQuerySelectorAll('.counter-item h3');
  if (counters.length === 0) return;
  
  const speed = 200;
  let animationStarted = false;
  
  function runCounters() {
    if (animationStarted) return;
    animationStarted = true;
    
    counters.forEach(counter => {
      // Get target value from data-target or use the number in the element
      let target = parseInt(counter.getAttribute('data-target'));
      if (isNaN(target)) {
        // If no data-target, try to parse the existing text
        target = parseInt(counter.innerText) || 100;
      }
      
      const update = () => {
        const current = parseInt(counter.innerText) || 0;
        const inc = Math.ceil(target / speed);
        
        if (current < target) {
          const nextValue = Math.min(current + inc, target);
          counter.innerText = nextValue;
          setTimeout(update, 20);
        } else {
          counter.innerText = target;
        }
      };
      
      update();
    });
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounters();
        observer.disconnect(); // Stop observing once started
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(aboutSection);
}

// ==================== PROGRESS BAR & BACK TO TOP ====================
function initProgressAndBackToTop() {
  const progressBar = safeGetElement('progressBar');
  const backToTop = safeGetElement('backToTop');
  
  if (!progressBar && !backToTop) return;
  
  function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (progressBar) {
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }
    
    if (backToTop) {
      if (winScroll > 600) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  }
  
  window.addEventListener('scroll', updateScrollProgress);
  
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  const hamburger = safeQuerySelector('.hamburger');
  const mobileMenu = safeGetElement('mobileMenu');
  
  if (!hamburger || !mobileMenu) return;
  
  function closeMobileMenu() {
    mobileMenu.style.display = 'none';
  }
  
  function toggleMobileMenu(e) {
    e.stopPropagation();
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
  }
  
  hamburger.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking a link
  safeQuerySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
      closeMobileMenu();
    }
  });
  
  // Close menu on window resize (if going to desktop view)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      closeMobileMenu();
    }
  });
}

// ==================== CAROUSEL ====================
function initCarousel() {
  const carousel = safeGetElement('testimonialCarousel');
  const leftArrow = safeGetElement('carouselLeft');
  const rightArrow = safeGetElement('carouselRight');
  
  if (!carousel || !leftArrow || !rightArrow) return;
  
  leftArrow.addEventListener('click', () => {
    carousel.scrollBy({ left: -380, behavior: 'smooth' });
  });
  
  rightArrow.addEventListener('click', () => {
    carousel.scrollBy({ left: 380, behavior: 'smooth' });
  });
}

// ==================== FAQ ACCORDION ====================
function initFaqAccordion() {
  const faqQuestions = safeQuerySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      if (!item) return;
      
      // Close other open items (optional - uncomment if you want only one open at a time)
      // document.querySelectorAll('.faq-item.open').forEach(openItem => {
      //   if (openItem !== item) openItem.classList.remove('open');
      // });
      
      item.classList.toggle('open');
    });
  });
}

// ==================== CASE STUDIES ====================
const caseStudies = [
  { id: 1, title: 'FinTech scale-up', client: 'PaySwift', category: 'finance', img: '1.jpg', result1: '180%', result1label: 'revenue', result2: '2.5M', result2label: 'users' },
  { id: 2, title: 'AI-driven underwriting', client: 'InsureCorp', category: 'finance', img: '2.jpg', result1: '42%', result1label: 'faster', result2: '€12M', result2label: 'savings' },
  { id: 3, title: 'Legacy modernization', client: 'MediHealth', category: 'healthcare', img: '3.jpg', result1: '99.9%', result1label: 'uptime', result2: '300+', result2label: 'hospitals' },
  { id: 4, title: 'Global ERP roll-out', client: 'OmniCorp', category: 'industry', img: '4.jpg', result1: '28%', result1label: 'cost cut', result2: '14', result2label: 'countries' },
  { id: 5, title: 'Cloud migration', client: 'NexGenTech', category: 'tech', img: '5.jpg', result1: '50%', result1label: 'faster', result2: '99.95%', result2label: 'availability' },
  { id: 6, title: 'Supply chain AI', client: 'AutoGroup', category: 'industry', img: '6.jpg', result1: '35%', result1label: 'efficiency', result2: '€8M', result2label: 'saved' },
];

function initCaseStudies() {
  const grid = safeGetElement('casesGrid');
  const filterBtns = safeQuerySelectorAll('.filter-btn');
  
  if (!grid) return;
  
  function renderCards(filter = 'all') {
    const filtered = filter === 'all' ? caseStudies : caseStudies.filter(c => c.category === filter);
    
    if (filtered.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:3rem;">No case studies found in this category.</p>';
      return;
    }
    
    grid.innerHTML = filtered.map(c => `
      <div class="case-card" data-category="${c.category}">
        <div class="card-img" style="background-image: url('${c.img}'); background-size: cover; background-position: center;">
          <span class="card-tag">${c.category}</span>
        </div>
        <div class="card-content">
          <h3>${c.title}</h3>
          <div class="client">${c.client}</div>
          <p>Strategic overhaul delivering measurable outcomes.</p>
          <div class="results">
            <div class="result-item"><span>${c.result1}</span> ${c.result1label}</div>
            <div class="result-item"><span>${c.result2}</span> ${c.result2label}</div>
          </div>
          <a href="#" class="btn-small">View case <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
  }
  
  renderCards();
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.filter);
    });
  });
}

// ==================== BLOG ====================
const blogPosts = [
  { id: 1, title: '2025 Market trends: what executives must know', cat: 'strategy', date: 'Apr 2, 2025', author: 'Elena Voss', img: '1.jpg', excerpt: 'How geopolitical shifts and AI are reshaping corporate strategy.' },
  { id: 2, title: 'ESG as a value driver, not a cost', cat: 'finance', date: 'Mar 28, 2025', author: 'Michael Chen', img: '2.jpg', excerpt: 'New metrics show sustainability boosts margins.' },
  { id: 3, title: 'Leading through uncertainty', cat: 'leadership', date: 'Mar 20, 2025', author: 'Sarah Okonkwo', img: '3.jpg', excerpt: 'Resilience and culture in volatile times.' },
  { id: 4, title: 'AI in finance: beyond the hype', cat: 'digital', date: 'Mar 15, 2025', author: 'James Carter', img: '4.jpg', excerpt: 'Practical use cases that deliver ROI today.' },
  { id: 5, title: 'The art of M&A integration', cat: 'strategy', date: 'Mar 10, 2025', author: 'Elena Voss', img: '5.jpg', excerpt: 'Why half of deals fail and how to beat the odds.' },
  { id: 6, title: 'Digital transformation in banking', cat: 'digital', date: 'Mar 5, 2025', author: 'Sarah Okonkwo', img: '6.jpg', excerpt: 'Legacy modernization case studies.' },
  { id: 7, title: 'Talent retention 2025', cat: 'leadership', date: 'Feb 28, 2025', author: 'Michael Chen', img: '7.jpg', excerpt: 'New hybrid models and what employees want.' },
  { id: 8, title: 'Private equity outlook', cat: 'finance', date: 'Feb 22, 2025', author: 'James Carter', img: '8.jpg', excerpt: 'Deal activity and sector hotspots.' },
  { id: 9, title: 'Supply chain resilience', cat: 'strategy', date: 'Feb 18, 2025', author: 'Elena Voss', img: '9.jpg', excerpt: 'From just-in-time to just-in-case.' },
];

function initBlog() {
  const grid = safeGetElement('blogGrid');
  const searchBtn = safeGetElement('searchBtn');
  const searchInput = safeGetElement('searchInput');
  const loadMoreBtn = safeGetElement('loadMore');
  const categoryBtns = safeQuerySelectorAll('.category-btn');
  const pageBtns = safeQuerySelectorAll('.page-btn');
  
  if (!grid) return;
  
  let currentFilter = 'all';
  let currentSearch = '';
  let visibleCount = 6;
  
  function renderPosts() {
    let filtered = blogPosts.filter(post => {
      const matchesCat = currentFilter === 'all' || post.cat === currentFilter;
      const matchesSearch = post.title.toLowerCase().includes(currentSearch) || 
                           post.excerpt.toLowerCase().includes(currentSearch);
      return matchesCat && matchesSearch;
    });
    
    const limited = filtered.slice(0, visibleCount);
    
    if (limited.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:3rem;">No posts match your criteria.</p>';
      return;
    }
    
    grid.innerHTML = limited.map(post => `
      <div class="blog-card">
        <div class="blog-card-img" style="background-image: url('${post.img}'); background-size: cover; background-position: center;"></div>
        <div class="blog-card-content">
          <div class="blog-meta"><span>${post.date}</span> <span>•</span> <span>${post.author}</span></div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <a href="#" class="read-more">Read article <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
    
    // Hide load more if no more posts
    if (loadMoreBtn) {
      loadMoreBtn.style.display = filtered.length > visibleCount ? 'block' : 'none';
    }
  }
  
  renderPosts();
  
  // Category filter
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.cat;
      visibleCount = 6;
      renderPosts();
    });
  });
  
  // Search functionality
  function performSearch() {
    if (searchInput) {
      currentSearch = searchInput.value.trim().toLowerCase();
      visibleCount = 6;
      renderPosts();
    }
  }
  
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
  
  // Load more
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 3;
      renderPosts();
    });
  }
  
  // Pagination (demo)
  pageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      pageBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      visibleCount = 6;
      renderPosts();
    });
  });
}

// ==================== CONTACT FORM ====================
function initContactForm() {
  const form = safeGetElement('contactForm');
  const successMsg = safeGetElement('successMessage');
  
  if (!form || !successMsg) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = safeGetElement('name');
    const emailInput = safeGetElement('email');
    const messageInput = safeGetElement('message');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    
    // Validation
    if (!name || !email || !message) {
      alert('Please fill in all required fields (*)');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Show success message
    successMsg.style.display = 'block';
    form.reset();
    
    // Hide message after 4 seconds
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 4000);
  });
}

// ==================== ACTIVE NAVIGATION LINK ====================
function initActiveNavLink() {
  const navLinks = safeQuerySelectorAll('.nav-links a, .mobile-menu a');
  if (navLinks.length === 0) return;
  
  function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      
      if (href === currentPath || 
          (currentPath === '' && href === 'index.html') ||
          (currentPath === '/' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  
  setActiveLink();
  
  // Update on click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(setActiveLink, 100);
    });
  });
}

// ==================== INITIALIZE ALL ====================
function initAll() {
  console.log('Initializing application...');
  
  initLoader();
  initCounters();
  initProgressAndBackToTop();
  initMobileMenu();
  initCarousel();
  initFaqAccordion();
  initCaseStudies();
  initBlog();
  initContactForm();
  initActiveNavLink();
  
  console.log('All modules initialized');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}