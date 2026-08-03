// Mantener URLs públicas limpias aunque se acceda mediante un archivo HTML heredado.
if (window.location.protocol !== "file:") {
    let cleanPath = window.location.pathname;

    if (cleanPath.endsWith("/index.html")) {
        cleanPath = cleanPath.slice(0, -"/index.html".length) || "/";
    } else if (cleanPath.endsWith(".html")) {
        cleanPath = cleanPath.slice(0, -".html".length) || "/";
    }

    if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
        cleanPath = cleanPath.slice(0, -1);
    }

    if (cleanPath !== window.location.pathname) {
        window.history.replaceState(
            window.history.state,
            "",
            `${cleanPath}${window.location.search}${window.location.hash}`
        );
    }
}

// Menú institucional de servicios, con acceso a Astrum Certifica.
function addServicesMenu() {
    const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
    const isAstrumCertificaPage = normalizedPath === "/verificar";

    // Retirar el enlace directo anterior si aún permanece en una versión almacenada.
    document.querySelectorAll(
        'ul.main > li > a[href="/verificar/"], ul.main > li > a[href="/verificar"], ' +
        '.sidebar > ul > li > a[href="/verificar/"], .sidebar > ul > li > a[href="/verificar"]'
    ).forEach(link => link.closest("li")?.remove());

    const desktopMenu = document.querySelector("ul.main");

    if (desktopMenu && !desktopMenu.querySelector('[data-menu="services"]')) {
        const servicesItem = document.createElement("li");
        servicesItem.className = "nav-dropdown";
        servicesItem.dataset.menu = "services";

        const servicesTrigger = document.createElement("a");
        servicesTrigger.href = "#services-menu";
        servicesTrigger.setAttribute("aria-haspopup", "true");
        servicesTrigger.setAttribute("aria-expanded", "false");
        servicesTrigger.append(document.createTextNode("Servicios "));

        const chevron = document.createElement("i");
        chevron.className = "bx bx-chevron-down";
        chevron.setAttribute("aria-hidden", "true");
        servicesTrigger.appendChild(chevron);

        const submenu = document.createElement("ul");
        submenu.id = "services-menu";
        submenu.setAttribute("aria-label", "Servicios de Red Astrum");

        const astrumItem = document.createElement("li");
        const astrumLink = document.createElement("a");
        astrumLink.href = "/verificar/";
        astrumLink.textContent = "Astrum Certifica";
        astrumLink.setAttribute(
            "aria-label",
            "Abrir Astrum Certifica para verificar certificados, constancias y acreditaciones"
        );

        if (isAstrumCertificaPage) {
            servicesTrigger.setAttribute("aria-current", "page");
            astrumLink.setAttribute("aria-current", "page");
        }

        astrumItem.appendChild(astrumLink);
        submenu.appendChild(astrumItem);
        servicesItem.append(servicesTrigger, submenu);

        const contactItem = Array.from(desktopMenu.children).find(child =>
            Boolean(child.querySelector('a[href="#contacto"], a[href="/#contacto"]'))
        );

        desktopMenu.insertBefore(servicesItem, contactItem || null);

        const setServicesState = isOpen => {
            servicesItem.classList.toggle("open", isOpen);
            servicesTrigger.setAttribute("aria-expanded", String(isOpen));
        };

        servicesTrigger.addEventListener("click", event => {
            event.preventDefault();
            setServicesState(!servicesItem.classList.contains("open"));
        });

        servicesItem.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setServicesState(false);
                servicesTrigger.focus();
            }
        });

        document.addEventListener("click", event => {
            if (!servicesItem.contains(event.target)) {
                setServicesState(false);
            }
        });
    }

    const mobileMenu = document.querySelector(".sidebar > ul");

    if (mobileMenu && !mobileMenu.querySelector('[data-menu="services-mobile"]')) {
        const servicesItem = document.createElement("li");
        servicesItem.className = "sidebar-services";
        servicesItem.dataset.menu = "services-mobile";

        const details = document.createElement("details");
        if (isAstrumCertificaPage) details.open = true;

        const summary = document.createElement("summary");
        const summaryLabel = document.createElement("span");
        summaryLabel.textContent = "Servicios";

        const chevron = document.createElement("i");
        chevron.className = "bx bx-chevron-down";
        chevron.setAttribute("aria-hidden", "true");

        summary.append(summaryLabel, chevron);

        const submenu = document.createElement("ul");
        submenu.setAttribute("aria-label", "Servicios de Red Astrum");

        const astrumItem = document.createElement("li");
        const astrumLink = document.createElement("a");
        astrumLink.href = "/verificar/";
        astrumLink.textContent = "Astrum Certifica";
        astrumLink.setAttribute(
            "aria-label",
            "Abrir Astrum Certifica para verificar certificados, constancias y acreditaciones"
        );

        if (isAstrumCertificaPage) {
            astrumLink.setAttribute("aria-current", "page");
        }

        astrumItem.appendChild(astrumLink);
        submenu.appendChild(astrumItem);
        details.append(summary, submenu);
        servicesItem.appendChild(details);

        const contactItem = Array.from(mobileMenu.children).find(child =>
            Boolean(child.querySelector('a[href="#contacto"], a[href="/#contacto"]'))
        );

        mobileMenu.insertBefore(servicesItem, contactItem || null);
    }

    if (!document.getElementById("services-menu-styles")) {
        const styles = document.createElement("style");
        styles.id = "services-menu-styles";
        styles.textContent = `
            .sidebar .sidebar-services {
                margin: 0;
            }

            .sidebar .sidebar-services details {
                width: 100%;
            }

            .sidebar .sidebar-services summary {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
                width: 100%;
                min-height: 48px;
                padding: 11px 14px;
                border-radius: 13px;
                color: rgba(255, 255, 255, 0.88);
                cursor: pointer;
                font-size: 16px;
                font-weight: 700;
                line-height: 1.3;
                list-style: none;
                text-shadow: none;
                transition: background-color 0.2s ease, color 0.2s ease;
                -webkit-tap-highlight-color: transparent;
            }

            .sidebar .sidebar-services summary::-webkit-details-marker {
                display: none;
            }

            .sidebar .sidebar-services summary:hover,
            .sidebar .sidebar-services summary:active,
            .sidebar .sidebar-services details[open] > summary {
                background: rgba(212, 184, 232, 0.12);
                color: var(--color-white);
            }

            .sidebar .sidebar-services summary:focus-visible {
                outline: 3px solid var(--color-accent);
                outline-offset: 3px;
            }

            .sidebar .sidebar-services summary i {
                font-size: 20px;
                transition: transform 0.25s ease;
            }

            .sidebar .sidebar-services details[open] summary i {
                transform: rotate(180deg);
            }

            .sidebar .sidebar-services ul {
                gap: 2px;
                width: calc(100% - 20px);
                margin: 4px 0 2px 14px;
                padding: 4px 0 4px 12px;
                border-left: 2px solid rgba(212, 184, 232, 0.45);
            }

            .sidebar .sidebar-services ul li {
                margin: 0;
            }

            .sidebar .sidebar-services ul li a {
                display: flex;
                width: 100%;
                min-height: 44px;
                padding: 10px 12px;
                border-radius: 11px;
                color: var(--color-light);
                font-size: 15px;
                font-weight: 600;
                line-height: 1.3;
                text-shadow: none;
            }
        `;
        document.head.appendChild(styles);
    }
}

