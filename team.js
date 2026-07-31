const teamGrid = document.getElementById("team-grid");
const emptyState = document.getElementById("empty-state");
const countElement = document.getElementById("count-num");
const searchInput = document.getElementById("search-input");
const filterContainer = document.getElementById("filter-pills");

let activeFilter = "Todos";
let searchQuery = "";

function localizedText(value = "") {
    return window.AstrumI18n?.translateText(value) || value;
}

function searchableText(value = "") {
    return window.AstrumI18n?.searchable(value) || value;
}

function message(key, variables, fallback) {
    return window.AstrumI18n?.t(key, variables) || fallback;
}

function normalizeText(value = "") {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
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

function renderAvatar(member) {
    const avatar = document.createElement("div");
    avatar.className = member.foto ? "member-avatar" : "member-avatar no-photo";

    const showInitials = () => {
        avatar.className = "member-avatar no-photo";
        avatar.replaceChildren(document.createTextNode(getInitials(member.nombre)));
    };

    if (!member.foto) {
        showInitials();
        return avatar;
    }

    const image = document.createElement("img");
    image.src = member.foto;
    image.alt = message(
        "team.photo",
        { name: member.nombre },
        "Foto de " + member.nombre
    );
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", showInitials, { once: true });
    avatar.appendChild(image);

    return avatar;
}

function createSocialLink(platform, value, memberName) {
    if (!value) return null;

    const link = document.createElement("a");
    link.className = "social-icon";

    const icon = document.createElement("i");
    icon.className = platform === "email"
        ? "bx bx-envelope"
        : "bx bxl-linkedin";
    icon.setAttribute("aria-hidden", "true");

    if (platform === "email") {
        link.href = "mailto:" + value;
        link.setAttribute(
            "aria-label",
            message("team.email", { name: memberName }, "Escribir a " + memberName)
        );
    } else {
        try {
            const url = new URL(value);
            if (url.protocol !== "https:" || !url.hostname.endsWith("linkedin.com")) return null;
        } catch {
            return null;
        }

        link.href = value;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute(
            "aria-label",
            message("team.linkedin", { name: memberName }, "LinkedIn de " + memberName)
        );
    }

    link.appendChild(icon);
    return link;
}

function renderMemberCard(member, index) {
    const card = document.createElement("article");
    card.className = "member-card";
    card.dataset.area = member.area;
    card.dataset.aos = "fade-up";
    card.dataset.aosDelay = String((index % 3) * 80);
    card.title = member.nombreCompleto;

    card.appendChild(renderAvatar(member));

    const badges = document.createElement("div");
    badges.className = "member-badges";

    member.areas.forEach(area => {
        const badge = document.createElement("span");
        badge.className = "member-area";
        badge.textContent = localizedText(area);
        badges.appendChild(badge);
    });

    if (member.subarea) {
        const subarea = document.createElement("span");
        subarea.className = "member-subarea";
        subarea.textContent = localizedText(member.subarea);
        badges.appendChild(subarea);
    }

    const name = document.createElement("h3");
    name.className = "member-name";
    name.textContent = member.nombre;

    const role = document.createElement("p");
    role.className = "member-role";
    role.textContent = localizedText(member.rol);

    card.append(badges, name, role);

    const socials = document.createElement("div");
    socials.className = "member-socials";

    Object.entries(member.redes || {}).forEach(([platform, value]) => {
        const link = createSocialLink(platform, value, member.nombre);
        if (link) socials.appendChild(link);
    });

    if (socials.children.length) card.appendChild(socials);

    return card;
}

function renderCards(members) {
    const fragment = document.createDocumentFragment();
    members.forEach((member, index) => {
        fragment.appendChild(renderMemberCard(member, index));
    });

    teamGrid.replaceChildren(fragment);
    countElement.textContent = String(members.length);
    emptyState.hidden = members.length !== 0;
    window.AOS?.refresh();
}

function applyFilters() {
    const filtered = TEAM_MEMBERS.filter(member => {
        const matchesArea = activeFilter === "Todos" || member.areas.includes(activeFilter);
        const searchable = normalizeText([
            member.nombre,
            member.nombreCompleto,
            member.rol,
            member.subarea,
            ...member.areas
        ].map(searchableText).join(" "));

        return matchesArea && searchable.includes(searchQuery);
    });

    renderCards(filtered);
}

filterContainer?.addEventListener("click", event => {
    const button = event.target.closest(".pill");
    if (!button) return;

    filterContainer.querySelectorAll(".pill").forEach(item => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
    });

    activeFilter = button.dataset.filter;
    applyFilters();
});

searchInput?.addEventListener("input", event => {
    searchQuery = normalizeText(event.target.value);
    applyFilters();
});

document.addEventListener("astrum:languagechange", applyFilters);

window.AOS?.init();
applyFilters();
