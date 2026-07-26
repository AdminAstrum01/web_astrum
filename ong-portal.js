const params = new URLSearchParams(window.location.search);
const ongId = params.get("id");
const ong = ONGS.find(item => item.id === ongId);
const numberFormatter = new Intl.NumberFormat("es-PE");
const networkLabel = "ONG de Red Astrum";

const socialPlatforms = {
    web: { label: "Sitio web", icon: "bx-globe" },
    instagram: { label: "Instagram", icon: "bxl-instagram" },
    facebook: { label: "Facebook", icon: "bxl-facebook" },
    youtube: { label: "YouTube", icon: "bxl-youtube" },
    linkedin: { label: "LinkedIn", icon: "bxl-linkedin-square" }
};

function getInitials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

function isSafeExternalUrl(value) {
    if (!value) return false;

    try {
        return new URL(value, window.location.href).protocol === "https:";
    } catch {
        return false;
    }
}

function setText(id, value, fallback = "Información en actualización") {
    const element = document.getElementById(id);
    if (element) element.textContent = value || fallback;
}

function setOptionalBlock(blockId, textId, value) {
    const block = document.getElementById(blockId);
    if (!block) return;

    block.hidden = !value;
    if (value) setText(textId, value);
}

function renderLogo(profile) {
    const image = document.getElementById("ongLogo");
    const fallback = document.getElementById("ongLogoFallback");
    fallback.textContent = getInitials(profile.nombre);

    const showFallback = () => {
        image.hidden = true;
        fallback.hidden = false;
    };
    const showImage = () => {
        image.hidden = false;
        fallback.hidden = true;
    };

    showFallback();
    if (!profile.logo) return;

    image.addEventListener("load", showImage, { once: true });
    image.addEventListener("error", showFallback, { once: true });
    image.alt = `Logo de ${profile.nombre}`;
    image.src = profile.logo;

    if (image.complete) {
        image.naturalWidth > 0 ? showImage() : showFallback();
    }
}

function renderSocialLinks(redes = {}, contacto = "") {
    const container = document.getElementById("ongSocialLinks");
    const fragment = document.createDocumentFragment();

    Object.entries(redes).forEach(([platform, url]) => {
        const config = socialPlatforms[platform];
        if (!config || !isSafeExternalUrl(url)) return;

        const link = document.createElement("a");
        link.className = "ong-social-link";
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `${config.label} de ${ong.nombre}`);
        link.title = config.label;

        const icon = document.createElement("i");
        icon.className = `bx ${config.icon}`;
        icon.setAttribute("aria-hidden", "true");
        link.appendChild(icon);
        fragment.appendChild(link);
    });

    if (contacto) {
        const mail = document.createElement("a");
        mail.className = "ong-social-link";
        mail.href = `mailto:${contacto}`;
        mail.setAttribute("aria-label", `Escribir a ${ong.nombre}`);
        mail.title = "Correo institucional";

        const icon = document.createElement("i");
        icon.className = "bx bx-envelope";
        icon.setAttribute("aria-hidden", "true");
        mail.appendChild(icon);
        fragment.appendChild(mail);
    }

    container.replaceChildren(fragment);
    container.hidden = !container.children.length;
}

function createImpactCard(label, value, iconClass) {
    const card = document.createElement("article");
    card.className = "ong-impact-card";

    const icon = document.createElement("i");
    icon.className = `bx ${iconClass}`;
    icon.setAttribute("aria-hidden", "true");

    const number = document.createElement("strong");
    number.textContent = numberFormatter.format(value);

    const description = document.createElement("span");
    description.textContent = label;

    card.append(icon, number, description);
    return card;
}

function renderImpact(profile) {
    const impactGrid = document.getElementById("ongImpacto");
    const impact = profile.impact || {};
    const metrics = [
        ["Personas impactadas directamente", impact.directo, "bx-user-check"],
        ["Personas impactadas indirectamente", impact.indirecto, "bx-group"],
        ["Miembros de la organización", impact.miembros, "bx-network-chart"]
    ].filter(([, value]) => Number.isFinite(value));

    const fragment = document.createDocumentFragment();
    metrics.forEach(([label, value, icon]) => {
        fragment.appendChild(createImpactCard(label, value, icon));
    });
    impactGrid.replaceChildren(fragment);

    const recognitionBlock = document.getElementById("ongReconocimientoBlock");
    const hasRecognitionData = typeof profile.reconocimientoGubernamental === "boolean";
    recognitionBlock.hidden = !hasRecognitionData;
    if (hasRecognitionData) {
        setText(
            "ongReconocimiento",
            profile.reconocimientoGubernamental
                ? "La organización reporta reconocimiento por una entidad gubernamental."
                : "La organización no reporta actualmente reconocimiento por una entidad gubernamental."
        );
    }

    const odsBlock = document.getElementById("ongOdsBlock");
    const odsContainer = document.getElementById("ongOds");
    const ods = Array.isArray(profile.ods) ? profile.ods : [];
    odsBlock.hidden = !ods.length;

    const odsFragment = document.createDocumentFragment();
    ods.forEach(item => {
        const chip = document.createElement("span");
        chip.className = "ong-ods-chip";
        chip.textContent = item;
        odsFragment.appendChild(chip);
    });
    odsContainer.replaceChildren(odsFragment);

    document.getElementById("ongImpactoEmpty").hidden =
        metrics.length > 0 || hasRecognitionData || ods.length > 0;
}