addServicesMenu();

// Navegación responsive
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');
const menuBackdrop = document.createElement("button");

if (sideBar) {
    menuBackdrop.type = "button";
    menuBackdrop.className = "menu-backdrop";
    menuBackdrop.setAttribute("aria-label", "Cerrar menú");
    menuBackdrop.hidden = true;
    sideBar.before(menuBackdrop);
}

function setMenuState(isOpen, { restoreFocus = true } = {}) {
    if (!sideBar || !menu) return;

    sideBar.classList.toggle("open-sidebar", isOpen);
    sideBar.classList.toggle("close-sidebar", !isOpen);
    menu.setAttribute("aria-expanded", String(isOpen));
    sideBar.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
    menuBackdrop.hidden = !isOpen;

    if (isOpen) {
        const firstLink = sideBar.querySelector("a");
        firstLink?.focus();
    } else {
        sideBar.querySelectorAll("details[open]").forEach(details => {
            details.removeAttribute("open");
        });

        if (restoreFocus) menu.focus();
    }
}

menu?.addEventListener("click", function () {
    setMenuState(!sideBar?.classList.contains("open-sidebar"));
});

closeIcon?.addEventListener("click", function () {
    setMenuState(false);
});

sideBar?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        setMenuState(false, { restoreFocus: false });
    });
});

