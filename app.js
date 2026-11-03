// Shared frontend behavior for Red Astrum.
(() => {
    "use strict";
    [document.querySelector("ul.main"), document.querySelector(".sidebar > ul")].forEach(menu => {
        if (!menu || menu.querySelector('a[href="/blog/"]')) return;
        const item = document.createElement("li");
        item.innerHTML = '<a href="/blog/">Blog</a>';
        const contact = Array.from(menu.children).find(li => li.querySelector('a[href*="#contacto"]'));
        menu.insertBefore(item, contact || null);
        if (location.pathname.startsWith("/blog")) item.firstElementChild.setAttribute("aria-current", "page");
    });
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
        if (!videos.length || reducedMotion) return;

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
        const isEventPage = ["/eventos", "/picnic-astrum"].includes(normalizedPath);
        const programs = [{path:"/apla",name:"APLA"},{path:"/astrum-clubes",name:"Astrum Clubes"},{path:"/astrum-conecta",name:"Astrum Conecta"},{path:"/astrum-becas",name:"Astrum Becas"}];
        const isProgramPage = programs.some(program => program.path === normalizedPath);
        const programLinks = programs.map(program => `<li><a href="${program.path}"${normalizedPath === program.path ? ' aria-current="page"' : ""}>${program.name}</a></li>`).join("");
        [document.querySelector("ul.main"), document.querySelector(".sidebar > ul")].forEach(menu => {
            Array.from(menu?.children || []).forEach(item => {
                const link = item.querySelector(":scope > a[href]");
                if (programs.some(program => linkTargets(link, program.path))) item.remove();
            });
        });

        [document.querySelector("ul.main"), document.querySelector(".sidebar > ul")].forEach(menu => {
            Array.from(menu?.children || []).forEach(item => {
                if (linkTargets(item.querySelector(":scope > a[href]"), "/picnic-astrum")) item.remove();
            });
            if (!menu || menu.querySelector('[data-menu="events"]')) return;
            const eventItem = document.createElement("li");
            eventItem.dataset.menu = "events";
            const eventLinks = `<li><a href="/picnic-astrum"${normalizedPath === "/picnic-astrum" ? ' aria-current="page"' : ""}>Picnic Astrum</a></li>`;
            if (menu.matches("ul.main")) {
                eventItem.className = "nav-dropdown";
                eventItem.innerHTML = `<a href="#events-menu" aria-haspopup="true" aria-expanded="false"${isEventPage ? ' aria-current="page"' : ""}>Eventos <i class="bx bx-chevron-down" aria-hidden="true"></i></a><ul id="events-menu" aria-label="Eventos de Red Astrum">${eventLinks}</ul>`;
                const trigger = eventItem.querySelector(":scope > a");
                const setOpen = open => {
                    eventItem.classList.toggle("open", open);
                    trigger.setAttribute("aria-expanded", String(open));
                };
                trigger.addEventListener("click", event => {
                    event.preventDefault();
                    setOpen(!eventItem.classList.contains("open"));
                });
                eventItem.addEventListener("keydown", event => {
                    if (event.key === "Escape") {
                        setOpen(false);
                        trigger.focus();
                    }
                });
                document.addEventListener("click", event => {
                    if (!eventItem.contains(event.target)) setOpen(false);
                });
            } else {
                eventItem.className = "sidebar-services";
                eventItem.innerHTML = `<details${isEventPage ? " open" : ""}><summary><span>Eventos</span><i class="bx bx-chevron-down" aria-hidden="true"></i></summary><ul aria-label="Eventos de Red Astrum">${eventLinks}</ul></details>`;
            }
            const ngos = findTopLevelMenuItem(menu, "/ongs");
            if (ngos) ngos.after(eventItem); else menu.appendChild(eventItem);
        });

        const desktopMenu = document.querySelector("ul.main");
        if (desktopMenu && !desktopMenu.querySelector('[data-menu="programs"]')) {
            const item = document.createElement("li");
            item.className = "nav-dropdown";
            item.dataset.menu = "programs";
            item.innerHTML = `<a href="#programs-menu" aria-haspopup="true" aria-expanded="false"${isProgramPage ? ' aria-current="page"' : ""}>Programas <i class="bx bx-chevron-down" aria-hidden="true"></i></a><ul id="programs-menu" aria-label="Programas de Red Astrum">${programLinks}</ul>`;
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
            item.innerHTML = `<details${isProgramPage ? " open" : ""}><summary><span>Programas</span><i class="bx bx-chevron-down" aria-hidden="true"></i></summary><ul aria-label="Programas de Red Astrum">${programLinks}</ul></details>`;
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
        const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
        const isAstrumCertificaPage = normalizedPath === "/verificar";
        const isAstropediaPage = normalizedPath === "/astropedia";
        const isServicePage = isAstrumCertificaPage || isAstropediaPage;

        document.querySelectorAll([
            'ul.main > li > a[href="/verificar/"]',
            'ul.main > li > a[href="/verificar"]',
            'ul.main > li > a[href="/astropedia"]',
            '.sidebar > ul > li > a[href="/verificar/"]',
            '.sidebar > ul > li > a[href="/verificar"]',
            '.sidebar > ul > li > a[href="/astropedia"]'
        ].join(",")).forEach(link => link.closest("li")?.remove());

        const desktopMenu = document.querySelector("ul.main");
        if (desktopMenu && !desktopMenu.querySelector('[data-menu="services"]')) {
            const item = document.createElement("li");
            item.className = "nav-dropdown";
            item.dataset.menu = "services";
            item.innerHTML = `<a href="#services-menu" aria-haspopup="true" aria-expanded="false"${isServicePage ? ' aria-current="page"' : ""}>Servicios <i class="bx bx-chevron-down" aria-hidden="true"></i></a><ul id="services-menu" aria-label="Servicios de Red Astrum"><li><a href="/verificar/"${isAstrumCertificaPage ? ' aria-current="page"' : ""}>Astrum Certifica</a></li><li><a href="/astropedia"${isAstropediaPage ? ' aria-current="page"' : ""}>Astropedia</a></li></ul>`;

            const trigger = item.querySelector(":scope > a");
            const contact = Array.from(desktopMenu.children).find(element => {
                const link = element.querySelector(":scope > a[href]");
                if (!link) return false;
                try {
                    return new URL(link.getAttribute("href"), window.location.origin).hash === "#contacto";
                } catch {
                    return false;
                }
            });
            desktopMenu.insertBefore(item, contact || null);

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
        if (mobileMenu && !mobileMenu.querySelector('[data-menu="services-mobile"]')) {
            const item = document.createElement("li");
            item.className = "sidebar-services";
            item.dataset.menu = "services-mobile";
            item.innerHTML = `<details${isServicePage ? " open" : ""}><summary><span>Servicios</span><i class="bx bx-chevron-down" aria-hidden="true"></i></summary><ul aria-label="Servicios de Red Astrum"><li><a href="/verificar/"${isAstrumCertificaPage ? ' aria-current="page"' : ""}>Astrum Certifica</a></li><li><a href="/astropedia"${isAstropediaPage ? ' aria-current="page"' : ""}>Astropedia</a></li></ul></details>`;

            const contact = Array.from(mobileMenu.children).find(element => {
                const link = element.querySelector(":scope > a[href]");
                if (!link) return false;
                try {
                    return new URL(link.getAttribute("href"), window.location.origin).hash === "#contacto";
                } catch {
                    return false;
                }
            });
            mobileMenu.insertBefore(item, contact || null);
        }
    }

    function setupMobileMenu() {
        const sidebar = document.querySelector(".sidebar"); const menuButton = document.querySelector(".menu-icon"); const closeButton = document.querySelector(".close-icon"); if (!sidebar || !menuButton) return;
        const backdrop = document.createElement("button"); backdrop.type = "button"; backdrop.className = "menu-backdrop"; backdrop.setAttribute("aria-label", "Cerrar menú"); backdrop.hidden = true; sidebar.before(backdrop);
        const setState = (open, restoreFocus = true) => { sidebar.classList.toggle("open-sidebar", open); sidebar.classList.toggle("close-sidebar", !open); menuButton.setAttribute("aria-expanded", String(open)); sidebar.setAttribute("aria-hidden", String(!open)); sidebar.inert = !open; document.body.classList.toggle("menu-open", open); backdrop.hidden = !open; if (open) sidebar.querySelector("a,button,summary")?.focus(); else if (restoreFocus) menuButton.focus(); };
        menuButton.addEventListener("click", () => setState(!sidebar.classList.contains("open-sidebar"))); closeButton?.addEventListener("click", () => setState(false)); backdrop.addEventListener("click", () => setState(false)); sidebar.addEventListener("click", event => { if (event.target.closest("a")) setState(false, false); }); document.addEventListener("keydown", event => { if (!sidebar.classList.contains("open-sidebar")) return;
            if (event.key === "Escape") setState(false);
            if (event.key === "Tab") {
                const items = Array.from(sidebar.querySelectorAll('a,button,summary')).filter(el => el.getClientRects().length);
                const first = items[0], last = items[items.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            } }); window.addEventListener("resize", () => { if (window.innerWidth > 1500 && sidebar.classList.contains("open-sidebar")) setState(false, false); }, { passive: true });
    }

    function setupCounters() {
        const container = document.querySelector(".counters");
        const counters = container?.querySelectorAll("span[data-count]");
        if (!counters?.length) return;
        const renderFinal = () => counters.forEach(counter => { counter.textContent = counter.dataset.count || "0"; });
        renderFinal();
        if (reducedMotion || !("IntersectionObserver" in window)) return;
        const observer = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            const start = performance.now();
            const tick = now => {
                const progress = Math.min((now - start) / 1500, 1);
                const ease = 1 - Math.pow(1 - progress, 4);
                counters.forEach(counter => { counter.textContent = String(Math.round(Number(counter.dataset.count) * ease)); });
                if (progress < 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(tick);
                else renderFinal();
            };
            requestAnimationFrame(tick);
            observer.disconnect();
        }, { threshold: .25 });
        observer.observe(container);
    }

    function setupReveal() {
        const targets = document.querySelectorAll(".autoBlur,.autoDisplay,.fadein-left,.ra-program-card,.ra-card,.ra-detail-grid article,.home-event-photo,.counter");
        targets.forEach(el => el.classList.add("in-view"));
        if (reducedMotion || !("IntersectionObserver" in window)) return;
        // Stagger siblings within the viewport, without hiding offscreen content.
        document.querySelectorAll(".ra-program-grid,.ra-project-grid,.ra-detail-grid,.counters > div").forEach(grid => {
            Array.from(grid.children).forEach((child, index) => child.style.setProperty("--reveal-delay", `${(index % 3) * 85}ms`));
        });
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    entry.target.classList.add("motion-enter");
                    const finish = event => {
                        if (event.target !== entry.target) return;
                        entry.target.classList.remove("motion-enter");
                        entry.target.removeEventListener("animationend", finish);
                    };
                    entry.target.addEventListener("animationend", finish);
                }
                observer.unobserve(entry.target);
            });
        }, { threshold: .12 });
        targets.forEach(el => { if (!el.closest(".hero,header")) observer.observe(el); });
    }

    function setupImmersiveMotion() {
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
        const hero = document.querySelector(".ra-home .hero");
        const stage = hero?.querySelector(".skills-video-box");
        const root = document.documentElement;
        let activeHero = true, scrollFrame = 0, pointerFrame = 0;
        let enabled = !motionQuery.matches;
        const updatePreference = () => {
            enabled = !motionQuery.matches;
            root.classList.toggle("astrum-motion", enabled);
            if (!enabled) resetScene();
        };
        const resetScene = () => {
            if (!stage) return;
            ["--scene-x", "--scene-y", "--scene-rx", "--scene-ry"].forEach(name => stage.style.removeProperty(name));
        };
        updatePreference();
        motionQuery.addEventListener("change", updatePreference);
        const updateVisibility = () => root.classList.toggle("motion-paused", document.hidden);
        document.addEventListener("visibilitychange", updateVisibility);
        updateVisibility();

        if (hero && stage) {
            // Small CSS-only stars: no video, canvas loop or downloaded animation library.
            const stars = document.createElement("div");
            stars.className = "astrum-stars";
            stars.setAttribute("aria-hidden", "true");
            for (let index = 0; index < 25; index++) {
                const star = document.createElement("span");
                star.style.cssText = `--star-x:${(index * 37 + 11) % 100}%;--star-y:${(index * 23 + 7) % 100}%;--star-delay:${-index * .47}s;--star-size:${index % 5 === 0 ? 3 : 2}px`;
                stars.appendChild(star);
            }
            hero.prepend(stars);
            const orbit = stage.querySelector(".hero-orbit");
            const satellite = document.createElement("span");
            satellite.className = "orbit-satellite";
            satellite.setAttribute("aria-hidden", "true");
            orbit?.appendChild(satellite);
            const innerOrbit = document.createElement("div");
            innerOrbit.className = "hero-orbit-secondary";
            innerOrbit.setAttribute("aria-hidden", "true");
            stage.prepend(innerOrbit);
            hero.querySelectorAll(".hero-eyebrow,.hero-info-title,.hero-info h1,.hero-info > p:not(.hero-eyebrow),.ra-hero-actions,.skills-video-box").forEach((element, index) => {
                // The scene's transform is reserved for pointer depth; its image handles entry.
                const target = element === stage ? stage.querySelector("img") : element;
                target?.classList.add("hero-arrive");
                target?.style.setProperty("--arrival-delay", `${Math.min(index, 5) * 85}ms`);
            });
            if ("IntersectionObserver" in window) {
                new IntersectionObserver(entries => {
                    activeHero = entries[0].isIntersecting;
                    hero.classList.toggle("scene-paused", !activeHero);
                }).observe(hero);
            }
            hero.addEventListener("pointermove", event => {
                if (!enabled || !pointerQuery.matches || !activeHero || pointerFrame) return;
                const rect = hero.getBoundingClientRect();
                const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
                const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
                pointerFrame = requestAnimationFrame(() => {
                    stage.style.setProperty("--scene-x", `${x * 10}px`);
                    stage.style.setProperty("--scene-y", `${y * 8}px`);
                    stage.style.setProperty("--scene-rx", `${-y * 3}deg`);
                    stage.style.setProperty("--scene-ry", `${x * 4}deg`);
                    pointerFrame = 0;
                });
            }, { passive: true });
            hero.addEventListener("pointerleave", () => {
                cancelAnimationFrame(pointerFrame); pointerFrame = 0; resetScene();
            });
        }

        const updateScroll = () => {
            const total = root.scrollHeight - root.clientHeight;
            root.style.setProperty("--reading-progress", total > 0 ? String(Math.min(1, window.scrollY / total)) : "0");
            scrollFrame = 0;
        };
        const scheduleScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
        window.addEventListener("scroll", scheduleScroll, { passive: true });
        window.addEventListener("resize", scheduleScroll, { passive: true });
        updateScroll();
        document.querySelectorAll(".ra-program-card,.ra-detail-grid article").forEach(card => {
            card.classList.add("depth-card");
            let frame = 0;
            const resetCard = () => {
                cancelAnimationFrame(frame); frame = 0;
                ["--card-rx", "--card-ry", "--light-x", "--light-y"].forEach(name => card.style.removeProperty(name));
            };
            card.addEventListener("pointermove", event => {
                if (!enabled || !pointerQuery.matches || frame) return;
                const rect = card.getBoundingClientRect();
                const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
                const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
                frame = requestAnimationFrame(() => {
                    card.style.setProperty("--card-rx", `${(y - .5) * -3}deg`);
                    card.style.setProperty("--card-ry", `${(x - .5) * 3}deg`);
                    card.style.setProperty("--light-x", `${x * 100}%`);
                    card.style.setProperty("--light-y", `${y * 100}%`);
                    frame = 0;
                });
            }, { passive: true });
            card.addEventListener("pointerleave", resetCard);
            motionQuery.addEventListener("change", resetCard);
        });
    }

    function setupHeader() {
        const header = document.querySelector("header");
        if (!header) return;
        const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
        update();
        window.addEventListener("scroll", update, { passive: true });
    }

    function setupContactForm() {
        const form = document.querySelector("[data-contact-form]");
        if (!form) return;
        const frame = document.querySelector('iframe[name="contactSubmissionFrame"]');
        const status = document.getElementById("contactFormStatus");
        const button = form.querySelector('button[type="submit"]');
        if (!frame || !status || !button) return;

        let submitted = false;
        const label = () => document.documentElement.lang === "en" ? "Send message" : "Enviar mensaje";

        form.addEventListener("submit", () => {
            submitted = true;
            button.disabled = true;
            button.innerHTML = `${document.documentElement.lang === "en" ? "Sending…" : "Enviando…"} <i class="bx bx-loader-alt bx-spin" aria-hidden="true"></i>`;
            status.textContent = document.documentElement.lang === "en" ? "Sending message…" : "Enviando mensaje…";
        });

        frame.addEventListener("load", () => {
            if (!submitted) return;
            submitted = false;
            form.reset();
            button.disabled = false;
            button.innerHTML = `${label()} <i class="bx bx-send" aria-hidden="true"></i>`;
            status.textContent = document.documentElement.lang === "en"
                ? "Thanks. We received your message and will contact you soon."
                : "Gracias. Recibimos tu mensaje y nos comunicaremos contigo pronto.";
        });
    }

    function synchronizePublicNgoState() {
        const OFFICIAL_NGO_COUNT = 15; const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/"; const requestedOng = new URLSearchParams(window.location.search).get("id"); if (normalizedPath === "/ong" && requestedOng === "maywa") { window.location.replace("/ongs"); return; }
        if (typeof window.ONGS !== "undefined" && Array.isArray(window.ONGS)) { const index = window.ONGS.findIndex(org => org.id === "maywa"); if (index >= 0) window.ONGS.splice(index, 1); }
        document.querySelectorAll(".counter").forEach(counter => { if (counter.querySelector("h3")?.textContent.trim() === "ONGs de Red Astrum") { const value = counter.querySelector("span[data-count]"); if (value) value.dataset.count = String(OFFICIAL_NGO_COUNT); } });
        const maywaItem = document.querySelector('.astrum-carousel img[src*="maywa.webp"]')?.closest(".astrum-carousel-item"); if (maywaItem) { const list = maywaItem.parentElement; maywaItem.remove(); const items = Array.from(list?.querySelectorAll(".astrum-carousel-item") || []); items.forEach((item, index) => item.style.setProperty("--position", String(index + 1))); list?.closest(".astrum-carousel")?.style.setProperty("--quantity", String(items.length)); }
        if (typeof window.renderOrganizations === "function") window.renderOrganizations(document.getElementById("ongSearch")?.value || "");
    }

    function ensureInstitutionalFooter() {
        const path = window.location.pathname.replace(/\/+$/, "") || "/";
        if (!['/ongs', '/astrum-clubes'].includes(path)) return;

        let footer = document.querySelector('.footer');
        if (!footer) {
            footer = document.createElement('section');
            footer.className = 'footer';
            document.querySelector('.container')?.appendChild(footer);
        }

        if (path === '/astrum-clubes') footer.classList.add('ga-footer');

        footer.innerHTML = `
            <div class="footer-text">
                <p>© 2026 Red Astrum. Todos los derechos reservados. <span aria-hidden="true">·</span> RUC 20615815005</p>
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


    function addInstitutionalYouTube() {
        document.querySelectorAll('.box-icons, .social-box, .social-sidebar').forEach(container => {
            if (container.querySelector('a[href="https://www.youtube.com/@RedAstrum"]')) return;
            const link = document.createElement('a');
            link.href = 'https://www.youtube.com/@RedAstrum';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', 'YouTube de Red Astrum');
            const icon = document.createElement('i');
            icon.className = 'bx bxl-youtube';
            icon.setAttribute('aria-hidden', 'true');
            link.appendChild(icon);
            if (container.classList.contains('social-box')) {
                link.appendChild(document.createTextNode(' YouTube de Red Astrum'));
            }
            container.insertBefore(link, container.querySelector('.language-switcher'));
        });
    }

    ensureSocialMetadata(); optimizeMedia(); setupLazyVideos(); addProgramsMenu(); addServicesMenu(); setupMobileMenu(); synchronizePublicNgoState(); setupCounters(); setupReveal(); setupImmersiveMotion(); setupHeader(); setupContactForm(); ensureInstitutionalFooter(); addInstitutionalYouTube();
})();

