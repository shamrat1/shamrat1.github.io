/**
 * Modular Dynamic Engine - Yasin Siraj Shamrat Portfolio
 * Reads data from portfolio.json and dynamically builds the UI with rich micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let portfolioData = null;
  let activeFilter = 'featured'; // Default filter is Featured projects

  // Load portfolio data (either from global variable to bypass local file:// CORS restrictions, or fetch fallback)
  if (window.PORTFOLIO_DATA) {
    portfolioData = window.PORTFOLIO_DATA;
    initApp();
  } else {
    fetch('./portfolio.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        portfolioData = data;
        initApp();
      })
      .catch(error => {
        console.error('Failed to load portfolio data:', error);
        document.body.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; gap: 16px; background-color: #09090b; color: #fafafa;">
            <h2 style="color: #ef4444;">Error Loading Portfolio Database</h2>
            <p>${error.message}</p>
          </div>
        `;
      });
  }

  function initApp() {
    if (!portfolioData) return;

    // 1. Initialize SEO and Tab Title
    initSEO();

    // 2. Initialize Theme System
    initTheme();

    // 3. Render Navigation and Mobile Controls
    renderNavigation();

    // 4. Render All Body Sections
    renderHero();
    renderAbout();
    renderExperience();
    renderProjects();
    renderEducation();
    renderContact();
    renderFooter();

    // 5. Initialize Interactive Modals and Clipboard widgets
    initModal();
    initClipboard();
    initContactForm();

    // 6. Initialize Reveal Animations and Scroll Observers
    initObservers();
  }

  // --- 1. SEO & Tab Initialization ---
  function initSEO() {
    const seo = portfolioData.seo;
    if (!seo) return;

    // Set page title
    document.title = seo.title || 'Portfolio';

    // Set meta tags
    updateMetaTag('description', seo.description);
    if (seo.keywords) {
      updateMetaTag('keywords', seo.keywords.join(', '));
    }

    // OpenGraph
    updateMetaTag('og:title', seo.title, 'property');
    updateMetaTag('og:description', seo.description, 'property');
    if (seo.ogImage) {
      updateMetaTag('og:image', seo.ogImage, 'property');
    }
  }

  function updateMetaTag(name, content, attribute = 'name') {
    if (!content) return;
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  // --- 2. Theme Management ---
  function initTheme() {
    const config = portfolioData.config || {};
    const defaultTheme = config.defaultTheme || 'dark';
    
    // Check local storage or fallback to JSON default
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    
    if (savedTheme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }

    // Bind Toggle Button Click
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      // Inline SVGs for Sun and Moon
      themeBtn.innerHTML = `
        <svg class="sun-icon" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
        <svg class="moon-icon" viewBox="0 0 24 24"><path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.6-.1 1.2.3 1.3.9.1.6-.3 1.2-.9 1.3-3.6.7-6.2 3.9-6.2 7.6 0 4.4 3.6 8 8 8 3.7 0 6.9-2.6 7.6-6.2.1-.6.7-1 1.3-.9.6.1 1 .7.9 1.3-.9 4.7-5 8.2-9.8 8.2z"/></svg>
      `;

      themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('theme-light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      });
    }
  }

  // --- 3. Render Navigation ---
  function renderNavigation() {
    const navList = document.getElementById('nav-links-list');
    const mobileBtn = document.getElementById('mobile-nav-toggle');

    if (navList) {
      const sections = ['home', 'about', 'experience', 'projects', 'education', 'contact'];
      navList.innerHTML = sections.map(section => `
        <li>
          <a href="#${section}" class="nav-link">${section.charAt(0).toUpperCase() + section.slice(1)}</a>
        </li>
      `).join('');

      // Add smooth scrolling click handlers
      const links = navList.querySelectorAll('.nav-link');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            // Close mobile menu if active
            navList.classList.remove('active');
            
            // Scroll dynamically
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    if (mobileBtn && navList) {
      mobileBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
      });
    }
  }

  // --- 4. Render Body Sections ---

  // Dynamic Experience Calculator
  function calculateTotalExperience(startDateStr) {
    const start = new Date(startDateStr);
    const today = new Date();

    let diffMonths = (today.getFullYear() - start.getFullYear()) * 12;
    diffMonths -= start.getMonth();
    diffMonths += today.getMonth();

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    return {
      years,
      months,
      formatted: `${years}Y ${months}M`
    };
  }

  // Render Hero
  function renderHero() {
    const profile = portfolioData.profile;
    const heroSection = document.getElementById('home');
    if (!profile || !heroSection) return;

    const expData = calculateTotalExperience(profile.careerStartDate);

    heroSection.innerHTML = `
      <div class="hero-mesh">
        <div class="hero-glow"></div>
      </div>
      <div class="container hero-content animate-reveal">
        <div class="experience-badge">${expData.years} Years, ${expData.months} Months Experience</div>
        <h1 class="hero-title">I'm <span>${profile.name}</span></h1>
        <p class="hero-subtitle">${profile.subtitle}</p>
        <div class="hero-buttons">
          <a href="#contact" class="btn btn-primary">
            Get In Touch
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
          <a href="${profile.resumeUrl}" target="_blank" class="btn btn-secondary">
            Download CV
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </a>
        </div>
      </div>
    `;
  }

  // Render About & Skills
  function renderAbout() {
    const about = portfolioData.about;
    const aboutSection = document.getElementById('about');
    if (!about || !aboutSection) return;

    // Format Bio paragraphs
    const bioHTML = about.bio ? `<p>${about.bio.replace(/\n\n/g, '</p><p>')}</p>` : '';

    // Render Skills List
    const skillsHTML = about.skills.map(category => `
      <div class="skill-category">
        <h3 class="skill-category-title">
          <span>${category.category}</span>
        </h3>
        <div class="skill-tags">
          ${category.items.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // Render Languages
    const languagesHTML = about.languages ? `
      <div class="languages-box">
        <h3 class="languages-title">Languages</h3>
        ${about.languages.map(lang => `
          <div class="language-item">
            <div class="language-info">
              <span>${lang.name}</span>
              <span>${lang.level} (${lang.percentage}%)</span>
            </div>
            <div class="language-bar-bg">
              <div class="language-bar-fill" style="width: 0%" data-percent="${lang.percentage}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '';

    aboutSection.innerHTML = `
      <div class="container">
        <div class="section-header" data-reveal>
          <span class="section-tag">About Me</span>
          <h2 class="section-title">Background & Skillset</h2>
        </div>
        <div class="about-grid">
          <div class="about-bio" data-reveal>
            ${bioHTML}
            ${languagesHTML}
          </div>
          <div class="skills-wrapper" data-reveal>
            ${skillsHTML}
          </div>
        </div>
      </div>
    `;
  }

  // Render Experience Timeline
  function renderExperience() {
    const experiences = portfolioData.experience;
    const experienceSection = document.getElementById('experience');
    if (!experiences || !experienceSection) return;

    const timelineHTML = experiences.map(exp => {
      const companyLabel = exp.companyUrl 
        ? `<a href="${exp.companyUrl}" target="_blank">${exp.company}</a>`
        : exp.company;

      const techHTML = exp.technologies 
        ? `<div class="timeline-techs">
             ${exp.technologies.map(tech => `<span class="timeline-tech-pill">${tech}</span>`).join('')}
           </div>`
        : '';

      const highlightsHTML = exp.highlights 
        ? `<ul class="timeline-highlights">
             ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
           </ul>`
        : '';

      return `
        <div class="timeline-item" data-reveal>
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <div class="timeline-header">
              <h3 class="timeline-role">${exp.role} <span>@ ${exp.company}</span></h3>
              <span class="timeline-date">${exp.startDate} - ${exp.endDate}</span>
            </div>
            <div class="timeline-company-info">
              <span>${companyLabel}</span>
              <span>•</span>
              <span>${exp.location}</span>
              <span>•</span>
              <span>${exp.type}</span>
            </div>
            ${highlightsHTML}
            ${techHTML}
          </div>
        </div>
      `;
    }).join('');

    experienceSection.innerHTML = `
      <div class="container">
        <div class="section-header" data-reveal>
          <span class="section-tag">Career History</span>
          <h2 class="section-title">Work Experience</h2>
        </div>
        <div class="timeline">
          ${timelineHTML}
        </div>
      </div>
    `;
  }

  // Render Projects Grid and Bind Filters
  function renderProjects() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    projectsSection.innerHTML = `
      <div class="container">
        <div class="section-header" data-reveal>
          <span class="section-tag">My Work</span>
          <h2 class="section-title">Featured Projects</h2>
        </div>
        <div class="projects-filter" data-reveal>
          <button class="filter-btn active" data-filter="featured">Featured</button>
          <button class="filter-btn" data-filter="all">All Projects</button>
          <button class="filter-btn" data-filter="mobile">Mobile</button>
          <button class="filter-btn" data-filter="web">Web</button>
        </div>
        <div class="projects-grid" id="projects-grid-container" data-reveal></div>
      </div>
    `;

    // Perform initial render
    filterAndRenderProjects();

    // Bind Filter Click Events
    const filterBtns = projectsSection.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        filterAndRenderProjects();
      });
    });
  }

  function filterAndRenderProjects() {
    const gridContainer = document.getElementById('projects-grid-container');
    const projects = portfolioData.projects;
    if (!gridContainer || !projects) return;

    // Filter projects
    const filteredProjects = projects.filter(p => {
      if (activeFilter === 'featured') return p.featured;
      if (activeFilter === 'mobile') return p.category.toLowerCase() === 'mobile';
      if (activeFilter === 'web') return p.category.toLowerCase() === 'web';
      return true; // 'all'
    });

    if (filteredProjects.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-secondary);">
          <p>No projects found in this category.</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filteredProjects.map(proj => {
      const featuredBadge = proj.featured ? `<span class="project-featured-badge">Featured</span>` : '';
      const techTags = proj.technologies.slice(0, 3).map(tech => `<span class="project-card-tech">${tech}</span>`).join('');
      const plusMore = proj.technologies.length > 3 ? `<span class="project-card-tech">+${proj.technologies.length - 3}</span>` : '';

      // Git and Live Link icons inside card footer
      let githubLink = '';
      if (proj.githubUrl) {
        githubLink = `
          <a href="${proj.githubUrl}" target="_blank" class="project-icon-link" aria-label="GitHub Repository" data-stop-propagation>
            <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
          </a>
        `;
      }

      let liveLink = '';
      if (proj.liveUrl) {
        liveLink = `
          <a href="${proj.liveUrl}" target="_blank" class="project-icon-link" aria-label="Live Demo" data-stop-propagation>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        `;
      }

      return `
        <div class="project-card" data-id="${proj.id}">
          ${featuredBadge}
          <h3 class="project-card-title">${proj.title}</h3>
          <p class="project-card-description">${proj.shortDescription}</p>
          <div class="project-card-techs">
            ${techTags}
            ${plusMore}
          </div>
          <div class="project-card-footer">
            <span class="project-card-more">
              Details 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
            <div class="project-card-links">
              ${githubLink}
              ${liveLink}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind Details Trigger on Project Cards
    const cards = gridContainer.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent modal open when clicking child icon links directly
        if (e.target.closest('[data-stop-propagation]')) return;
        
        const projectId = card.getAttribute('data-id');
        openProjectModal(projectId);
      });
    });
  }

  // Render Education
  function renderEducation() {
    const education = portfolioData.education;
    const educationSection = document.getElementById('education');
    if (!education || !educationSection) return;

    const eduHTML = education.map(edu => `
      <div class="education-card" data-reveal>
        <h3 class="education-institution">${edu.institution}</h3>
        <p class="education-degree">${edu.degree}</p>
        <span class="education-duration">${edu.duration}</span>
        <p class="education-details">${edu.details}</p>
      </div>
    `).join('');

    educationSection.innerHTML = `
      <div class="container">
        <div class="section-header" data-reveal>
          <span class="section-tag">Learning Journey</span>
          <h2 class="section-title">Education</h2>
        </div>
        <div class="education-grid">
          ${eduHTML}
        </div>
      </div>
    `;
  }

  // Render Contact section
  function renderContact() {
    const profile = portfolioData.profile;
    const contactSection = document.getElementById('contact');
    if (!profile || !contactSection) return;

    // Social buttons grid
    const socialsHTML = profile.socials.map(social => {
      let iconSVG = '';
      if (social.icon === 'github') {
        iconSVG = `<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>`;
      } else if (social.icon === 'stack-overflow') {
        iconSVG = `<svg viewBox="0 0 24 24"><path d="M15.79 21.61a.61.61 0 0 1-.61.61H2.43a.61.61 0 0 1-.61-.61V11.23a.61.61 0 0 1 .61-.61H4.1a.61.61 0 0 1 .61.61v8.52h9.87v-8.52a.61.61 0 0 1 .61-.61h1.68a.61.61 0 0 1 .61.61v10.38zm-1.89-3.92H5.69v-1.68h8.21v1.68zm.27-3.96-8-1.78.36-1.64 8 1.78-.36 1.64zm.82-3.83-7.53-3.41.7-1.53 7.53 3.41-.7 1.53zm1.53-3.58-6.66-4.9 1-1.35 6.66 4.9-1 1.35zm2.38-2.6L12.7 1.05 13.9.22l6.23 2.77-1.2 1.06z"/></svg>`;
      } else if (social.icon === 'linkedin') {
        iconSVG = `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
      } else if (social.icon === 'hackerrank') {
        iconSVG = `<svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 0 0-4.4 23.2v-2.3c0-.6.4-.9.9-.9h7.1c.5 0 .9.3.9.9v2.3A12 12 0 0 0 12 0zm3.8 15.6V8.4c0-.5-.4-.9-.9-.9h-5.8c-.5 0-.9.4-.9.9v7.2c0 .5.4.9.9.9h5.8c.5 0 .9-.4.9-.9z"/></svg>`;
      } else {
        iconSVG = `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`;
      }

      return `
        <a href="${social.url}" target="_blank" class="social-button" aria-label="${social.platform}">
          ${iconSVG}
          <span>${social.platform}</span>
        </a>
      `;
    }).join('');

    contactSection.innerHTML = `
      <div class="container">
        <div class="section-header" data-reveal>
          <span class="section-tag">Connection Hub</span>
          <h2 class="section-title">Get In Touch</h2>
        </div>
        <div class="contact-container">
          <div class="contact-info" data-reveal>
            <p style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 8px;">
              I'm open to discussing new engineering projects, SAAS opportunities, custom architectures, or remote positions. Feel free to copy my contacts directly.
            </p>

            <div class="contact-method" id="copy-email-btn" data-clipboard="${profile.email}">
              <div class="copy-tooltip">Copied!</div>
              <div class="contact-icon-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div class="contact-details">
                <h4>Email Address</h4>
                <p>${profile.email}</p>
              </div>
            </div>

            <div class="contact-method" id="copy-phone-btn" data-clipboard="${profile.phone.replace(/\s/g, '')}">
              <div class="copy-tooltip">Copied!</div>
              <div class="contact-icon-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div class="contact-details">
                <h4>Phone Number</h4>
                <p>${profile.phone}</p>
              </div>
            </div>

            <div class="socials-grid">
              ${socialsHTML}
            </div>
          </div>

          <form class="contact-form" id="portfolio-contact-form" data-reveal>
            <div class="form-group">
              <label class="form-label" for="form-name">Your Name</label>
              <input class="form-input" type="text" id="form-name" placeholder="John Doe" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="form-email">Email Address</label>
              <input class="form-input" type="email" id="form-email" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="form-message">Message Details</label>
              <textarea class="form-input" id="form-message" placeholder="Hi Shamrat, let's talk about..." required></textarea>
            </div>
            <button class="btn btn-primary" type="submit" style="width: 100%; justify-content: center;">Send Secure Message</button>
          </form>
        </div>
      </div>
    `;
  }

  // Render Footer
  function renderFooter() {
    const profile = portfolioData.profile;
    const footerElement = document.getElementById('footer');
    if (!profile || !footerElement) return;

    const currentYear = new Date().getFullYear();

    footerElement.innerHTML = `
      <div class="container">
        <p>
          Copyright &copy; 2019 - ${currentYear}. Crafted with <span class="footer-love">&#10084;</span> by 
          <a href="https://github.com/shamrat1" target="_blank" style="font-weight: 600; color: var(--text-primary);">${profile.name}</a>. All rights reserved.
        </p>
        <div class="footer-links">
          <a href="#home">Home</a>
          <span>•</span>
          <a href="#projects">Projects</a>
          <span>•</span>
          <a href="${profile.resumeUrl}" target="_blank">Download Resume</a>
        </div>
      </div>
    `;
  }

  // --- 5. Interactive Systems ---

  // Project Modal Actions
  function initModal() {
    const overlay = document.getElementById('project-modal');
    if (!overlay) return;

    // Inside close triggers
    const closeBtn = overlay.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
      closeProjectModal();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeProjectModal();
      }
    });

    // ESC close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }

  function openProjectModal(projectId) {
    const overlay = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-dynamic-content');
    const modalTitle = document.getElementById('modal-title-text');
    if (!overlay || !modalContent || !portfolioData) return;

    const project = portfolioData.projects.find(p => p.id === projectId);
    if (!project) return;

    modalTitle.textContent = project.title;

    const badgeFeatured = project.featured ? `<span class="project-featured-badge">Featured</span>` : '';
    const badgeCategory = `<span class="project-featured-badge" style="background: var(--bg-color); border-color: var(--border-color); color: var(--text-secondary);">${project.category}</span>`;

    // Long vs Short description
    const descriptionText = project.longDescription || project.shortDescription;

    // Tech pills
    const techPillsHTML = project.technologies.map(tech => `
      <span class="modal-tech-pill">${tech}</span>
    `).join('');

    // Repository / Live link buttons
    let linksHTML = '';
    if (project.githubUrl) {
      linksHTML += `
        <a href="${project.githubUrl}" target="_blank" class="modal-link-btn">
          <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
          Explore Source Code
        </a>
      `;
    }

    if (project.liveUrl) {
      linksHTML += `
        <a href="${project.liveUrl}" target="_blank" class="modal-link-btn" style="background: var(--accent-color); color: #fff; border-color: var(--accent-color);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Visit Live Release
        </a>
      `;
    }

    modalContent.innerHTML = `
      <div class="modal-badges">
        ${badgeFeatured}
        ${badgeCategory}
      </div>
      <p class="modal-long-description">${descriptionText}</p>
      
      <h4 class="modal-section-title">Core Technology Stack</h4>
      <div class="modal-tech-stack">
        ${techPillsHTML}
      </div>

      ${linksHTML ? `<h4 class="modal-section-title" style="margin-top: 16px;">Project Deployments</h4><div class="modal-links-grid">${linksHTML}</div>` : ''}
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    const overlay = document.getElementById('project-modal');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Clipboard copies
  function initClipboard() {
    const copyBtns = document.querySelectorAll('[data-clipboard]');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-clipboard');
        navigator.clipboard.writeText(text).then(() => {
          const tooltip = btn.querySelector('.copy-tooltip');
          if (tooltip) {
            tooltip.classList.add('active');
            setTimeout(() => {
              tooltip.classList.remove('active');
            }, 2000);
          }
        }).catch(err => {
          console.error('Failed to copy to clipboard:', err);
        });
      });
    });
  }

  // Contact Form Submission (Mock handling with clean layout notifications)
  function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      // Clean success notification on overlay
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting Message...';

      setTimeout(() => {
        submitBtn.style.background = '#10b981';
        submitBtn.style.borderColor = '#10b981';
        submitBtn.textContent = 'Message Received Successfully!';

        // Reset
        form.reset();

        setTimeout(() => {
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 3000);
      }, 1500);
    });
  }

  // --- 6. Scroll Observers and Animations ---
  function initObservers() {
    // Reveal Observer
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // If about section enters, trigger language bar width animations
          if (entry.target.id === 'about' || entry.target.closest('#about')) {
            animateLanguageBars();
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Section Observer for Nav Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeNavObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-72px 0px 0px 0px' // Adjust for sticky header height
    });

    sections.forEach(s => activeNavObserver.observe(s));
  }

  function animateLanguageBars() {
    const bars = document.querySelectorAll('.language-bar-fill');
    bars.forEach(bar => {
      const targetPercent = bar.getAttribute('data-percent');
      setTimeout(() => {
        bar.style.width = targetPercent;
      }, 150);
    });
  }
});
