(() => {
    "use strict";

    const accreditations = new Map([
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
        const accreditation = accreditations.get(organization.id);
        if (accreditation) organization.acreditacion = accreditation;
    });
})();