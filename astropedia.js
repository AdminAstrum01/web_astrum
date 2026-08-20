(() => {
    "use strict";

    const orgs = window.ASTROPEDIA_ORGS || [];
    const services = window.ASTROPEDIA_SERVICES || [];
    const faq = window.ASTROPEDIA_FAQ || [];
    const publicOrgs = typeof ONGS !== "undefined" ? ONGS : [];

    const login = document.getElementById("astroLogin");
    const app = document.getElementById("astroApp");
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const loginError = document.getElementById("loginError");
    const orgList = document.getElementById("organizationList");
    const orgSearch = document.getElementById("orgSearch");
    const orgCount = document.getElementById("organizationCount");
    const serviceGrid = document.getElementById("serviceGrid");
    const modal = document.getElementById("serviceModal");
    const toast = document.getElementById("astroToast");
    let currentOrg = orgs.find(org => org.email === "holoastrum@redastrum.org") || orgs[0];

    const normalize = (value = "") => value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    function initials(name = "") {
        return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    }

    function getPublicOrg(id) {
        return publicOrgs.find(org => org.id === id) || null;
    }

    function getIntegrationLevel(percentage) {
        if (percentage > 50) return { name: "Integración institucional", message: "Tu organización transforma la red", description: "Tienes acceso al nivel más amplio de beneficios institucionales." };
        if (percentage >= 31) return { name: "Integración operativa", message: "Tu organización articula con la red", description: "Tienes acceso a recursos operativos y proyectos conjuntos." };
        return { name: "Integración colaborativa", message: "Tu organización ya forma parte de la red", description: "Activa recursos comunes y fortalece tu participación para acceder a más beneficios." };
    }

    function showToast(message) {
        toast.querySelector("span").textContent = message;
        toast.hidden = false;
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2600);
    }

    function renderProfile() {
        const level = getIntegrationLevel(currentOrg.participation);
        document.getElementById("accountAvatar").textContent = initials(currentOrg.name);
        document.getElementById("accountName").textContent = currentOrg.name;
        document.getElementById("accountLevel").textContent = level.name;
        document.getElementById("welcomeName").textContent = currentOrg.name;
        document.getElementById("participationValue").textContent = currentOrg.participation + "%";
        document.getElementById("progressRing").style.setProperty("--progress", Math.min(360, currentOrg.participation * 3.6) + "deg");
        document.getElementById("levelPill").innerHTML = "<i class='bx bx-sparkles'></i> " + level.name;
        document.getElementById("levelMessage").textContent = level.message;
        document.getElementById("levelDescription").textContent = level.description;

        document.querySelectorAll(".astro-levels article").forEach(card => {
            const minimum = Number(card.dataset.min);
            const isCurrent = minimum === 20
                ? currentOrg.participation <= 30
                : minimum === 31
                    ? currentOrg.participation >= 31 && currentOrg.participation <= 50
                    : currentOrg.participation > 50;
            card.classList.toggle("is-current", isCurrent);
            if (isCurrent) card.setAttribute("aria-current", "step");
            else card.removeAttribute("aria-current");
        });
    }

    function logoMarkup(org) {
        const publicOrg = getPublicOrg(org.id);
        if (publicOrg?.logo) {
            return `<span class="astro-org-logo"><img src="${publicOrg.logo}" alt="Logo de ${org.name}" loading="lazy" onerror="this.parentElement.textContent='${initials(org.name)}'"></span>`;
        }
        return `<span class="astro-org-logo">${initials(org.name)}</span>`;
    }

    function renderOrganizations(query = "") {
        const filtered = orgs.filter(org => normalize([org.name, org.representative, org.role, org.email, org.ods.join(" ")].join(" ")).includes(normalize(query)));
        orgList.innerHTML = filtered.map(org => {
            const publicOrg = getPublicOrg(org.id);
            const region = publicOrg?.region || "Organización afiliada";
            const email = org.email
                ? `<a class="astro-org-email" href="mailto:${org.email}"><i class="bx bx-envelope"></i><span>${org.email}</span></a>`
                : `<span class="astro-org-email is-empty"><i class="bx bx-envelope"></i><span>Por asignar</span></span>`;
            const portal = publicOrg
                ? `<a class="astro-portal-link" href="/ong?id=${encodeURIComponent(org.id)}">Ver portal <i class="bx bx-link-external"></i></a>`
                : `<span class="astro-portal-link is-disabled">Portal próximo</span>`;
            return `<article class="astro-org-row">
                <div class="astro-org-name">${logoMarkup(org)}<span><strong>${org.name}</strong><small>${region}</small></span></div>
                <div class="astro-representative"><i class="bx bx-user"></i><span><strong>${org.representative}</strong><small>${org.role}</small></span></div>
                ${email}
                <div class="astro-ods">${org.ods.map(number => `<span title="ODS ${number}">${number}</span>`).join("")}</div>
                ${portal}
            </article>`;
        }).join("");
        orgCount.textContent = `${filtered.length} ${filtered.length === 1 ? "organización" : "organizaciones"}`;
    }

    function renderServices() {
        serviceGrid.innerHTML = services.map(service => {
            const available = currentOrg.participation >= service.level;
            return `<article class="astro-service-card ${available ? "" : "is-locked"}">
                <div class="astro-service-card-top"><span class="astro-service-icon"><i class="bx ${service.icon}"></i></span><span class="astro-service-status"><i class="bx ${available ? "bx-check" : "bx-lock-alt"}"></i>${available ? "Disponible" : `Requiere ${service.level}%`}</span></div>
                <span class="astro-service-group">${service.group}</span><h3>${service.title}</h3><p>${service.description}</p>
                <button type="button" data-service="${service.id}">${available ? service.action : "Cómo desbloquear"}<i class="bx ${available ? "bx-right-arrow-alt" : "bx-lock-alt"}"></i></button>
            </article>`;
        }).join("");

        serviceGrid.querySelectorAll("[data-service]").forEach(button => {
            button.addEventListener("click", () => {
                const service = services.find(item => item.id === button.dataset.service);
                if (currentOrg.participation < service.level) {
                    document.getElementById("nivel").scrollIntoView({ behavior: "smooth" });
                    showToast(`Este servicio se habilita desde ${service.level}% de participación.`);
                    return;
                }
                openService(service);
            });
        });
    }

    function openService(service) {
        document.getElementById("modalIcon").className = `bx ${service.icon}`;
        document.getElementById("modalGroup").textContent = service.group;
        document.getElementById("modalTitle").textContent = service.title;
        document.getElementById("modalDescription").textContent = service.description;
        const detail = document.getElementById("modalDetail");
        const action = document.getElementById("modalAction");
        if (service.id === "cuentas") {
            detail.innerHTML = currentOrg.email
                ? `<strong>Cuenta institucional</strong>${currentOrg.email}<br><small>Las contraseñas no se muestran ni se almacenan en Astropedia.</small>`
                : "La cuenta institucional está pendiente de asignación.";
            action.href = currentOrg.email ? `mailto:info@redastrum.org?subject=Soporte%20para%20${encodeURIComponent(currentOrg.email)}` : "mailto:info@redastrum.org?subject=Asignación%20de%20cuenta%20institucional";
            action.innerHTML = "Solicitar soporte <i class='bx bx-right-arrow-alt'></i>";
        } else if (service.id === "gastrum") {
            detail.innerHTML = "<strong>Comunidad G-Astrum</strong>Explora los clubes y espacios de integración disponibles.";
            action.href = "/g-astrum";
            action.innerHTML = "Abrir G-Astrum <i class='bx bx-right-arrow-alt'></i>";
        } else {
            detail.innerHTML = `<strong>Solicitud institucional</strong>El equipo de Red Astrum revisará la solicitud de ${currentOrg.name} y responderá por el canal institucional.`;
            action.href = `mailto:info@redastrum.org?subject=${encodeURIComponent(service.title + " - " + currentOrg.name)}`;
            action.innerHTML = "Preparar solicitud <i class='bx bx-right-arrow-alt'></i>";
        }
        modal.hidden = false;
    }

    function enterPlatform(org) {
        currentOrg = org;
        login.hidden = true;
        app.hidden = false;
        window.scrollTo({ top: 0 });
        renderProfile();
        renderOrganizations();
        renderServices();
    }

    loginForm.addEventListener("submit", event => {
        event.preventDefault();
        const email = normalize(emailInput.value);
        const org = orgs.find(item => normalize(item.email) === email);
        if (!org) {
            loginError.textContent = "No encontramos una organización asociada a este correo institucional.";
            return;
        }
        if (!passwordInput.value.trim()) {
            loginError.textContent = "Completa la contraseña o utiliza el acceso piloto.";
            return;
        }
        loginError.textContent = "";
        enterPlatform(org);
    });

    document.getElementById("demoAccess").addEventListener("click", () => {
        emailInput.value = "holoastrum@redastrum.org";
        passwordInput.value = "piloto";
        loginForm.requestSubmit();
    });

    document.getElementById("togglePassword").addEventListener("click", event => {
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";
        event.currentTarget.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
        event.currentTarget.querySelector("i").className = `bx ${show ? "bx-hide" : "bx-show"}`;
    });

    document.getElementById("logoutButton").addEventListener("click", () => {
        app.hidden = true;
        login.hidden = false;
        passwordInput.value = "";
        document.getElementById("assistantPanel").hidden = true;
        window.scrollTo({ top: 0 });
    });

    orgSearch.addEventListener("input", event => renderOrganizations(event.target.value));
    document.getElementById("closeModal").addEventListener("click", () => { modal.hidden = true; });
    modal.addEventListener("click", event => { if (event.target === modal) modal.hidden = true; });

    const assistant = document.getElementById("assistantPanel");
    const assistantAnswer = document.getElementById("assistantAnswer");
    const assistantQuestions = document.getElementById("assistantQuestions");
    function selectQuestion(index) {
        const item = faq[index];
        assistantAnswer.innerHTML = `<strong>${item.question}</strong>${item.answer}`;
        assistantQuestions.querySelectorAll("button").forEach((button, i) => button.classList.toggle("is-active", i === index));
    }
    assistantQuestions.innerHTML = faq.map((item, index) => `<button type="button" data-question="${index}"><span>${item.question}</span><i class="bx bx-chevron-right"></i></button>`).join("");
    assistantQuestions.querySelectorAll("button").forEach(button => button.addEventListener("click", () => selectQuestion(Number(button.dataset.question))));
    if (faq.length) selectQuestion(0);
    document.getElementById("assistantButton").addEventListener("click", () => { assistant.hidden = !assistant.hidden; });
    document.getElementById("closeAssistant").addEventListener("click", () => { assistant.hidden = true; });

    document.querySelectorAll(".astro-assistant-avatar img, .astro-button-avatar img").forEach(image => {
        image.addEventListener("error", () => { image.hidden = true; }, { once: true });
    });

    const sections = [...document.querySelectorAll(".astro-app section[id]")];
    const navLinks = [...document.querySelectorAll(".astro-topbar nav a")];
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (!visible) return;
            navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
        }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.25] });
        sections.forEach(section => observer.observe(section));
    }
})();