menuBackdrop.addEventListener("click", () => setMenuState(false));

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && sideBar?.classList.contains("open-sidebar")) {
        setMenuState(false);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && sideBar?.classList.contains("open-sidebar")) {
        setMenuState(false, { restoreFocus: false });
    }
});

// Counter
const counters = document.querySelectorAll(".counters span");
const container = document.querySelector(".counters");

let activated = false;

window.addEventListener("scroll", () => {
    if (!container) return;

    if (
        window.scrollY > container.offsetTop - container.offsetHeight - 200 &&
        activated === false
    ) {
        counters.forEach(counter => {
            counter.innerText = 0;
            let count = 0;
            const target = parseInt(counter.dataset.count);

            function updateCount() {
                count += Math.ceil(target / 100);
                if (count < target) {
                    counter.innerText = count;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            }
            updateCount();
        });
        activated = true;
    } else if (
        (window.scrollY < container.offsetTop - container.offsetHeight - 500 ||
            window.scrollY === 0) &&
        activated === true
    ) {
        counters.forEach(counter => { counter.innerText = 0; });
        activated = false;
    }
});

// Scroll reveal (reemplaza animation-timeline: view(), poco confiable entre navegadores)
const revealTargets = document.querySelectorAll(".autoBlur, .autoDisplay, .fadein-left");

if (revealTargets.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
    });

    revealTargets.forEach(el => revealObserver.observe(el));
} else {
    // Sin soporte de IntersectionObserver: mostrar todo de inmediato
    revealTargets.forEach(el => el.classList.add("in-view"));
}

// Sincronización pública del número de ONGs y retiro de Maywa.
const OFFICIAL_NGO_COUNT = 14;

function synchronizePublicNgoState() {
    const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
    const requestedOng = new URLSearchParams(window.location.search).get("id");

    if (normalizedPath === "/ong" && requestedOng === "maywa") {
        window.location.replace("/ongs");
        return;
    }

    if (typeof ONGS !== "undefined") {
        const maywaIndex = ONGS.findIndex(organization => organization.id === "maywa");
        if (maywaIndex >= 0) ONGS.splice(maywaIndex, 1);
    }

    const ngoCounter = Array.from(document.querySelectorAll(".counter")).find(counter =>
        counter.querySelector("h3")?.textContent.trim() === "ONGs de Red Astrum"
    );
    const ngoCounterValue = ngoCounter?.querySelector("span[data-count]");
    if (ngoCounterValue) {
        ngoCounterValue.dataset.count = String(OFFICIAL_NGO_COUNT);
        if (activated) ngoCounterValue.textContent = String(OFFICIAL_NGO_COUNT);
    }

    const carousel = document.querySelector(".astrum-carousel");
    const maywaCarouselItem = carousel
        ?.querySelector('img[src*="maywa.webp"]')
        ?.closest(".astrum-carousel-item");

    if (maywaCarouselItem) {
        const list = maywaCarouselItem.parentElement;
        maywaCarouselItem.remove();

        const remainingItems = Array.from(list.querySelectorAll(".astrum-carousel-item"));
        remainingItems.forEach((item, index) => {
            item.style.setProperty("--position", String(index + 1));
        });
        carousel.style.setProperty("--quantity", String(remainingItems.length));
    }

    if (typeof renderOrganizations === "function") {
        const searchValue = document.getElementById("ongSearch")?.value || "";
        renderOrganizations(searchValue);
    } else {
        document.querySelectorAll('a.ong-tile[href*="id=maywa"]').forEach(card => card.remove());
        const directoryCount = document.getElementById("ongListCount");
        if (directoryCount) {
            directoryCount.textContent = window.AstrumI18n?.t(
                "ongs.count.many",
                { count: OFFICIAL_NGO_COUNT }
            ) || `${OFFICIAL_NGO_COUNT} organizaciones`;
        }
    }
}

window.setTimeout(synchronizePublicNgoState, 0);
document.addEventListener("DOMContentLoaded", synchronizePublicNgoState, { once: true });
