// Presentation only: institutional content, filters, tabs and service flows remain owned by their page.
(() => {
    'use strict';
    const body = document.body;
    if (!body.classList.contains('ra-inner')) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => body.classList.toggle('ra-inner-motion', !preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    const hero = document.querySelector('.about-hero,.team-hero,.ong-list-hero,.ong-portal-header,.ga-hero-copy,.ra-program-hero,.blog-heading,.article-heading,.campaign-heading,.astro-login-copy');
    if (hero) {
        hero.classList.add('ra-inner-hero');
        const orbit = document.createElement('div');
        orbit.className = 'inner-orbit-art';
        orbit.setAttribute('aria-hidden', 'true');
        orbit.append(document.createElement('span'), document.createElement('span'));
        hero.prepend(orbit);
    }
    if (!('IntersectionObserver' in window)) return;
    const selector = '.about-block,.video-section,.member-card,.ong-tile,.ong-info-card,.ong-project-card,.ga-purpose-grid article,.ga-club-card,.ga-leader-grid article,.ga-cta,.journey-card,.picnic-pillars article,.voices-grid blockquote,.audience-cards article,.blog-feature,.astro-service-card,.astro-story,.campaign-people-grid article';
    const seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            if (!preference.matches) {
                const element = entry.target;
                element.classList.add('inner-section-enter');
                const finish = event => {
                    if (event.target !== element) return;
                    element.classList.remove('inner-section-enter');
                    element.removeEventListener('animationend', finish);
                };
                element.addEventListener('animationend', finish);
            }
            observer.unobserve(entry.target);
        });
    }, { threshold: .08 });
    const register = element => {
        if (seen.has(element)) return;
        seen.add(element);
        const siblings = Array.from(element.parentElement?.children || []);
        element.style.setProperty('--inner-delay', `${Math.max(0, siblings.indexOf(element) % 3) * 70}ms`);
        observer.observe(element);
    };
    document.querySelectorAll(selector).forEach(register);
    const mutations = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            if (node.matches(selector)) register(node);
            node.querySelectorAll(selector).forEach(register);
        }));
    });
    document.querySelectorAll('.team-grid,.ong-mosaic,.ong-project-grid,.astro-service-grid').forEach(grid => mutations.observe(grid, { childList: true, subtree: true }));
    const pause = () => body.classList.toggle('inner-motion-paused', document.hidden);
    document.addEventListener('visibilitychange', pause);
    pause();
})();
