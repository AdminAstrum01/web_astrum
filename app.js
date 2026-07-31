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
                margin-bottom: 24px;
            }

            .sidebar .sidebar-services details {
                width: 100%;
            }

            .sidebar .sidebar-services summary {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 10px;
                color: lightgray;
                cursor: pointer;
                font-size: clamp(24px, 7vw, 30px);
                font-weight: 900;
                list-style: none;
                text-shadow: 0 0 15px #4c4c4c;
            }

            .sidebar .sidebar-services summary::-webkit-details-marker {
                display: none;
            }

            .sidebar .sidebar-services summary i {
                font-size: 0.85em;
                transition: transform 0.25s ease;
            }

            .sidebar .sidebar-services details[open] summary i {
                transform: rotate(180deg);
            }

            .sidebar .sidebar-services ul {
                margin: 14px 0 0 6px;
                padding: 0 0 0 18px;
                border-left: 2px solid rgba(212, 184, 232, 0.45);
            }

            .sidebar .sidebar-services ul li {
                margin: 0;
            }

            .sidebar .sidebar-services ul li a {
                display: inline-flex;
                padding: 8px 0;
                color: var(--color-light);
                font-size: clamp(18px, 5.5vw, 23px);
                font-weight: 700;
                line-height: 1.25;
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
