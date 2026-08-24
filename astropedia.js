(() => {
    "use strict";

    const faq = window.ASTROPEDIA_FAQ || [];
    const publicOrgs = typeof ONGS !== "undefined" ? ONGS : [];
    const config = window.ASTROPEDIA_CONFIG || {};
    const db = window.supabase && config.url && config.publishableKey
        ? window.supabase.createClient(config.url, config.publishableKey)
        : null;

    const byId = id => document.getElementById(id);
    const login = byId("astroLogin");
    const app = byId("astroApp");
    const form = byId("loginForm");
    const emailInput = byId("loginEmail");
    const passwordInput = byId("loginPassword");
    const errorBox = byId("loginError");
    const loginButton = form.querySelector("button[type='submit']");
    const resetButton = byId("resetPassword");
    const orgList = byId("organizationList");
    const orgCount = byId("organizationCount");
    const serviceGrid = byId("serviceGrid");
    const modal = byId("serviceModal");
    const modalAction = byId("modalAction");
    const toast = byId("astroToast");

    let orgs = [];
    let services = [];
    let currentOrg = null;
    let currentUser = null;
    let currentService = null;
    let recoveryMode = false;

    const normalize = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const initials = (name = "") => name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    const getPublicOrg = id => publicOrgs.find(org => org.id === id) || null;
    const mapOrg = row => ({
        databaseId: row.id,
        id: row.slug,
        name: row.name,
        representative: row.representative_name || "Representante por confirmar",
        role: row.representative_role || "",
        email: row.institutional_email || "",
        participation: Number(row.participation),
        ods: Array.isArray(row.ods) ? row.ods : []
    });
    const mapService = row => ({
        id: row.id,
        icon: row.icon,
        title: row.title,
        description: row.description,
        level: Number(row.minimum_participation),
        group: row.service_group,
        action: row.action_label
    });

    function integrationLevel(percentage) {
        if (percentage > 50) return { name: "Integración institucional", message: "Tu organización transforma la red", description: "Tienes acceso al nivel más amplio de beneficios institucionales." };
        if (percentage >= 31) return { name: "Integración operativa", message: "Tu organización articula con la red", description: "Tienes acceso a recursos operativos y proyectos conjuntos." };
        return { name: "Integración colaborativa", message: "Tu organización ya forma parte de la red", description: "Activa recursos comunes y fortalece tu participación para acceder a más beneficios." };
    }

    function showToast(message) {
        toast.querySelector("span").textContent = message;
        toast.hidden = false;
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
    }

    function setLoading(loading) {
        loginButton.disabled = loading;
        loginButton.innerHTML = loading
            ? "Verificando acceso… <i class='bx bx-loader-alt bx-spin'></i>"
            : recoveryMode
                ? "Guardar nueva contraseña <i class='bx bx-check'></i>"
                : "Ingresar a la plataforma <i class='bx bx-right-arrow-alt'></i>";
    }

    function setRecoveryMode(user) {
        recoveryMode = true;
        currentUser = user;
        emailInput.value = user?.email || "";
        emailInput.disabled = true;
        emailInput.required = false;
        passwordInput.value = "";
        passwordInput.placeholder = "Mínimo 8 caracteres";
        byId("loginTitle").textContent = "Crea una nueva contraseña";
        document.querySelector(".astro-login-intro").textContent = "Define la nueva contraseña de tu cuenta institucional.";
        resetButton.hidden = true;
        setLoading(false);
    }

    function resetLoginView() {
        recoveryMode = false;
        emailInput.disabled = false;
        emailInput.required = true;
        emailInput.value = "";
        passwordInput.value = "";
        passwordInput.placeholder = "Ingresa tu contraseña";
        byId("loginTitle").textContent = "Ingresa a Astropedia";
        document.querySelector(".astro-login-intro").textContent = "Usa el correo institucional asignado a tu organización.";
        resetButton.hidden = false;
        setLoading(false);
    }

    function renderProfile() {
        const level = integrationLevel(currentOrg.participation);
        byId("accountAvatar").textContent = initials(currentOrg.name);
        byId("accountName").textContent = currentOrg.name;
        byId("accountLevel").textContent = level.name;
        byId("welcomeName").textContent = currentOrg.name;
        byId("participationValue").textContent = currentOrg.participation + "%";
        byId("progressRing").style.setProperty("--progress", Math.min(360, currentOrg.participation * 3.6) + "deg");
        byId("levelPill").innerHTML = "<i class='bx bx-sparkles'></i> " + level.name;
        byId("levelMessage").textContent = level.message;
        byId("levelDescription").textContent = level.description;
        document.querySelectorAll(".astro-levels article").forEach(card => {
            const minimum = Number(card.dataset.min);
            const active = minimum === 20 ? currentOrg.participation <= 30 : minimum === 31 ? currentOrg.participation <= 50 && currentOrg.participation >= 31 : currentOrg.participation > 50;
            card.classList.toggle("is-current", active);
            if (active) card.setAttribute("aria-current", "step"); else card.removeAttribute("aria-current");
        });
    }

    function logoMarkup(org) {
        const publicOrg = getPublicOrg(org.id);
        return publicOrg?.logo
            ? `<span class="astro-org-logo"><img src="${publicOrg.logo}" alt="Logo de ${org.name}" loading="lazy" onerror="this.parentElement.textContent='${initials(org.name)}'"></span>`
            : `<span class="astro-org-logo">${initials(org.name)}</span>`;
    }

    function renderOrganizations(query = "") {
        const filtered = orgs.filter(org => normalize([org.name, org.representative, org.role, org.email, org.ods.join(" ")].join(" ")).includes(normalize(query)));
        orgList.innerHTML = filtered.map(org => {
            const publicOrg = getPublicOrg(org.id);
            const email = org.email
                ? `<a class="astro-org-email" href="mailto:${org.email}"><i class="bx bx-envelope"></i><span>${org.email}</span></a>`
                : `<span class="astro-org-email is-empty"><i class="bx bx-envelope"></i><span>Por asignar</span></span>`;
            const portal = publicOrg
                ? `<a class="astro-portal-link" href="/ong?id=${encodeURIComponent(org.id)}">Ver portal <i class="bx bx-link-external"></i></a>`
                : `<span class="astro-portal-link is-disabled">Portal próximo</span>`;
            return `<article class="astro-org-row"><div class="astro-org-name">${logoMarkup(org)}<span><strong>${org.name}</strong><small>${publicOrg?.region || "Organización afiliada"}</small></span></div><div class="astro-representative"><i class="bx bx-user"></i><span><strong>${org.representative}</strong><small>${org.role}</small></span></div>${email}<div class="astro-ods">${org.ods.map(number => `<span title="ODS ${number}">${number}</span>`).join("")}</div>${portal}</article>`;
        }).join("");
        orgCount.textContent = `${filtered.length} ${filtered.length === 1 ? "organización" : "organizaciones"}`;
    }

    function renderServices() {
        serviceGrid.innerHTML = services.map(service => {
            const available = currentOrg.participation >= service.level;
            return `<article class="astro-service-card ${available ? "" : "is-locked"}"><div class="astro-service-card-top"><span class="astro-service-icon"><i class="bx ${service.icon}"></i></span><span class="astro-service-status"><i class="bx ${available ? "bx-check" : "bx-lock-alt"}"></i>${available ? "Disponible" : `Requiere ${service.level}%`}</span></div><span class="astro-service-group">${service.group}</span><h3>${service.title}</h3><p>${service.description}</p><button type="button" data-service="${service.id}">${available ? service.action : "Cómo desbloquear"}<i class="bx ${available ? "bx-right-arrow-alt" : "bx-lock-alt"}"></i></button></article>`;
        }).join("");
        serviceGrid.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => {
            const service = services.find(item => item.id === button.dataset.service);
            if (currentOrg.participation < service.level) {
                byId("nivel").scrollIntoView({ behavior: "smooth" });
                showToast(`Este servicio se habilita desde ${service.level}% de participación.`);
            } else openService(service);
        }));
    }

    function openService(service) {
        currentService = service;
        modalAction.dataset.request = "false";
        byId("modalIcon").className = `bx ${service.icon}`;
        byId("modalGroup").textContent = service.group;
        byId("modalTitle").textContent = service.title;
        byId("modalDescription").textContent = service.description;
        const detail = byId("modalDetail");
        if (service.id === "cuentas") {
            detail.innerHTML = currentOrg.email ? `<strong>Cuenta institucional</strong>${currentOrg.email}<br><small>Las contraseñas nunca se muestran ni se almacenan en Astropedia.</small>` : "La cuenta institucional está pendiente de asignación.";
            modalAction.href = currentOrg.email ? `mailto:info@redastrum.org?subject=Soporte%20para%20${encodeURIComponent(currentOrg.email)}` : "mailto:info@redastrum.org?subject=Asignación%20de%20cuenta%20institucional";
            modalAction.innerHTML = "Solicitar soporte <i class='bx bx-right-arrow-alt'></i>";
        } else if (service.id === "gastrum") {
            detail.innerHTML = "<strong>Comunidad G-Astrum</strong>Explora los clubes y espacios de integración disponibles.";
            modalAction.href = "/g-astrum";
            modalAction.innerHTML = "Abrir G-Astrum <i class='bx bx-right-arrow-alt'></i>";
        } else {
            detail.innerHTML = `<strong>Solicitud institucional</strong>La solicitud se registrará a nombre de ${currentOrg.name} para que el equipo de Red Astrum pueda revisarla.`;
            modalAction.href = "#";
            modalAction.dataset.request = "true";
            modalAction.innerHTML = "Enviar solicitud <i class='bx bx-send'></i>";
        }
        modal.hidden = false;
    }

    async function submitServiceRequest(event) {
        if (modalAction.dataset.request !== "true" || modalAction.getAttribute("aria-disabled") === "true") return;
        event.preventDefault();
        modalAction.setAttribute("aria-disabled", "true");
        modalAction.innerHTML = "Enviando… <i class='bx bx-loader-alt bx-spin'></i>";
        const { error } = await db.from("service_requests").insert({ organization_id: currentOrg.databaseId, service_id: currentService.id, requested_by: currentUser.id });
        modalAction.removeAttribute("aria-disabled");
        if (error) {
            modalAction.innerHTML = "Reintentar solicitud <i class='bx bx-refresh'></i>";
            showToast("No se pudo registrar la solicitud. Inténtalo nuevamente.");
        } else {
            modal.hidden = true;
            showToast("Solicitud registrada correctamente.");
        }
    }

    function enterPlatform() {
        login.hidden = true;
        app.hidden = false;
        scrollTo({ top: 0 });
        renderProfile();
        renderOrganizations();
        renderServices();
    }

    async function loadPortal(user) {
        currentUser = user;
        const [profile, directory, catalog] = await Promise.all([
            db.from("organizations").select("*").eq("auth_user_id", user.id).maybeSingle(),
            db.from("organizations").select("*").eq("active", true).order("name"),
            db.from("services").select("*").eq("active", true).order("sort_order")
        ]);
        if (profile.error || !profile.data) {
            await db.auth.signOut();
            errorBox.textContent = "La cuenta existe, pero todavía no está vinculada a una organización de Astropedia.";
            return;
        }
        if (directory.error || catalog.error) {
            errorBox.textContent = "No pudimos cargar los datos de Astropedia. Inténtalo nuevamente.";
            return;
        }
        orgs = directory.data.map(mapOrg);
        services = catalog.data.map(mapService);
        currentOrg = mapOrg(profile.data);
        enterPlatform();
    }

    form.addEventListener("submit", async event => {
        event.preventDefault();
        errorBox.textContent = "";
        if (!db) return void (errorBox.textContent = "La conexión segura no está disponible. Contacta a soporte.");
        if (recoveryMode) {
            if (passwordInput.value.length < 8) return void (errorBox.textContent = "La nueva contraseña debe tener al menos 8 caracteres.");
            setLoading(true);
            const { error } = await db.auth.updateUser({ password: passwordInput.value });
            if (error) {
                errorBox.textContent = "No pudimos actualizar la contraseña. Solicita un nuevo enlace.";
                return setLoading(false);
            }
            await db.auth.signOut();
            resetLoginView();
            errorBox.textContent = "Contraseña actualizada. Ya puedes iniciar sesión.";
            return;
        }
        setLoading(true);
        const { data, error } = await db.auth.signInWithPassword({ email: emailInput.value.trim().toLowerCase(), password: passwordInput.value });
        if (error || !data.user) {
            errorBox.textContent = "Correo o contraseña incorrectos.";
            return setLoading(false);
        }
        await loadPortal(data.user);
        setLoading(false);
    });

    resetButton.addEventListener("click", async event => {
        event.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        if (!email) {
            errorBox.textContent = "Escribe primero tu correo institucional.";
            return emailInput.focus();
        }
        resetButton.setAttribute("aria-disabled", "true");
        const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: "https://www.redastrum.org/astropedia" });
        resetButton.removeAttribute("aria-disabled");
        errorBox.textContent = error ? "No pudimos enviar el enlace. Verifica el correo e inténtalo nuevamente." : "Si la cuenta está habilitada, recibirás un enlace para cambiar la contraseña.";
    });

    byId("togglePassword").addEventListener("click", event => {
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";
        event.currentTarget.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
        event.currentTarget.querySelector("i").className = `bx ${show ? "bx-hide" : "bx-show"}`;
    });
    byId("logoutButton").addEventListener("click", async () => {
        await db.auth.signOut();
        currentUser = currentOrg = null;
        app.hidden = true;
        login.hidden = false;
        resetLoginView();
        byId("assistantPanel").hidden = true;
        scrollTo({ top: 0 });
    });
    modalAction.addEventListener("click", submitServiceRequest);
    byId("orgSearch").addEventListener("input", event => renderOrganizations(event.target.value));
    byId("closeModal").addEventListener("click", () => { modal.hidden = true; });
    modal.addEventListener("click", event => { if (event.target === modal) modal.hidden = true; });

    const assistant = byId("assistantPanel");
    const assistantAnswer = byId("assistantAnswer");
    const assistantQuestions = byId("assistantQuestions");
    function selectQuestion(index) {
        const item = faq[index];
        assistantAnswer.innerHTML = `<strong>${item.question}</strong>${item.answer}`;
        assistantQuestions.querySelectorAll("button").forEach((button, i) => button.classList.toggle("is-active", i === index));
    }
    assistantQuestions.innerHTML = faq.map((item, index) => `<button type="button" data-question="${index}"><span>${item.question}</span><i class="bx bx-chevron-right"></i></button>`).join("");
    assistantQuestions.querySelectorAll("button").forEach(button => button.addEventListener("click", () => selectQuestion(Number(button.dataset.question))));
    if (faq.length) selectQuestion(0);
    byId("assistantButton").addEventListener("click", () => { assistant.hidden = !assistant.hidden; });
    byId("closeAssistant").addEventListener("click", () => { assistant.hidden = true; });

    const sections = [...document.querySelectorAll(".astro-app section[id]")];
    const navLinks = [...document.querySelectorAll(".astro-topbar nav a")];
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
        }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.25] });
        sections.forEach(section => observer.observe(section));
    }

    if (!db) return void (errorBox.textContent = "La conexión segura no está disponible. Contacta a soporte.");
    db.auth.onAuthStateChange((event, session) => { if (event === "PASSWORD_RECOVERY") setRecoveryMode(session?.user); });
    db.auth.getSession().then(({ data }) => { if (data.session && !recoveryMode) loadPortal(data.session.user); });
})();
