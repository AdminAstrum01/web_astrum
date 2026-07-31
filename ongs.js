const mosaic = document.getElementById("ongMosaic");
const searchInput = document.getElementById("ongSearch");
const countLabel = document.getElementById("ongListCount");
const emptyState = document.getElementById("ongEmptyState");

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

function createLogo(ong) {
    const logoBox = document.createElement("div");
    logoBox.className = "ong-logo-box";

    const fallback = document.createElement("span");
    fallback.className = "ong-logo-fallback";
    fallback.textContent = getInitials(ong.nombre);
    fallback.setAttribute("aria-hidden", "true");

    if (!ong.logo) {
        logoBox.appendChild(fallback);
        return logoBox;
    }

    const image = document.createElement("img");
    image.src = ong.logo;
    image.alt = message(
        "ongs.logo",
        { name: ong.nombre },
        "Logo de " + ong.nombre
    );
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.addEventListener("error", () => image.replaceWith(fallback), { once: true });

    logoBox.appendChild(image);
    return logoBox;
}

function createCard(ong) {
    const card = document.createElement("a");
    card.className = "ong-tile";
    card.href = "/ong?id=" + encodeURIComponent(ong.id);
    card.setAttribute(
        "aria-label",
        message("ongs.open", { name: ong.nombre }, "Abrir portal de " + ong.nombre)
    );

    const info = document.createElement("div");
    info.className = "ong-tile-info";

    const title = document.createElement("h3");
    title.textContent = ong.nombre;

    const summary = document.createElement("p");
    summary.textContent = localizedText(ong.descripcion);

    const metadata = document.createElement("div");
    metadata.className = "ong-tile-meta";

    if (ong.region) {
        const region = document.createElement("small");
        region.innerHTML = "<i class='bx bx-map' aria-hidden='true'></i>";
        region.append(document.createTextNode(localizedText(ong.region)));
        metadata.appendChild(region);
    }

    const status = document.createElement("span");
    status.textContent = message("ongs.network", {}, "ONG de Red Astrum");

    info.append(title, summary, metadata, status);
    card.append(createLogo(ong), info);

    return card;
}

function renderOrganizations(query = "") {
    const normalizedQuery = normalizeText(query);
    const filtered = ONGS.filter(ong => {
        const searchable = normalizeText([
            ong.nombre,
            ong.sigla,
            ong.region,
            ong.descripcion
        ].filter(Boolean).map(searchableText).join(" "));

        return searchable.includes(normalizedQuery);
    });

    const fragment = document.createDocumentFragment();
    filtered.forEach(ong => fragment.appendChild(createCard(ong)));
    mosaic.replaceChildren(fragment);

    countLabel.textContent = filtered.length === 1
        ? message("ongs.count.one", {}, "1 organización")
        : message(
            "ongs.count.many",
            { count: filtered.length },
            String(filtered.length) + " organizaciones"
        );
    emptyState.hidden = filtered.length !== 0;
}

searchInput?.addEventListener("input", event => {
    renderOrganizations(event.target.value);
});

document.addEventListener("astrum:languagechange", () => {
    renderOrganizations(searchInput?.value || "");
});

renderOrganizations();
