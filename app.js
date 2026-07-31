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

// Acceso institucional al verificador en la navegación principal y móvil.
function addVerificationMenuItem() {
    const normalizedPath = (window.location.pathname.replace(/\/+$/, "") || "/");
    const isVerificationPage = normalizedPath === "/verificar";

    const addItem = (menuList, label, ariaLabel) => {
        if (!menuList || menuList.querySelector('a[href="/verificar/"], a[href="/verificar"]')) return;

        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = "/verificar/";
        link.textContent = label;
        link.setAttribute("aria-label", ariaLabel);

        if (isVerificationPage) {
            link.setAttribute("aria-current", "page");
        }

        item.appendChild(link);

        const contactItem = Array.from(menuList.children).find(child => {
            const contactLink = child.querySelector('a[href="#contacto"], a[href="/#contacto"]');
            return Boolean(contactLink);
        });

        menuList.insertBefore(item, contactItem || null);
    };

    addItem(
        document.querySelector("ul.main"),
        "Verificar",
        "Verificar certificado, constancia o acreditación"
    );

    addItem(
        document.querySelector(".sidebar ul"),
        "Verificar certificado",
        "Verificar certificado, constancia o acreditación"
    );
}

addVerificationMenuItem();

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
    } else if (restoreFocus) {
        menu.focus();
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
