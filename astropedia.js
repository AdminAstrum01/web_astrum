(() => {
    "use strict";

    const faq = window.ASTROPEDIA_FAQ || [];
    const publicOrgs = typeof ONGS !== "undefined" ? ONGS : [];
    const config = window.ASTROPEDIA_CONFIG || {};
    const ORGANIZATION_COLUMNS = "id,slug,name,representative_name,representative_role,representative_email,representative_phone,institutional_email,account_group,participation,ods,active,created_at,updated_at";
    const ACCOUNT_TYPES = [
        { id: "zoom", title: "Cuenta de Zoom", icon: "bxl-zoom" },
        { id: "google_ai_pro", title: "Cuenta de Google AI Pro", icon: "bx-sparkles" },
        { id: "organization_email", title: "Cuenta de la ONG", icon: "bx-buildings" },
        { id: "representative_email", title: "Cuenta del representante", icon: "bx-user" }
    ];
    const initialQuery = new URLSearchParams(window.location.search);
    const initialHash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const initialFlowType = initialQuery.get("type") || initialHash.get("type");
    let passwordSetupIntent =
        initialQuery.get("setup") === "password" ||
        initialHash.get("setup") === "password" ||
        initialQuery.has("code") ||
        ["invite", "recovery", "signup"].includes(initialFlowType);

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
    const adminSection = byId("administracion");
    const adminNav = byId("adminNav");
    const adminOrganizationModal = byId("adminOrganizationModal");
    const adminServiceModal = byId("adminServiceModal");

    let orgs = [];
    let services = [];
    let serviceActions = [];
    let organizationAccounts = [];
    let serviceRequests = [];
    let currentOrg = null;
    let currentUser = null;
    let currentService = null;
    let currentRole = null;
    let recoveryMode = false;

    const normalize = (value = "") => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const initials = (name = "") => String(name).split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
    const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));
    const getPublicOrg = id => publicOrgs.find(org => org.id === id) || null;
    const isAdmin = () => currentRole === "admin";
    const whatsappUrl = (number, message) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    const normalizePhone = value => String(value || "").replace(/\D/g, "");
    const fillActionTemplate = template => String(template || "")
        .replaceAll("{organization}", currentOrg?.name || "mi organización")
        .replaceAll("{representative}", currentOrg?.representative || "representante")
        .replaceAll("{service}", currentService?.title || "el servicio");
    const getServiceAction = serviceId => serviceActions.find(action => action.serviceId === serviceId && action.active) || null;

    const mapOrg = row => ({
        databaseId: row.id,
        id: row.slug,
        name: row.name,
        representative: row.representative_name || "Representante por confirmar",
        role: row.representative_role || "",
        representativeEmail: row.representative_email || "",
        phone: row.representative_phone || "",
        email: row.institutional_email || "",
        accountGroup: row.account_group ? Number(row.account_group) : null,
        participation: Number(row.participation),
        ods: Array.isArray(row.ods) ? row.ods.map(Number).filter(Number.isFinite) : [],
        active: row.active !== false
    });

    const mapService = row => ({
        id: row.id,
        icon: row.icon || "bx-grid-alt",
        title: row.title,
        description: row.description,
        level: Number(row.minimum_participation),
        group: row.service_group,
        action: row.action_label,
        active: row.active !== false,
        sortOrder: Number(row.sort_order || 0)
    });

    const mapServiceAction = row => ({
        serviceId: row.service_id,
        actionType: row.action_type,
        actionUrl: row.action_url || "",
        whatsappNumber: row.whatsapp_number || "",
        detail: row.detail || "",
        messageTemplate: row.message_template || "",
        buttonLabel: row.button_label || "Continuar",
        active: row.active !== false
    });

    const mapAccount = row => ({
        type: row.account_type,
        title: row.title,
        email: row.login_email || "",
        url: row.login_url || "",
        active: row.active !== false,
        sortOrder: Number(row.sort_order || 0)
    });

    function clearAuthCallbackUrl() {
        const cleanUrl = new URL(window.location.href);
        ["code", "type", "setup"].forEach(parameter => cleanUrl.searchParams.delete(parameter));
        cleanUrl.hash = "";
        window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
    }

    function openPasswordSetup(user) {
        passwordSetupIntent = false;
        clearAuthCallbackUrl();
        setRecoveryMode(user);
    }

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
        if (isAdmin()) {
            byId("accountAvatar").textContent = "RA";
            byId("accountName").textContent = "Red Astrum";
            byId("accountLevel").textContent = "Administrador";
            byId("welcomeName").textContent = "Administración Red Astrum";
            byId("participationValue").textContent = "ADMIN";
            byId("progressRing").querySelector("small").textContent = "Rol";
            byId("progressRing").style.setProperty("--progress", "360deg");
            byId("levelPill").innerHTML = "<i class='bx bx-shield-quarter'></i> Administración";
            byId("levelMessage").textContent = "Gestión central de Astropedia";
            byId("levelDescription").textContent = "Administra organizaciones, servicios y solicitudes desde un único espacio seguro.";
            document.querySelectorAll(".astro-levels article").forEach(card => {
                card.classList.remove("is-current");
                card.removeAttribute("aria-current");
            });
            return;
        }

        const level = integrationLevel(currentOrg.participation);
        byId("accountAvatar").textContent = initials(currentOrg.name);
        byId("accountName").textContent = currentOrg.name;
        byId("accountLevel").textContent = level.name;
        byId("welcomeName").textContent = currentOrg.name;
        byId("participationValue").textContent = currentOrg.participation + "%";
        byId("progressRing").querySelector("small").textContent = "Participación";
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
        const fallback = escapeHtml(initials(org.name));
        return publicOrg?.logo
            ? `<span class="astro-org-logo"><img src="${escapeHtml(publicOrg.logo)}" alt="Logo de ${escapeHtml(org.name)}" loading="lazy"></span>`
            : `<span class="astro-org-logo">${fallback}</span>`;
    }

    function renderOrganizations(query = "") {
        const filtered = orgs
            .filter(org => org.active)
            .filter(org => normalize([org.name, org.representative, org.role, org.email, org.phone, org.ods.join(" ")].join(" ")).includes(normalize(query)));

        orgList.innerHTML = filtered.map(org => {
            const publicOrg = getPublicOrg(org.id);
            const phoneNumber = normalizePhone(org.phone);
            const phone = phoneNumber
                ? `<a href="${whatsappUrl(phoneNumber, `Hola, ${org.representative}. Me comunico desde Astropedia para conversar con ${org.name}.`)}" target="_blank" rel="noopener noreferrer"><i class="bx bxl-whatsapp"></i><span>${escapeHtml(org.phone)}</span></a>`
                : '<span class="is-empty"><i class="bx bxl-whatsapp"></i><span>Teléfono por asignar</span></span>';
            const email = org.email
                ? `<a href="mailto:${encodeURIComponent(org.email)}"><i class="bx bx-envelope"></i><span>${escapeHtml(org.email)}</span></a>`
                : '<span class="is-empty"><i class="bx bx-envelope"></i><span>Correo por asignar</span></span>';
            const contact = `<div class="astro-org-contact">${phone}${email}</div>`;
            const portal = publicOrg
                ? `<a class="astro-portal-link" href="/ong?id=${encodeURIComponent(org.id)}">Ver portal <i class="bx bx-link-external"></i></a>`
                : '<span class="astro-portal-link is-disabled">Portal próximo</span>';
            return `<article class="astro-org-row"><div class="astro-org-name">${logoMarkup(org)}<span><strong>${escapeHtml(org.name)}</strong><small>${escapeHtml(publicOrg?.region || "Organización afiliada")}</small></span></div><div class="astro-representative"><i class="bx bx-user"></i><span><strong>${escapeHtml(org.representative)}</strong><small>${escapeHtml(org.role)}</small></span></div>${contact}<div class="astro-ods">${org.ods.map(number => `<span title="ODS ${number}">${number}</span>`).join("")}</div>${portal}</article>`;
        }).join("");

        orgCount.textContent = `${filtered.length} ${filtered.length === 1 ? "organización" : "organizaciones"}`;
    }

    function renderServices() {
        serviceGrid.innerHTML = services.filter(service => service.active || isAdmin()).map(service => {
            const available = isAdmin() || currentOrg.participation >= service.level;
            const action = isAdmin() ? "Editar servicio" : available ? service.action : "Cómo desbloquear";
            return `<article class="astro-service-card ${available ? "" : "is-locked"}"><div class="astro-service-card-top"><span class="astro-service-icon"><i class="bx ${escapeHtml(service.icon)}"></i></span><span class="astro-service-status"><i class="bx ${available ? "bx-check" : "bx-lock-alt"}"></i>${isAdmin() ? (service.active ? "Activo" : "Inactivo") : available ? "Disponible" : `Requiere ${service.level}%`}</span></div><span class="astro-service-group">${escapeHtml(service.group)}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p><button type="button" data-service="${escapeHtml(service.id)}">${escapeHtml(action)}<i class="bx ${isAdmin() ? "bx-edit-alt" : available ? "bx-right-arrow-alt" : "bx-lock-alt"}"></i></button></article>`;
        }).join("");

        serviceGrid.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => {
            const service = services.find(item => item.id === button.dataset.service);
            if (isAdmin()) return openAdminService(service);
            if (currentOrg.participation < service.level) {
                byId("nivel").scrollIntoView({ behavior: "smooth" });
                showToast(`Este servicio se habilita desde ${service.level}% de participación.`);
            } else openService(service);
        }));
    }

    function openService(service) {
        currentService = service;
        const action = getServiceAction(service.id);
        modalAction.dataset.request = "false";
        modalAction.removeAttribute("target");
        modalAction.removeAttribute("rel");
        byId("modalIcon").className = `bx ${service.icon}`;
        byId("modalGroup").textContent = service.group;
        byId("modalTitle").textContent = service.title;
        byId("modalDescription").textContent = service.description;
        const detail = byId("modalDetail");
        if (service.id === "cuentas") {
            const accountRows = ACCOUNT_TYPES.map(type => {
                const account = organizationAccounts.find(item => item.type === type.id && item.active);
                const content = account?.email
                    ? `<strong>${escapeHtml(account.title || type.title)}</strong><small>${escapeHtml(account.email)}</small>`
                    : `<strong>${escapeHtml(type.title)}</strong><small>Pendiente de asignación</small>`;
                return account?.url && account?.email
                    ? `<a class="astro-account-resource" href="${escapeHtml(account.url)}" target="_blank" rel="noopener noreferrer"><i class="bx ${escapeHtml(type.icon)}"></i><span>${content}</span><i class="bx bx-link-external"></i></a>`
                    : `<span class="astro-account-resource is-pending"><i class="bx ${escapeHtml(type.icon)}"></i><span>${content}</span><i class="bx bx-time-five"></i></span>`;
            }).join("");
            detail.innerHTML = `<div class="astro-account-list">${accountRows}</div><p class="astro-security-note"><i class="bx bx-shield-quarter"></i> Astropedia muestra únicamente los correos de acceso. Las contraseñas no se almacenan ni se revelan aquí.</p>`;
            modalAction.href = `mailto:info@redastrum.org?subject=Soporte%20de%20herramientas%20digitales%20-%20${encodeURIComponent(currentOrg.name)}`;
            modalAction.innerHTML = "Solicitar soporte <i class='bx bx-right-arrow-alt'></i>";
        } else if (action?.actionType === "whatsapp") {
            detail.innerHTML = `<strong>Atención directa por WhatsApp</strong>${escapeHtml(action.detail)}`;
            modalAction.href = whatsappUrl(normalizePhone(action.whatsappNumber), fillActionTemplate(action.messageTemplate));
            modalAction.target = "_blank";
            modalAction.rel = "noopener noreferrer";
            modalAction.innerHTML = `${escapeHtml(action.buttonLabel)} <i class='bx bxl-whatsapp'></i>`;
        } else if (action && ["form", "whatsapp_group", "external"].includes(action.actionType)) {
            const heading = action.actionType === "form" ? "Formulario oficial" : action.actionType === "whatsapp_group" ? "Comunidad G-Astrum" : "Proyecto activo";
            detail.innerHTML = `<strong>${heading}</strong>${escapeHtml(action.detail)}`;
            modalAction.href = action.actionUrl;
            if (/^https?:\/\//i.test(action.actionUrl)) {
                modalAction.target = "_blank";
                modalAction.rel = "noopener noreferrer";
            }
            const icon = action.actionType === "whatsapp_group" ? "bxl-whatsapp" : "bx-link-external";
            modalAction.innerHTML = `${escapeHtml(action.buttonLabel)} <i class='bx ${icon}'></i>`;
        } else {
            detail.innerHTML = `<strong>Solicitud institucional</strong>La solicitud se registrará a nombre de ${escapeHtml(currentOrg.name)} para que el equipo de Red Astrum pueda revisarla.`;
            modalAction.href = "#";
            modalAction.dataset.request = "true";
            modalAction.innerHTML = "Enviar solicitud <i class='bx bx-send'></i>";
        }
        modal.hidden = false;
    }

    async function submitServiceRequest(event) {
        if (isAdmin() || modalAction.dataset.request !== "true" || modalAction.getAttribute("aria-disabled") === "true") return;
        event.preventDefault();
        modalAction.setAttribute("aria-disabled", "true");
        modalAction.innerHTML = "Enviando… <i class='bx bx-loader-alt bx-spin'></i>";
        const { error } = await db.from("service_requests").insert({
            organization_id: currentOrg.databaseId,
            service_id: currentService.id,
            requested_by: currentUser.id
        });
        modalAction.removeAttribute("aria-disabled");
        if (error) {
            modalAction.innerHTML = "Reintentar solicitud <i class='bx bx-refresh'></i>";
            showToast("No se pudo registrar la solicitud. Inténtalo nuevamente.");
        } else {
            modal.hidden = true;
            showToast("Solicitud registrada correctamente.");
        }
    }

    function renderAdminOrganizations(query = "") {
        const filtered = orgs.filter(org => normalize([org.name, org.representative, org.email].join(" ")).includes(normalize(query)));
        byId("adminOrganizationList").innerHTML = filtered.length ? filtered.map(org => `
            <article class="astro-admin-row astro-admin-org-grid">
                <span><strong>${escapeHtml(org.name)}</strong><small>${escapeHtml(org.email || "Sin correo institucional")}</small></span>
                <span><strong>${escapeHtml(org.representative)}</strong><small>${escapeHtml(org.role || "Cargo por confirmar")}</small></span>
                <span><strong>${org.participation}%</strong><small>${escapeHtml(integrationLevel(org.participation).name)}</small></span>
                <span class="astro-admin-status ${org.active ? "is-active" : "is-inactive"}">${org.active ? "Activa" : "Inactiva"}</span>
                <button class="astro-admin-edit" type="button" data-admin-org="${escapeHtml(org.databaseId)}"><i class="bx bx-edit-alt"></i> Editar</button>
            </article>`).join("") : '<p class="astro-admin-empty">No se encontraron organizaciones.</p>';

        byId("adminOrganizationList").querySelectorAll("[data-admin-org]").forEach(button => {
            button.addEventListener("click", () => openAdminOrganization(orgs.find(org => org.databaseId === button.dataset.adminOrg)));
        });
    }

    function renderAdminServices() {
        byId("adminServiceList").innerHTML = services.length ? services.map(service => `
            <article class="astro-admin-row astro-admin-service-grid">
                <span><strong>${escapeHtml(service.title)}</strong><small>${escapeHtml(service.description)}</small></span>
                <span>${escapeHtml(service.group)}</span>
                <span><strong>${service.level}%</strong></span>
                <span class="astro-admin-status ${service.active ? "is-active" : "is-inactive"}">${service.active ? "Activo" : "Inactivo"}</span>
                <button class="astro-admin-edit" type="button" data-admin-service="${escapeHtml(service.id)}"><i class="bx bx-edit-alt"></i> Editar</button>
            </article>`).join("") : '<p class="astro-admin-empty">No hay servicios registrados.</p>';

        byId("adminServiceList").querySelectorAll("[data-admin-service]").forEach(button => {
            button.addEventListener("click", () => openAdminService(services.find(service => service.id === button.dataset.adminService)));
        });
    }

    function requestStatusLabel(status) {
        return {
            pending: "Pendiente",
            reviewing: "En revisión",
            approved: "Aprobada",
            rejected: "Rechazada",
            completed: "Completada"
        }[status] || status;
    }

    function renderAdminRequests() {
        byId("adminRequestList").innerHTML = serviceRequests.length ? serviceRequests.map(request => {
            const organizationName = request.organization?.name || orgs.find(org => org.databaseId === request.organization_id)?.name || "Organización";
            const serviceTitle = request.service?.title || services.find(service => service.id === request.service_id)?.title || "Servicio";
            const options = ["pending", "reviewing", "approved", "rejected", "completed"].map(status => `<option value="${status}" ${status === request.status ? "selected" : ""}>${requestStatusLabel(status)}</option>`).join("");
            return `<article class="astro-admin-row astro-admin-request-grid">
                <span><strong>${escapeHtml(organizationName)}</strong><small>${escapeHtml(request.message || "Sin mensaje adicional")}</small></span>
                <span>${escapeHtml(serviceTitle)}</span>
                <span>${new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(request.created_at))}</span>
                <select data-request-status="${escapeHtml(request.id)}" aria-label="Estado de la solicitud">${options}</select>
                <button class="astro-admin-edit" type="button" data-save-request="${escapeHtml(request.id)}"><i class="bx bx-save"></i> Guardar</button>
            </article>`;
        }).join("") : '<p class="astro-admin-empty">Todavía no hay solicitudes registradas.</p>';

        byId("adminRequestList").querySelectorAll("[data-save-request]").forEach(button => {
            button.addEventListener("click", () => updateRequestStatus(button.dataset.saveRequest));
        });
    }

    function renderAdminPanel() {
        if (!isAdmin()) return;
        byId("adminOrganizationCount").textContent = orgs.length;
        byId("adminActiveCount").textContent = orgs.filter(org => org.active).length;
        byId("adminRequestCount").textContent = serviceRequests.filter(request => ["pending", "reviewing"].includes(request.status)).length;
        renderAdminOrganizations(byId("adminOrgSearch").value);
        renderAdminServices();
        renderAdminRequests();
    }

    function openAdminOrganization(org) {
        if (!org) return;
        byId("adminOrganizationId").value = org.databaseId;
        byId("adminOrganizationName").value = org.name;
        byId("adminOrganizationEmail").value = org.email;
        byId("adminRepresentativeName").value = org.representative === "Representante por confirmar" ? "" : org.representative;
        byId("adminRepresentativeRole").value = org.role;
        byId("adminRepresentativeEmail").value = org.representativeEmail;
        byId("adminRepresentativePhone").value = org.phone;
        byId("adminAccountGroup").value = org.accountGroup || "";
        byId("adminParticipation").value = org.participation;
        byId("adminOds").value = org.ods.join(", ");
        byId("adminOrganizationActive").checked = org.active;
        byId("adminOrganizationError").textContent = "";
        adminOrganizationModal.hidden = false;
    }

    function openAdminService(service) {
        if (!service) return;
        byId("adminServiceId").value = service.id;
        byId("adminServiceName").value = service.title;
        byId("adminServiceGroup").value = service.group;
        byId("adminServiceDescription").value = service.description;
        byId("adminServiceAction").value = service.action;
        byId("adminServiceParticipation").value = service.level;
        byId("adminServiceActive").checked = service.active;
        const action = getServiceAction(service.id);
        byId("adminServiceActionType").value = action?.actionType || "request";
        byId("adminServiceActionUrl").value = action?.actionUrl || "";
        byId("adminServiceWhatsapp").value = action?.whatsappNumber || "";
        byId("adminServiceDetail").value = action?.detail || "";
        byId("adminServiceMessage").value = action?.messageTemplate || "";
        byId("adminServiceError").textContent = "";
        adminServiceModal.hidden = false;
    }

    async function saveAdminOrganization(event) {
        event.preventDefault();
        if (!isAdmin()) return;
        const errorTarget = byId("adminOrganizationError");
        const participation = Number(byId("adminParticipation").value);
        const ods = [...new Set(byId("adminOds").value.split(",").map(value => Number(value.trim())).filter(value => Number.isInteger(value) && value >= 1 && value <= 17))];
        if (participation < 20 || participation > 100) {
            errorTarget.textContent = "La participación debe estar entre 20% y 100%.";
            return;
        }

        const submit = event.currentTarget.querySelector("button[type='submit']");
        submit.disabled = true;
        const { error } = await db.from("organizations").update({
            name: byId("adminOrganizationName").value.trim(),
            institutional_email: byId("adminOrganizationEmail").value.trim().toLowerCase() || null,
            representative_name: byId("adminRepresentativeName").value.trim() || null,
            representative_role: byId("adminRepresentativeRole").value.trim() || null,
            representative_email: byId("adminRepresentativeEmail").value.trim().toLowerCase() || null,
            representative_phone: byId("adminRepresentativePhone").value.trim() || null,
            account_group: Number(byId("adminAccountGroup").value) || null,
            participation,
            ods,
            active: byId("adminOrganizationActive").checked
        }).eq("id", byId("adminOrganizationId").value);
        submit.disabled = false;

        if (error) {
            errorTarget.textContent = error.code === "23505" ? "Ese correo institucional ya pertenece a otra organización." : "No se pudo guardar la organización.";
            return;
        }

        adminOrganizationModal.hidden = true;
        await reloadAdminData();
        showToast("Organización actualizada correctamente.");
    }

    async function saveAdminService(event) {
        event.preventDefault();
        if (!isAdmin()) return;
        const errorTarget = byId("adminServiceError");
        const minimumParticipation = Number(byId("adminServiceParticipation").value);
        if (minimumParticipation < 20 || minimumParticipation > 100) {
            errorTarget.textContent = "El requisito debe estar entre 20% y 100%.";
            return;
        }

        const submit = event.currentTarget.querySelector("button[type='submit']");
        submit.disabled = true;
        const serviceUpdate = await db.from("services").update({
            title: byId("adminServiceName").value.trim(),
            service_group: byId("adminServiceGroup").value.trim(),
            description: byId("adminServiceDescription").value.trim(),
            action_label: byId("adminServiceAction").value.trim(),
            minimum_participation: minimumParticipation,
            active: byId("adminServiceActive").checked
        }).eq("id", byId("adminServiceId").value);
        const actionUpdate = serviceUpdate.error ? { error: serviceUpdate.error } : await db.from("service_actions").upsert({
            service_id: byId("adminServiceId").value,
            action_type: byId("adminServiceActionType").value,
            action_url: byId("adminServiceActionUrl").value.trim() || null,
            whatsapp_number: byId("adminServiceWhatsapp").value.trim() || null,
            detail: byId("adminServiceDetail").value.trim() || null,
            message_template: byId("adminServiceMessage").value.trim() || null,
            button_label: byId("adminServiceAction").value.trim(),
            active: byId("adminServiceActive").checked,
            updated_at: new Date().toISOString()
        }, { onConflict: "service_id" });
        submit.disabled = false;

        if (serviceUpdate.error || actionUpdate.error) {
            errorTarget.textContent = "No se pudo guardar el servicio.";
            return;
        }

        adminServiceModal.hidden = true;
        await reloadAdminData();
        showToast("Servicio actualizado correctamente.");
    }

    async function updateRequestStatus(requestId) {
        if (!isAdmin()) return;
        const select = byId("adminRequestList").querySelector(`[data-request-status="${CSS.escape(requestId)}"]`);
        const button = byId("adminRequestList").querySelector(`[data-save-request="${CSS.escape(requestId)}"]`);
        button.disabled = true;
        const { error } = await db.from("service_requests").update({ status: select.value }).eq("id", requestId);
        button.disabled = false;
        if (error) return showToast("No se pudo actualizar la solicitud.");
        const request = serviceRequests.find(item => item.id === requestId);
        if (request) request.status = select.value;
        renderAdminPanel();
        showToast("Estado de la solicitud actualizado.");
    }

    async function fetchDirectoryAndServices() {
        const [directory, catalog, actions] = await Promise.all([
            db.from("organizations").select(ORGANIZATION_COLUMNS).order("name"),
            db.from("services").select("*").order("sort_order"),
            db.from("service_actions").select("*")
        ]);
        if (directory.error || catalog.error || actions.error) throw new Error("portal_data_unavailable");
        orgs = directory.data.map(mapOrg);
        services = catalog.data.map(mapService);
        serviceActions = actions.data.map(mapServiceAction);
    }

    async function reloadAdminData() {
        await fetchDirectoryAndServices();
        const requests = await db.from("service_requests")
            .select("id,organization_id,service_id,status,message,created_at,organization:organizations(name),service:services(title)")
            .order("created_at", { ascending: false })
            .limit(100);
        if (requests.error) throw new Error("admin_requests_unavailable");
        serviceRequests = requests.data;
        renderOrganizations();
        renderServices();
        renderAdminPanel();
    }

    function enterPlatform() {
        const admin = isAdmin();
        login.hidden = true;
        app.hidden = false;
        adminSection.hidden = !admin;
        adminNav.hidden = !admin;
        document.body.classList.toggle("is-astropedia-admin", admin);
        scrollTo({ top: 0 });
        renderProfile();
        renderOrganizations();
        renderServices();
        if (admin) renderAdminPanel();
    }

    async function loadPortal(user) {
        currentUser = user;
        errorBox.textContent = "";
        const membershipResult = await db.from("organization_users")
            .select("role,organization_id,active")
            .eq("user_id", user.id)
            .maybeSingle();

        if (membershipResult.error || !membershipResult.data?.active) {
            await db.auth.signOut();
            errorBox.textContent = "La cuenta existe, pero todavía no tiene un acceso activo en Astropedia.";
            return;
        }

        currentRole = membershipResult.data.role;
        try {
            await fetchDirectoryAndServices();
            if (isAdmin()) {
                currentOrg = {
                    databaseId: null,
                    id: "red-astrum-admin",
                    name: "Administración Red Astrum",
                    representative: "",
                    role: "Administrador",
                    representativeEmail: user.email || "",
                    phone: "",
                    email: user.email || "",
                    accountGroup: null,
                    participation: 100,
                    ods: [],
                    active: true
                };
                const requests = await db.from("service_requests")
                    .select("id,organization_id,service_id,status,message,created_at,organization:organizations(name),service:services(title)")
                    .order("created_at", { ascending: false })
                    .limit(100);
                if (requests.error) throw new Error("admin_requests_unavailable");
                serviceRequests = requests.data;
            } else {
                const profile = await db.from("organizations")
                    .select(ORGANIZATION_COLUMNS)
                    .eq("id", membershipResult.data.organization_id)
                    .maybeSingle();
                if (profile.error || !profile.data) throw new Error("organization_unavailable");
                currentOrg = mapOrg(profile.data);
                const accounts = await db.from("organization_accounts")
                    .select("account_type,title,login_email,login_url,sort_order,active")
                    .eq("organization_id", currentOrg.databaseId)
                    .order("sort_order");
                if (accounts.error) throw new Error("organization_accounts_unavailable");
                organizationAccounts = accounts.data.map(mapAccount);
            }
            enterPlatform();
        } catch {
            await db.auth.signOut();
            errorBox.textContent = "No pudimos cargar los datos autorizados de Astropedia. Contacta a soporte.";
        }
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
                errorBox.textContent = error.code === "weak_password" ? "La contraseña no cumple los requisitos de seguridad." : "El enlace venció o no es válido. Solicita uno nuevo.";
                return setLoading(false);
            }
            await db.auth.signOut();
            resetLoginView();
            errorBox.textContent = "Contraseña actualizada. Ya puedes iniciar sesión.";
            return;
        }

        setLoading(true);
        const { data, error } = await db.auth.signInWithPassword({
            email: emailInput.value.trim().toLowerCase(),
            password: passwordInput.value
        });
        if (error || !data.user) {
            const invalidProjectConfiguration = /api key|apikey|jwt/i.test(error?.message || "");
            errorBox.textContent = invalidProjectConfiguration
                ? "La conexión de Astropedia con Supabase está desactualizada. Contacta a soporte."
                : error?.code === "email_not_confirmed"
                    ? "Debes confirmar primero el correo de esta cuenta."
                    : "Correo o contraseña incorrectos.";
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
        const redirectTo = new URL("/astropedia?setup=password", window.location.origin).toString();
        const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
        resetButton.removeAttribute("aria-disabled");
        if (error?.status === 429 || error?.code === "over_email_send_rate_limit") {
            errorBox.textContent = "Se alcanzó temporalmente el límite de correos. Espera unos minutos antes de reintentar.";
        } else {
            errorBox.textContent = error
                ? "No pudimos enviar el enlace de recuperación."
                : "Si la cuenta está habilitada, recibirás un enlace para cambiar la contraseña.";
        }
    });

    byId("togglePassword").addEventListener("click", event => {
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";
        event.currentTarget.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
        event.currentTarget.querySelector("i").className = `bx ${show ? "bx-hide" : "bx-show"}`;
    });

    byId("logoutButton").addEventListener("click", async () => {
        await db.auth.signOut();
        currentUser = currentOrg = currentRole = null;
        orgs = [];
        services = [];
        serviceActions = [];
        organizationAccounts = [];
        serviceRequests = [];
        app.hidden = true;
        login.hidden = false;
        adminSection.hidden = true;
        adminNav.hidden = true;
        document.body.classList.remove("is-astropedia-admin");
        resetLoginView();
        byId("assistantPanel").hidden = true;
        scrollTo({ top: 0 });
    });

    modalAction.addEventListener("click", submitServiceRequest);
    byId("orgSearch").addEventListener("input", event => renderOrganizations(event.target.value));
    byId("adminOrgSearch").addEventListener("input", event => renderAdminOrganizations(event.target.value));
    byId("closeModal").addEventListener("click", () => { modal.hidden = true; });
    modal.addEventListener("click", event => { if (event.target === modal) modal.hidden = true; });
    byId("adminOrganizationForm").addEventListener("submit", saveAdminOrganization);
    byId("adminServiceForm").addEventListener("submit", saveAdminService);
    byId("closeAdminOrganizationModal").addEventListener("click", () => { adminOrganizationModal.hidden = true; });
    byId("closeAdminServiceModal").addEventListener("click", () => { adminServiceModal.hidden = true; });
    adminOrganizationModal.addEventListener("click", event => { if (event.target === adminOrganizationModal) adminOrganizationModal.hidden = true; });
    adminServiceModal.addEventListener("click", event => { if (event.target === adminServiceModal) adminServiceModal.hidden = true; });

    const assistant = byId("assistantPanel");
    const assistantAnswer = byId("assistantAnswer");
    const assistantQuestions = byId("assistantQuestions");

    function selectQuestion(index) {
        const item = faq[index];
        if (!item) return;
        assistantAnswer.innerHTML = `<strong>${escapeHtml(item.question)}</strong>${escapeHtml(item.answer)}`;
        assistantQuestions.querySelectorAll("button").forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === index));
    }

    assistantQuestions.innerHTML = faq.map((item, index) => `<button type="button" data-question="${index}"><span>${escapeHtml(item.question)}</span><i class="bx bx-chevron-right"></i></button>`).join("");
    assistantQuestions.querySelectorAll("button").forEach(button => button.addEventListener("click", () => selectQuestion(Number(button.dataset.question))));
    if (faq.length) selectQuestion(0);
    byId("assistantButton").addEventListener("click", () => { assistant.hidden = !assistant.hidden; });
    byId("closeAssistant").addEventListener("click", () => { assistant.hidden = true; });

    const sections = [...document.querySelectorAll(".astro-app section[id]")];
    const navLinks = [...document.querySelectorAll(".astro-topbar nav a")];
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting && !entry.target.hidden).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
        }, { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.25] });
        sections.forEach(section => observer.observe(section));
    }

    if (!db) return void (errorBox.textContent = "La conexión segura no está disponible. Contacta a soporte.");

    db.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY" || (session && passwordSetupIntent)) openPasswordSetup(session?.user);
    });

    db.auth.getSession().then(({ data, error }) => {
        if (error || !data.session || recoveryMode) return;
        if (passwordSetupIntent) openPasswordSetup(data.session.user);
        else loadPortal(data.session.user);
    });
})();
