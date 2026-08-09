const params = new URLSearchParams(window.location.search);
const ongId = params.get("id");
const ong = ONGS.find(item => item.id === ongId);

const socialPlatforms = {
    web: { label: "Sitio web", icon: "bx-globe" },
    instagram: { label: "Instagram", icon: "bxl-instagram" },
    facebook: { label: "Facebook", icon: "bxl-facebook" },
    youtube: { label: "YouTube", icon: "bxl-youtube" },
    linkedin: { label: "LinkedIn", icon: "bxl-linkedin-square" }
};

function localizedText(value = "") {
    return window.AstrumI18n?.translateText(value) || value;
}

function message(key, variables, fallback) {
    return window.AstrumI18n?.t(key, variables) || fallback;
}

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return window.AstrumI18n?.getLanguage() === "en"
            ? "Not reported"
            : "No reportado";
    }

    const locale = window.AstrumI18n?.getLocale() || "es-PE";
    return new Intl.NumberFormat(locale).format(value);
}

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

function isSafeAccreditationUrl(value) {
    if (!value) return false;

    try {
        const url = new URL(value, window.location.href);
        return url.origin === window.location.origin
            && url.pathname.startsWith("/documents/acreditaciones/")
            && url.pathname.endsWith(".pdf");
    } catch {
        return false;
    }
}

function setText(id, value, fallback = message(
    "common.updating",
    {},
    "Información en actualización"
)) {
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

    let retried = false;
    const handleError = () => {
        showFallback();
        if (!retried) {
            retried = true;
            const retryUrl = new URL(profile.logo, window.location.href);
            retryUrl.searchParams.set("astrum-retry", "1");
            image.src = retryUrl.href;
        }
    };

    image.addEventListener("load", showImage);
    image.addEventListener("error", handleError);
    image.alt = message(
        "ongs.logo",
        { name: profile.nombre },
        "Logo de " + profile.nombre
    );
    image.loading = "eager";
    image.decoding = "async";
    image.fetchPriority = "high";
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
        const platformLabel = localizedText(config.label);
        link.setAttribute(
            "aria-label",
            message(
                "ong.social",
                { platform: platformLabel, name: ong.nombre },
                platformLabel + " de " + ong.nombre
            )
        );
        link.title = platformLabel;

        const icon = document.createElement("i");
        icon.className = `bx ${config.icon}`;
        icon.setAttribute("aria-hidden", "true");
        link.appendChild(icon);
        fragment.appendChild(link);
    });

    if (contacto) {
        const mail = document.createElement("a");
        mail.className = "ong-social-link";
        mail.href = "mailto:" + contacto;
        mail.setAttribute(
            "aria-label",
            message("ong.email", { name: ong.nombre }, "Escribir a " + ong.nombre)
        );
        mail.title = message(
            "ong.institutionalEmail",
            {},
            "Correo institucional"
        );

        const icon = document.createElement("i");
        icon.className = "bx bx-envelope";
        icon.setAttribute("aria-hidden", "true");
        mail.appendChild(icon);
        fragment.appendChild(mail);
    }

    container.replaceChildren(fragment);
    container.hidden = !container.children.length;
}

function renderAccreditation(profile) {
    const block = document.getElementById("ongAcreditacionBlock");
    const link = document.getElementById("ongAcreditacionLink");
    const accreditation = profile.acreditacion;
    const hasValidDocument = accreditation
        && isSafeAccreditationUrl(accreditation.documento);

    block.hidden = !hasValidDocument;
    if (!hasValidDocument) {
        link.removeAttribute("href");
        return;
    }

    setText(
        "ongAcreditacionDescripcion",
        message(
            "ong.accreditationDescription",
            { name: profile.nombre },
            "Esta constancia emitida por Red Astrum acredita que " +
                profile.nombre +
                " forma parte de la red institucional."
        )
    );
    setText("ongAcreditacionCodigo", accreditation.codigo);
    setText("ongAcreditacionFecha", localizedText(accreditation.fechaEmision));

    link.href = accreditation.documento;
    link.setAttribute(
        "aria-label",
        message(
            "ong.accreditationAria",
            { name: profile.nombre },
            "Ver constancia de acreditación institucional de " +
                profile.nombre +
                " en PDF"
        )
    );
}

function createImpactCard(label, value, iconClass) {
    const card = document.createElement("article");
    card.className = "ong-impact-card";

    const icon = document.createElement("i");
    icon.className = `bx ${iconClass}`;
    icon.setAttribute("aria-hidden", "true");

    const number = document.createElement("strong");
    number.textContent = formatNumber(value);
    if (!Number.isFinite(value)) number.classList.add("ong-impact-pending");

    const description = document.createElement("span");
    description.textContent = label;

    card.append(icon, number, description);
    return card;
}

