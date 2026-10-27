/**
 * ADITYA PATIL (Aadi.dev) - PORTFOLIO INTERACTION ENGINE
 * Theme: Editorial Luxury Cream & Alabaster
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAmbientCanvas();
  initCursorGlow();
  initQuantStudio();
  initEmailCopy();
  initISTClock();
  initContactForm();
  initResumeModal();
});

/* ===================================================================
   1. NAVBAR & ACTIVE NAVIGATION SPY
   =================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Spy
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile menu toggle
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }
}

/* ===================================================================
   2. AMBIENT PARTICLES (WARM GOLDEN BRONZE NODES)
   =================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numParticles = Math.min(Math.floor(window.innerWidth / 28), 45);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 140, 72, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const lineAlpha = (1 - dist / 130) * 0.18;
          ctx.strokeStyle = `rgba(180, 140, 72, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   3. CURSOR GLOW (SMOOTH LERP)
   =================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.innerWidth < 992) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   4. REAL PROJECT SCREENSHOT SWITCHER
   =================================================================== */
window.switchProjectImage = function(imgId, newSrc, btnElement) {
  const img = document.getElementById(imgId);
  if (!img) return;

  // Visual fade transition
  img.style.opacity = '0.3';
  img.style.transform = 'scale(0.98)';
  img.style.transition = 'all 0.25s ease';

  setTimeout(() => {
    img.src = newSrc;
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }, 180);

  // Update active state in parent buttons
  if (btnElement && btnElement.parentElement) {
    const siblingButtons = btnElement.parentElement.querySelectorAll('.secondary-thumb-btn');
    siblingButtons.forEach((b) => b.classList.remove('active'));
    btnElement.classList.add('active');
  }
};

/* ===================================================================
   5. QUANT ALPHA STUDIO (FASTEXPR SIMULATOR)
   =================================================================== */
function initQuantStudio() {
  const tabs = document.querySelectorAll('.formula-btn');
  const codeBox = document.getElementById('formula-code-display');
  const sharpeVal = document.getElementById('sharpe-val');
  const sharpeBar = document.getElementById('sharpe-bar');
  const fitnessVal = document.getElementById('fitness-val');
  const fitnessBar = document.getElementById('fitness-bar');
  const turnoverVal = document.getElementById('turnover-val');
  const turnoverBar = document.getElementById('turnover-bar');
  const drawdownVal = document.getElementById('drawdown-val');

  if (!tabs.length || !codeBox) return;

  const formulas = {
    '1': {
      code: `<span class="token-comment">// Alpha 01: Multi-day price delta decay neutralized against volume correlation</span><br>` +
            `<span class="token-func">rank</span>(<span class="token-func">ts_decay_linear</span>(<span class="token-func">delta</span>(<span class="token-var">close</span>, <span class="token-num">5</span>), <span class="token-num">10</span>)) - <span class="token-func">rank</span>(<span class="token-func">correlation</span>(<span class="token-var">vwap</span>, <span class="token-var">volume</span>, <span class="token-num">15</span>))`,
      sharpe: '2.44',
      sharpePct: '84%',
      fitness: '1.96',
      fitnessPct: '78%',
      turnover: '11.8%',
      turnoverPct: '25%',
      drawdown: '-4.12%'
    },
    '2': {
      code: `<span class="token-comment">// Alpha 02: Cross-sectional volatility mean-reversion with volume rank weighting</span><br>` +
            `-1 * <span class="token-func">rank</span>(<span class="token-func">delta</span>(<span class="token-var">close</span>, <span class="token-num">3</span>) / <span class="token-func">ts_std_dev</span>(<span class="token-var">close</span>, <span class="token-num">20</span>)) * <span class="token-func">ts_rank</span>(<span class="token-var">volume</span>, <span class="token-num">10</span>)`,
      sharpe: '2.18',
      sharpePct: '74%',
      fitness: '1.82',
      fitnessPct: '71%',
      turnover: '16.4%',
      turnoverPct: '36%',
      drawdown: '-5.04%'
    },
    '3': {
      code: `<span class="token-comment">// Alpha 03: Volume-weighted price spread arbitrage normalized by 20-day ADV</span><br>` +
            `<span class="token-func">rank</span>(<span class="token-func">ts_decay_linear</span>(<span class="token-var">vwap</span> - <span class="token-var">close</span>, <span class="token-num">8</span>)) * <span class="token-func">rank</span>(<span class="token-func">ts_sum</span>(<span class="token-var">volume</span>, <span class="token-num">5</span>) / <span class="token-var">adv20</span>)`,
      sharpe: '2.35',
      sharpePct: '80%',
      fitness: '1.89',
      fitnessPct: '74%',
      turnover: '13.2%',
      turnoverPct: '29%',
      drawdown: '-4.45%'
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-formula');
      if (!formulas[id]) return;

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const data = formulas[id];
      codeBox.innerHTML = data.code;
      sharpeVal.textContent = data.sharpe;
      sharpeBar.style.width = data.sharpePct;
      fitnessVal.textContent = data.fitness;
      fitnessBar.style.width = data.fitnessPct;
      turnoverVal.textContent = data.turnover;
      turnoverBar.style.width = data.turnoverPct;
      drawdownVal.textContent = data.drawdown;
    });
  });
}

/* ===================================================================
   6. EMAIL COPY & TOAST NOTIFICATION
   =================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-badge');
  const toastText = document.getElementById('toast-text');

  if (!copyBtn || !toast) return;

  const email = 'adityarajeshpatil08@gmail.com';

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard: ' + email);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('Email copied to clipboard: ' + email);
    }
  });

  window.showToast = function(msg) {
    if (toastText) toastText.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  };
}

/* ===================================================================
   7. LIVE PUNE (IST) CLOCK
   =================================================================== */
function initISTClock() {
  const clockEl = document.getElementById('live-ist-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Format to Indian Standard Time (Asia/Kolkata)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockEl.textContent = `${timeStr} IST`;
  }

  update();
  setInterval(update, 1000);
}

/* ===================================================================
   8. CONTACT FORM SIMULATION & VALIDATION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback-msg');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill out all required fields.';
      feedback.classList.add('show');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending transmission...`;

    setTimeout(() => {
      feedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your message has been prepared. Opening your direct email client...`;
      feedback.classList.add('show');

      // Create mailto link as direct route
      const mailtoLink = `mailto:adityarajeshpatil08@gmail.com?subject=${encodeURIComponent(
        `[Portfolio] ${subject}`
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;

      window.location.href = mailtoLink;

      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        Message Sent
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      if (window.showToast) {
        window.showToast('Message dispatched to Aditya Patil!');
      }

      form.reset();
    }, 600);
  });
}

/* ===================================================================
   9. RESUME MODAL
   =================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('open-resume-btn');
  const mobileOpenBtn = document.getElementById('mobile-resume-btn');
  const closeBtn = document.getElementById('close-resume-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close with Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
