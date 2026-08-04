(() => {
    "use strict";

    const accreditations = new Map([
        [
            "holo-astrum-unmsm",
            {
                documento: "/documents/acreditaciones/holo-astrum-unmsm.pdf",
                codigo: "RA-2026-HAU-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ],
        [
            "rikchari",
            {
                documento: "/documents/acreditaciones/rikchari.pdf",
                codigo: "RA-2026-RK-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ],
        [
            "oportunidades-con-impacto",
            {
                documento: "/documents/acreditaciones/oportunidades-con-impacto.pdf",
                codigo: "RA-2026-OCI-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ],
        [
            "for-our-rights",
            {
                documento: "/documents/acreditaciones/for-our-rights.pdf",
                codigo: "RA-2026-FOR-ONG",
                fechaEmision: "3 de agosto de 2026"
            }
        ]
    ]);

    ONGS.forEach(organization => {
        const accreditation = accreditations.get(organization.id);
        if (accreditation) organization.acreditacion = accreditation;
    });
})();