function renderImpact(profile) {
    const impactGrid = document.getElementById("ongImpacto");
    const impact = profile.impact || {};
    const metrics = [
        [
            message(
                "ong.impact.direct",
                {},
                "Personas impactadas directamente"
            ),
            impact.directo,
            "bx-user-check"
        ],
        [
            message(
                "ong.impact.indirect",
                {},
                "Personas impactadas indirectamente"
            ),
            impact.indirecto,
            "bx-group"
        ],
    ];

    if (Number.isFinite(impact.miembros)) {
        metrics.push([
            message(
                "ong.impact.members",
                {},
                "Miembros de la organización"
            ),
            impact.miembros,
            "bx-network-chart"
        ]);
    }

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
            localizedText(profile.reconocimiento) || (
                profile.reconocimientoGubernamental
                    ? message(
                        "ong.recognition.yes",
                        {},
                        "La organización reporta reconocimiento por una entidad gubernamental."
                    )
                    : message(
                        "ong.recognition.no",
                        {},
                        "La organización no reporta actualmente reconocimiento por una entidad gubernamental."
                    )
            )
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
        chip.textContent = localizedText(item);
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
                descripcion: message(
                    "ong.project.defaultNetwork",
                    { name: profile.nombre },
                    "Proyecto desarrollado por " +
                        profile.nombre +
                        " dentro del ecosistema Red Astrum."
                )
            }
            : project;

        const card = document.createElement("article");
        card.className = "ong-project-card";

        const title = document.createElement("h3");
        title.textContent = localizedText(normalizedProject.nombre);

        const description = document.createElement("p");
        description.textContent = localizedText(normalizedProject.descripcion) ||
            message(
                "ong.project.default",
                { name: profile.nombre },
                "Proyecto desarrollado por " + profile.nombre + "."
            );

        card.append(title, description);

        if (isSafeExternalUrl(normalizedProject.enlace)) {
            const link = document.createElement("a");
            link.className = "ong-project-link";
            link.href = normalizedProject.enlace;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.append(document.createTextNode(
                message("ong.project.evidence", {}, "Ver evidencia") + " "
            ));

            const icon = document.createElement("i");
            icon.className = "bx bx-link-external";
            icon.setAttribute("aria-hidden", "true");
            link.appendChild(icon);
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
    title.textContent = message("ong.notFound.title", {}, "ONG no encontrada");

    const messageElement = document.createElement("p");
    messageElement.textContent = window.AstrumI18n?.t("ong.notFound.message") ||
        "La organización solicitada no existe o aún no ha sido registrada.";

    const link = document.createElement("a");
    link.href = "/ongs";
    link.textContent = window.AstrumI18n?.t("ong.notFound.link") ||
        "Volver al directorio";

    state.append(title, messageElement, link);
    portal.appendChild(state);
}

function renderLocalizedProfile(profile) {
    document.title = profile.nombre + " - Red Astrum";
    document.querySelector('meta[name="description"]').content =
        localizedText(profile.descripcion);

    const logo = document.getElementById("ongLogo");
    if (logo) {
        logo.alt = message(
            "ongs.logo",
            { name: profile.nombre },
            "Logo de " + profile.nombre
        );
    }

    setText(
        "ongEstado",
        message("ongs.network", {}, "ONG de Red Astrum")
    );
    setText("ongNombre", profile.nombre);
    setText("ongDescripcion", localizedText(profile.descripcion));
    setText("ongRegion", localizedText(profile.region));
    setText("ongFundacion", localizedText(profile.fechaFundacion));
    setText("ongMision", localizedText(profile.mision));

    setOptionalBlock(
        "ongVisionBlock",
        "ongVision",
        profile.vision ? localizedText(profile.vision) : ""
    );
    setOptionalBlock(
        "ongPublicoBlock",
        "ongPublico",
        profile.publico ? localizedText(profile.publico) : ""
    );
    setOptionalBlock(
        "ongValorBlock",
        "ongValor",
        profile.valor ? localizedText(profile.valor) : ""
    );

    renderSocialLinks(profile.redes, profile.contacto);
    renderAccreditation(profile);
    renderImpact(profile);
    renderProjects(profile);
}

if (!ong) {
    renderNotFound();
    document.addEventListener("astrum:languagechange", renderNotFound);
} else {
    renderLogo(ong);
    renderLocalizedProfile(ong);
    initializeTabs();
    document.addEventListener("astrum:languagechange", () => {
        renderLocalizedProfile(ong);
    });
}
