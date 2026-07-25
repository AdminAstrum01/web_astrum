// Sidebar
const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

menu.addEventListener("click", function () {
    sideBar.classList.remove("close-sidebar");
    sideBar.classList.add("open-sidebar");
});

closeIcon.addEventListener("click", function () {
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
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
