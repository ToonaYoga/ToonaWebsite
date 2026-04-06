/**
 * Toona Site Components
 * Auto-detects language from URL and injects nav + footer
 */

(function () {
  const isZh = location.pathname.startsWith('/zh/') || location.pathname === '/zh';
  const lang = isZh ? 'zh' : 'en';

  const t = {
    en: {
      appName:   'Toona: Breathing & Focus',
      about:     'About',
      blog:      'Dev Log',
      support:   'Support',
      download:  'Download',
      langLabel: 'EN',
      privacy:   'Privacy Policy',
      terms:     'Terms of Use',
      helpCenter:'Help Center',
      product:   'Product',
      language:  'Language',
      tagline:   'Breathe better, live calmer.<br>A breathing training app for everyone.',
      copyright: '© 2026 Toona. All rights reserved.',
      privacyShort: 'Privacy',
      termsShort:   'Terms',
      // paths
      home:        '/',
      aboutPath:   '/about/',
      blogPath:    '/devlog/',
      supportPath: '/support/',
      downloadPath:'/download/',
      zhPath:      '/zh/',
      privacyLink: '/privacy/en/PrivacyPolicy.html',
      termsLink:   '/terms/en/TermsOfUse.html',
      supportLink: '/support/',
    },
    zh: {
      appName:   '吐纳: 呼吸 & 专注',
      about:     '关于',
      blog:      '开发日志',
      support:   '支持',
      download:  '下载',
      langLabel: '中文',
      privacy:   '隐私政策',
      terms:     '使用条款',
      helpCenter:'帮助中心',
      product:   '产品',
      language:  '语言',
      tagline:   '呼吸更好，生活更平静。<br>专为每个人设计的呼吸训练应用。',
      copyright: '© 2026 吐纳. 保留所有权利。',
      privacyShort: '隐私政策',
      termsShort:   '使用条款',
      // paths
      home:        '/zh/',
      aboutPath:   '/zh/about/',
      blogPath:    '/zh/devlog/',
      supportPath: '/zh/support/',
      downloadPath:'/zh/download/',
      zhPath:      '/',
      privacyLink: '/privacy/zh/PrivacyPolicy.html',
      termsLink:   '/terms/zh/TermsOfUse.html',
      supportLink: '/zh/support/',
    }
  };

  const s = t[lang];

  // Active link detection
  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path) ? 'style="color:var(--color-primary);"' : '';
  }

  // ─── NAV ────────────────────────────────────────────
  const navHTML = `
<nav class="nav">
  <div class="container nav-inner">
    <a href="${s.home}" class="nav-logo">
      <img src="/assets/images/icons/logo.webp" alt="${s.appName} logo" width="32" height="32" style="border-radius:8px;">
      ${s.appName}
    </a>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      <li><a href="${s.aboutPath}" ${isActive(s.aboutPath)}>${s.about}</a></li>
      <li><a href="${s.blogPath}" ${isActive(s.blogPath)}>${s.blog}</a></li>
      <li><a href="${s.supportPath}" ${isActive(s.supportPath)}>${s.support}</a></li>
      <li class="lang-switcher">
        <span class="lang-btn">${s.langLabel}</span>
        <div class="lang-dropdown">
          <a href="${isZh ? '/' + location.pathname.replace('/zh/', '') : '/zh' + location.pathname}" ${!isZh ? 'class="active"' : ''}>English</a>
          <a href="${isZh ? location.pathname : '/zh' + location.pathname}" ${isZh ? 'class="active"' : ''}>中文</a>
        </div>
      </li>
      <li><a href="${s.downloadPath}" class="btn btn-primary" style="padding:0.5rem 1.25rem;">${s.download}</a></li>
    </ul>
  </div>
</nav>`;

  // ─── FOOTER ─────────────────────────────────────────
  const footerHTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="${s.home}" class="nav-logo" style="color:white;">
          <img src="/assets/images/icons/logo.webp" alt="${s.appName}" width="28" height="28" style="border-radius:7px;">
          ${s.appName}
        </a>
        <p>${s.tagline}</p>
      </div>
      <div class="footer-col">
        <h4>${s.product}</h4>
        <a href="${s.aboutPath}">${s.about}</a>
        <a href="${s.downloadPath}">${s.download}</a>
        <a href="${s.blogPath}">${s.blog}</a>
      </div>
      <div class="footer-col">
        <h4>${s.support}</h4>
        <a href="${s.privacyLink}">${s.privacy}</a>
        <a href="${s.termsLink}">${s.terms}</a>
      </div>
      <div class="footer-col">
        <h4>${s.language}</h4>
        <a href="/">English</a>
        <a href="/zh/">中文</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${s.copyright}</span>
      <span>
        <a href="${s.privacyLink}" style="color:inherit;">${s.privacyShort}</a> ·
        <a href="${s.termsLink}" style="color:inherit;">${s.termsShort}</a>
      </span>
    </div>
  </div>
</footer>`;

  // ─── INJECT ──────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // ─── LANG SWITCHER ───────────────────────────────────
  const switcher = document.querySelector('.lang-switcher');
  if (switcher) {
    switcher.addEventListener('click', e => { e.stopPropagation(); switcher.classList.toggle('open'); });
    document.addEventListener('click', () => switcher.classList.remove('open'));
  }

  // ─── HAMBURGER ───────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
    document.addEventListener('click', () => navLinks.classList.remove('open'));
  }
})();
