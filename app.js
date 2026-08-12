// Shared frontend behavior for Red Astrum.
(() => {
    "use strict";
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    function ensureSocialMetadata() {
        const title = document.title.trim();
        const description = document.querySelector('meta[name="description"]')?.content?.trim() || "Red Astrum: educación integral, liderazgo juvenil y comunidades que transforman.";
        const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href.split("?")[0].split("#")[0];
        const ensureMeta = (selector, attrs) => {
            if (document.head.querySelector(selector)) return;
            const meta = document.createElement("meta"); Object.entries(attrs).forEach(([key, value]) => meta.setAttribute(key, value)); document.head.appendChild(meta);
        };
        ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
        ensureMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Red Astrum" });
        ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
        ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
        ensureMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
        ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
        ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
        ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    }

    function optimizeMedia() {
        document.querySelectorAll("img").forEach(img => {
            img.decoding ||= "async";
            const isPriorityImage = img.matches("#ongLogo") || img.closest("header,.hero,.ga-hero,.ong-portal-header");
            if (!isPriorityImage && !img.hasAttribute("loading")) img.loading = "lazy";
        });
        document.querySelectorAll("iframe").forEach(frame => {
            frame.loading ||= "lazy";
            if (!frame.hasAttribute("referrerpolicy")) frame.referrerPolicy = "strict-origin-when-cross-origin";
            if (!frame.hasAttribute("title")) frame.title = "Contenido integrado de Red Astrum";
        });
        const decorativeVideos = document.querySelectorAll(".back-vid,.blackhole-box video");
        decorativeVideos.forEach(video => {
            video.preload = "none";
            if (video.dataset.src && !video.src) video.src = video.dataset.src;

            if (reducedMotion) {
                video.pause?.();
                video.removeAttribute("autoplay");
            } else {
                video.play?.()?.catch(() => {});
            }
        });
    }

    function setupLazyVideos() {
        const videos = document.querySelectorAll("video[data-lazy-video][data-src]");
        if (!videos.length) return;

        const loadVideo = video => {
            if (!video.src) video.src = video.dataset.src;
            video.play?.()?.catch(() => {});
        };

        if (!("IntersectionObserver" in window)) {
            videos.forEach(loadVideo);
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                loadVideo(entry.target);
                observer.unobserve(entry.target);
            });
        }, { rootMargin: "320px 0px" });

        videos.forEach(video => observer.observe(video));
    }

    function linkTargets(link, pathname, hash = "") {
        const rawHref = link?.getAttribute("href");
        if (!rawHref) return false;
        try {
            const url = new URL(rawHref, window.location.origin);
            const normalizedPath = url.pathname.replace(/\/+$/, "") || "/";
            return url.origin === window.location.origin
                && normalizedPath === pathname
                && (!hash || url.hash === hash);
        } catch {
            return false;
        }
    }

    function findTopLevelMenuItem(menu, pathname, hash = "") {
        return Array.from(menu?.children || []).find(item => {
            return linkTargets(item.querySelector(":scope > a[href]"), pathname, hash);
        });
    }

    function addProgramsMenu() {
        const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
        const isGastrum = normalizedPath === "/g-astrum";
        const isPicnic = normalizedPath === "/picnic-astrum";
        const isProgramPage = isGastrum || isPicnic;
        [document.querySelector("ul.main"), document.querySelector(".sidebar > ul")].forEach(menu => {
            Array.from(menu?.children || []).forEach(item => {
                const link = item.querySelector(":scope > a[href]");
                if (linkTargets(link, "/g-astrum") || linkTargets(link, "/picnic-astrum")) item.remove();
            });
        });

        const desktopMenu = document.querySelector("ul.main");
        if (desktopMenu && !desktopMenu.querySelector('[data-menu="programs"]')) {
            const item = document.createElement("li");
            item.className = "nav-dropdown";
            item.dataset.menu = "programs";
            item.innerHTML = `<a href="#programs-menu" aria-haspopup="true" aria-expanded="false"${isProgramPage ? ' aria-current="page"' : ""}>Programas <i class="bx bx-chevron-down" aria-hidden="true"></i></a><ul id="programs-menu" aria-label="Programas de Red Astrum"><li><a href="/g-astrum"${isGastrum ? ' aria-current="page"' : ""}>G-Astrum</a></li><li><a href="/picnic-astrum"${isPicnic ? ' aria-current="page"' : ""}>Picnic Astrum</a></li></ul>`;
            const ngos = findTopLevelMenuItem(desktopMenu, "/ongs");
            const join = Array.from(desktopMenu.children).find(el => el.querySelector(':scope > a[href*="linktr.ee/red_astrum"]'));
            if (ngos) ngos.after(item); else desktopMenu.insertBefore(item, join || null);

            const trigger = item.querySelector(":scope > a");
            const setOpen = open => {
                item.classList.toggle("open", open);
                trigger?.setAttribute("aria-expanded", String(open));
            };
            trigger?.addEventListener("click", event => {
                event.preventDefault();
                setOpen(!item.classList.contains("open"));
            });
            item.addEventListener("keydown", event => {
                if (event.key === "Escape") {
                    setOpen(false);
                    trigger?.focus();
                }
            });
            document.addEventListener("click", event => {
                if (!item.contains(event.target)) setOpen(false);
            });
        }

        const mobileMenu = document.querySelector(".sidebar > ul");
        if (mobileMenu && !mobileMenu.querySelector('[data-menu="programs-mobile"]')) {
            const item = document.createElement("li");
            item.className = "sidebar-services";
            item.dataset.menu = "programs-mobile";
            item.innerHTML = `<details${isProgramPage ? " open" : ""}><summary><span>Programas</span><i class="bx bx-chevron-down" aria-hidden="true"></i></summary><ul aria-label="Programas de Red Astrum"><li><a href="/g-astrum"${isGastrum ? ' aria-current="page"' : ""}>G-Astrum</a></li><li><a href="/picnic-astrum"${isPicnic ? ' aria-current="page"' : ""}>Picnic Astrum</a></li></ul></details>`;
            const ngos = findTopLevelMenuItem(mobileMenu, "/ongs");
            const join = Array.from(mobileMenu.children).find(el => el.querySelector(':scope > a[href*="linktr.ee/red_astrum"]'));
            if (ngos) ngos.after(item); else mobileMenu.insertBefore(item, join || null);
        }
    }

    if (window.location.protocol !== "file:") {
        let cleanPath = window.location.pathname;
        if (cleanPath.endsWith("/index.html")) cleanPath = cleanPath.slice(0, -"/index.html".length) || "/";
        else if (cleanPath.endsWith(".html")) cleanPath = cleanPath.slice(0, -".html".length) || "/";
        if (cleanPath.length > 1 && cleanPath.endsWith("/")) cleanPath = cleanPath.slice(0, -1);
        if (cleanPath !== window.location.pathname) window.history.replaceState(window.history.state, "", `${cleanPath}${window.location.search}${window.location.hash}`);
    }

    function addServicesMenu() {
        const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/"; const isAstrumCertificaPage = normalizedPath === "/verificar";
        document.querySelectorAll('ul.main > li > a[href="/verificar/"],ul.main > li > a[href="/verificar"],.sidebar > ul > li > a[href="/verificar/"],.sidebar > ul > li > a[href="/verificar"]').forEach(link => link.closest("li")?.remove());
        const desktopMenu = document.querySelector("ul.main");
        if (desktopMenu && !desktopMenu.querySelector('[data-menu="services"]')) {
            const item = document.createElement("li"); item.className = "nav-dropdown"; item.dataset.menu = "services";
            item.innerHTML = `<a href="#services-menu" aria-haspopup="true" aria-expanded="false">Servicios <i class="bx bx-chevron-down" aria-hidden="true"></i></a><ul id="services-menu" aria-label="Servicios de Red Astrum"><li><a href="/verificar/">Astrum Certifica</a></li></ul>`;
            const trigger = item.querySelector(":scope > a"); const serviceLink = item.querySelector('a[href="/verificar/"]'); if (isAstrumCertificaPage) { trigger?.setAttribute("aria-current", "page"); serviceLink?.setAttribute("aria-current", "page"); }
            const contact = Array.from(desktopMenu.children).find(el => {
                const link = el.querySelector(":scope > a[href]");
                if (!link) return false;
                try { return new URL(link.getAttribute("href"), window.location.origin).hash === "#contacto"; }
                catch { return false; }
            }); desktopMenu.insertBefore(item, contact || null);
            const setOpen = open => { item.classList.toggle("open", open); trigger?.setAttribute("aria-expanded", String(open)); };
            trigger?.addEventListener("click", event => { event.preventDefault(); setOpen(!item.classList.contains("open")); }); item.addEventListener("keydown", event => { if (event.key === "Escape") { setOpen(false); trigger?.focus(); } }); document.addEventListener("click", event => { if (!item.contains(event.target)) setOpen(false); });
        }
        const mobileMenu = document.querySelector(".sidebar > ul");
        if (mobileMenu && !mobileMenu.querySelector('[data-menu="services-mobile"]')) {
            const item = document.createElement("li"); item.className = "sidebar-services"; item.dataset.menu = "services-mobile"; item.innerHTML = `<details${isAstrumCertificaPage ? " open" : ""}><summary><span>Servicios</span><i class="bx bx-chevron-down" aria-hidden="true"></i></summary><ul aria-label="Servicios de Red Astrum"><li><a href="/verificar/"${isAstrumCertificaPage ? ' aria-current="page"' : ""}>Astrum Certifica</a></li></ul></details>`;
            const contact = Array.from(mobileMenu.children).find(el => {
                const link = el.querySelector(":scope > a[href]");
                if (!link) return false;
                try { return new URL(link.getAttribute("href"), window.location.origin).hash === "#contacto"; }
                catch { return false; }
            }); mobileMenu.insertBefore(item, contact || null);
        }
    }

    function setupMobileMenu() {
        const sidebar = document.querySelector(".sidebar"); const menuButton = document.querySelector(".menu-icon"); const closeButton = document.querySelector(".close-icon"); if (!sidebar || !menuButton) return;
        const backdrop = document.createElement("button"); backdrop.type = "button"; backdrop.className = "menu-backdrop"; backdrop.setAttribute("aria-label", "Cerrar menú"); backdrop.hidden = true; sidebar.before(backdrop);
        const setState = (open, restoreFocus = true) => { sidebar.classList.toggle("open-sidebar", open); sidebar.classList.toggle("close-sidebar", !open); menuButton.setAttribute("aria-expanded", String(open)); sidebar.setAttribute("aria-hidden", String(!open)); sidebar.inert = !open; document.body.classList.toggle("menu-open", open); backdrop.hidden = !open; if (open) sidebar.querySelector("a,button,summary")?.focus(); else if (restoreFocus) menuButton.focus(); };
        menuButton.addEventListener("click", () => setState(!sidebar.classList.contains("open-sidebar"))); closeButton?.addEventListener("click", () => setState(false)); backdrop.addEventListener("click", () => setState(false)); sidebar.addEventListener("click", event => { if (event.target.closest("a")) setState(false, false); }); document.addEventListener("keydown", event => { if (event.key === "Escape" && sidebar.classList.contains("open-sidebar")) setState(false); }); window.addEventListener("resize", () => { if (window.innerWidth > 1024 && sidebar.classList.contains("open-sidebar")) setState(false, false); }, { passive: true });
    }

    function setupCounters() {
        const container = document.querySelector(".counters"); if (!container) return; const counters = container.querySelectorAll("span[data-count]"); if (!counters.length) return;
        const renderFinal = () => counters.forEach(counter => { counter.textContent = counter.dataset.count || "0"; }); if (reducedMotion || !("IntersectionObserver" in window)) { renderFinal(); return; }
        let activated = false; const observer = new IntersectionObserver(entries => { if (activated || !entries.some(entry => entry.isIntersecting)) return; activated = true; counters.forEach(counter => { const target = Number.parseInt(counter.dataset.count || "0", 10); let current = 0; const step = Math.max(1, Math.ceil(target / 70)); const tick = () => { current = Math.min(target, current + step); counter.textContent = String(current); if (current < target) requestAnimationFrame(tick); }; tick(); }); observer.disconnect(); }, { threshold: .25, rootMargin: "0px 0px -10% 0px" }); observer.observe(container);
    }

    function setupReveal() {
        const targets = document.querySelectorAll(".autoBlur,.autoDisplay,.fadein-left"); if (!targets.length) return; if (reducedMotion || !("IntersectionObserver" in window)) { targets.forEach(el => el.classList.add("in-view")); return; }
        const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); } }); }, { threshold: .15, rootMargin: "0px 0px -8% 0px" }); targets.forEach(el => observer.observe(el));
    }

    function synchronizePublicNgoState() {
        const OFFICIAL_NGO_COUNT = 14; const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/"; const requestedOng = new URLSearchParams(window.location.search).get("id"); if (normalizedPath === "/ong" && requestedOng === "maywa") { window.location.replace("/ongs"); return; }
        if (typeof window.ONGS !== "undefined" && Array.isArray(window.ONGS)) { const index = window.ONGS.findIndex(org => org.id === "maywa"); if (index >= 0) window.ONGS.splice(index, 1); }
        document.querySelectorAll(".counter").forEach(counter => { if (counter.querySelector("h3")?.textContent.trim() === "ONGs de Red Astrum") { const value = counter.querySelector("span[data-count]"); if (value) value.dataset.count = String(OFFICIAL_NGO_COUNT); } });
        const maywaItem = document.querySelector('.astrum-carousel img[src*="maywa.webp"]')?.closest(".astrum-carousel-item"); if (maywaItem) { const list = maywaItem.parentElement; maywaItem.remove(); const items = Array.from(list?.querySelectorAll(".astrum-carousel-item") || []); items.forEach((item, index) => item.style.setProperty("--position", String(index + 1))); list?.closest(".astrum-carousel")?.style.setProperty("--quantity", String(items.length)); }
        if (typeof window.renderOrganizations === "function") window.renderOrganizations(document.getElementById("ongSearch")?.value || "");
    }

    function ensureInstitutionalFooter() {
        const path = window.location.pathname.replace(/\/+$/, "") || "/";
        if (!['/ongs', '/g-astrum'].includes(path)) return;

        let footer = document.querySelector('.footer');
        if (!footer) {
            footer = document.createElement('section');
            footer.className = 'footer';
            document.querySelector('.container')?.appendChild(footer);
        }

        if (path === '/g-astrum') footer.classList.add('ga-footer');

        footer.innerHTML = `
            <div class="footer-text">
                <h1>© 2026 Red Astrum. Todos los derechos reservados.</h1>
                <p>RUC: 20615815005</p>
            </div>
            <div class="box-icons">
                <a href="https://www.facebook.com/share/18Cic6fYTM/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i class="bx bxl-facebook-circle" aria-hidden="true"></i>
                </a>
                <a href="https://www.instagram.com/red_astrum?igsh=cGxwdHd5OWY2c2w1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i class="bx bxl-instagram" aria-hidden="true"></i>
                </a>
                <a href="https://www.linkedin.com/company/red-astrum?trk=blended-typeahead" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <i class="bx bxl-linkedin-square" aria-hidden="true"></i>
                </a>
            </div>`;
    }

    ensureSocialMetadata(); optimizeMedia(); setupLazyVideos(); addProgramsMenu(); addServicesMenu(); setupMobileMenu(); synchronizePublicNgoState(); setupCounters(); setupReveal(); ensureInstitutionalFooter();
})();
