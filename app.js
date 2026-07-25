// Navegación responsive
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

function setMenuState(isOpen) {
    if (!sideBar || !menu) return;

    sideBar.classList.toggle("open-sidebar", isOpen);
    sideBar.classList.toggle("close-sidebar", !isOpen);
    menu.setAttribute("aria-expanded", String(isOpen));
    sideBar.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);

    if (isOpen) {
        const firstLink = sideBar.querySelector("a");
        firstLink?.focus();
    } else {
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
    link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && sideBar?.classList.contains("open-sidebar")) {
        setMenuState(false);
    }
});

document.addEventListener("click", event => {
    if (
        sideBar?.classList.contains("open-sidebar") &&
        !sideBar.contains(event.target) &&
        !menu?.contains(event.target)
    ) {
        setMenuState(false);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && sideBar?.classList.contains("open-sidebar")) {
        setMenuState(false);
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
