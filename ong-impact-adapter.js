(() => {
    "use strict";

    // Datos reportados por cada organización en el formulario institucional.
    // Corte: 3 de agosto de 2026. `null` significa que la ONG aún no reportó
    // una cifra; nunca debe interpretarse ni mostrarse como cero.
    const impactByOrganization = new Map([
        ["holo-astrum", { directo: 500, indirecto: 5000, miembros: 30 }],
        ["holo-astrum-pucp", { directo: null, indirecto: null, miembros: null }],
        ["holo-astrum-unmsm", { directo: null, indirecto: null, miembros: null }],
        ["yatimaq", { directo: null, indirecto: null, miembros: null }],
        ["girls-in-science", { directo: 40, indirecto: 40, miembros: 14 }],
        ["unity", { directo: null, indirecto: null, miembros: null }],
        ["rikchari", { directo: 300, indirecto: 1200, miembros: 15 }],
        ["bridges-of-equity", { directo: 340, indirecto: 520, miembros: 25 }],
        ["youth-plus", { directo: 150, indirecto: 500, miembros: 63 }],
        ["house-of-young-promises", { directo: 65, indirecto: 252, miembros: 65 }],
        ["green-generation", { directo: 400, indirecto: 800, miembros: 14 }],
        ["red-mundial-jovenes-academicos", { directo: 53, indirecto: 120, miembros: 10 }],
        ["oportunidades-con-impacto", { directo: 500, indirecto: 50000, miembros: 2 }],
        ["for-our-rights", { directo: 120, indirecto: 1080, miembros: 15 }]
    ]);

    ONGS.forEach(organization => {
        const impact = impactByOrganization.get(organization.id);
        if (impact) organization.impact = { ...impact };
    });

    function message(key, fallback) {
        return window.AstrumI18n?.t(key, {}) || fallback;
    }

    function missingValueLabel() {
        return window.AstrumI18n?.getLanguage() === "en"
            ? "Not reported"
            : "No reportado";
    }

    function formatValue(value) {
        if (!Number.isFinite(value)) return missingValueLabel();

        const locale = window.AstrumI18n?.getLocale() || "es-PE";
        return new Intl.NumberFormat(locale).format(value);
    }

    function createImpactCard(label, value, iconClass) {
        const card = document.createElement("article");
        card.className = "ong-impact-card";

        const icon = document.createElement("i");
        icon.className = `bx ${iconClass}`;
        icon.setAttribute("aria-hidden", "true");

        const number = document.createElement("strong");
        number.textContent = formatValue(value);
        if (!Number.isFinite(value)) number.classList.add("ong-impact-pending");

        const description = document.createElement("span");
        description.textContent = label;

        card.append(icon, number, description);
        return card;
    }

    function renderCompleteImpactGrid() {
        const grid = document.getElementById("ongImpacto");
        if (!grid) return;

        const ongId = new URLSearchParams(window.location.search).get("id");
        const profile = ONGS.find(item => item.id === ongId);
        const impact = profile && impactByOrganization.get(profile.id);
        if (!profile || !impact) return;

        const metrics = [
            [
                message("ong.impact.direct", "Personas impactadas directamente"),
                impact.directo,
                "bx-user-check"
            ],
            [
                message("ong.impact.indirect", "Personas impactadas indirectamente"),
                impact.indirecto,
                "bx-group"
            ]
        ];

        if (Number.isFinite(impact.miembros)) {
            metrics.push([
                message("ong.impact.members", "Miembros de la organización"),
                impact.miembros,
                "bx-network-chart"
            ]);
        }

        const fragment = document.createDocumentFragment();
        metrics.forEach(([label, value, icon]) => {
            fragment.appendChild(createImpactCard(label, value, icon));
        });
        grid.replaceChildren(fragment);

        const emptyState = document.getElementById("ongImpactoEmpty");
        if (emptyState) emptyState.hidden = true;
    }

    // El adaptador se carga antes del renderizador principal; diferimos el ajuste
    // para garantizar que estas tarjetas sean el último estado visible del portal.
    window.setTimeout(renderCompleteImpactGrid, 0);
    document.addEventListener("DOMContentLoaded", renderCompleteImpactGrid, { once: true });
    document.addEventListener("astrum:languagechange", () => {
        window.setTimeout(renderCompleteImpactGrid, 0);
    });
})();
