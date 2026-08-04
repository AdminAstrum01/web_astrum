(() => {
    "use strict";

    const approvedAccreditations = new Map([
        [
            "holo-astrum-unmsm",
            {
                documento: "https://drive.google.com/file/d/1Ru6PNraXdODhq9RkE1davAJrubw_kQSV/view?usp=sharing",
                codigo: "RA-2026-HAU-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ],
        [
            "rikchari",
            {
                documento: "https://drive.google.com/file/d/1iL1EjeMV0jUbawce9ePRuPmQ3aXExk5L/view?usp=sharing",
                codigo: "RA-2026-RK-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ],
        [
            "oportunidades-con-impacto",
            {
                documento: "https://drive.google.com/file/d/1OAv__aPTJqDtWXJQk5TYlrduC1SBIKuf/view?usp=sharing",
                codigo: "RA-2026-OCI-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ],
        [
            "for-our-rights",
            {
                documento: "https://drive.google.com/file/d/1hMCRlv576BNZAkNHemMXkVxMJYOMHMn2/view?usp=sharing",
                codigo: "RA-2026-FOR-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ]
    ]);

    ONGS.forEach(organization => {
        const accreditation = approvedAccreditations.get(organization.id);
        if (accreditation) organization.acreditacion = accreditation;
    });

    function renderApprovedAccreditation() {
        const id = new URLSearchParams(window.location.search).get("id");
        const profile = ONGS.find(organization => organization.id === id);
        const accreditation = profile && approvedAccreditations.get(profile.id);
        if (!profile || !accreditation) return;

        const block = document.getElementById("ongAcreditacionBlock");
        const description = document.getElementById("ongAcreditacionDescripcion");
        const code = document.getElementById("ongAcreditacionCodigo");
        const date = document.getElementById("ongAcreditacionFecha");
        const link = document.getElementById("ongAcreditacionLink");
        if (!block || !description || !code || !date || !link) return;

        const i18n = window.AstrumI18n;
        description.textContent = i18n?.t(
            "ong.accreditationDescription",
            { name: profile.nombre }
        ) || (
            "Esta constancia emitida por Red Astrum acredita que " +
            profile.nombre +
            " forma parte de la red institucional."
        );
        code.textContent = accreditation.codigo;
        date.textContent = i18n?.translateText(accreditation.fechaEmision) ||
            accreditation.fechaEmision;
        link.href = accreditation.documento;
        link.setAttribute(
            "aria-label",
            i18n?.t("ong.accreditationAria", { name: profile.nombre }) ||
                "Ver constancia de acreditación institucional de " +
                profile.nombre +
                " en PDF"
        );
        block.hidden = false;
    }

    const scheduleRender = () => queueMicrotask(renderApprovedAccreditation);
    if (document.readyState === "complete") {
        scheduleRender();
    } else {
        window.addEventListener("load", scheduleRender, { once: true });
    }
    document.addEventListener("astrum:languagechange", () => {
        window.setTimeout(renderApprovedAccreditation, 0);
    });
})();