function renderProjects(profile) {
    const grid = document.getElementById("ongProyectos");
    const projects = Array.isArray(profile.proyectos) ? profile.proyectos : [];
    const fragment = document.createDocumentFragment();

    projects.forEach(project => {
        const normalizedProject = typeof project === "string"
            ? {
                nombre: project,
                descripcion: `Proyecto desarrollado por ${profile.nombre} dentro del ecosistema Red Astrum.`
            }
            : project;

        const card = document.createElement("article");
        card.className = "ong-project-card";

        const title = document.createElement("h3");
        title.textContent = normalizedProject.nombre;

        const description = document.createElement("p");
        description.textContent = normalizedProject.descripcion ||
            `Proyecto desarrollado por ${profile.nombre}.`;

        card.append(title, description);

        if (isSafeExternalUrl(normalizedProject.enlace)) {
            const link = document.createElement("a");
            link.className = "ong-project-link";
            link.href = normalizedProject.enlace;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.innerHTML = "Ver evidencia <i class='bx bx-link-external' aria-hidden='true'></i>";
            card.appendChild(link);
        }

        fragment.appendChild(card);
    });

    grid.replaceChildren(fragment);
    document.getElementById("ongProyectosEmpty").hidden = projects.length > 0;
}

function activateTab(button, { focus = false } = {}) {
    const buttons = [...document.querySelectorAll('[role="tab"]')];
    const panels = [...document.querySelectorAll('[role="tabpanel"]')];
    const panelId = button.dataset.tab;

    buttons.forEach(tab => {
        const isActive = tab === button;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach(panel => {
        const isActive = panel.id === panelId;
        panel.classList.toggle("active", isActive);
        panel.hidden = !isActive;
    });

    if (focus) button.focus();
    history.replaceState(null, "", `#${panelId}`);
}

function initializeTabs() {
    const buttons = [...document.querySelectorAll('[role="tab"]')];

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => activateTab(button));
        button.addEventListener("keydown", event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

            event.preventDefault();
            let nextIndex = index;
            if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
            if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
            if (event.key === "Home") nextIndex = 0;
            if (event.key === "End") nextIndex = buttons.length - 1;
            activateTab(buttons[nextIndex], { focus: true });
        });
    });

    const requestedTab = window.location.hash.slice(1);
    const requestedButton = buttons.find(button => button.dataset.tab === requestedTab);
    if (requestedButton) activateTab(requestedButton);
}

function renderNotFound() {
    const portal = document.querySelector(".ong-portal-page");
    portal.replaceChildren();

    const state = document.createElement("div");
    state.className = "ong-not-found";

    const title = document.createElement("h1");
    title.textContent = "ONG no encontrada";

    const message = document.createElement("p");
    message.textContent = "La organización solicitada no existe o aún no ha sido registrada.";

    const link = document.createElement("a");
    link.href = "ongs.html";
    link.textContent = "Volver al directorio";

    state.append(title, message, link);
    portal.appendChild(state);
}

if (!ong) {
    renderNotFound();
} else {
    document.title = `${ong.nombre} - Red Astrum`;
    document.querySelector('meta[name="description"]').content = ong.descripcion;

    renderLogo(ong);
    setText("ongEstado", networkLabel);
    setText("ongNombre", ong.nombre);
    setText("ongDescripcion", ong.descripcion);
    setText("ongRegion", ong.region);
    setText("ongFundacion", ong.fechaFundacion);
    setText("ongMision", ong.mision);

    setOptionalBlock("ongVisionBlock", "ongVision", ong.vision);
    setOptionalBlock("ongPublicoBlock", "ongPublico", ong.publico);
    setOptionalBlock("ongValorBlock", "ongValor", ong.valor);

    renderSocialLinks(ong.redes, ong.contacto);
    renderImpact(ong);
    renderProjects(ong);
    initializeTabs();
}
