(() => {
    "use strict";

    // El portal histórico consume `impact`, mientras que la base institucional
    // conserva estas métricas bajo `impacto`. Se adapta únicamente el conjunto
    // añadido o actualizado en el corte del 3 de agosto de 2026.
    const updatedOrganizationIds = new Set([
        "holo-astrum",
        "rikchari",
        "oportunidades-con-impacto",
        "for-our-rights"
    ]);

    ONGS.forEach(organization => {
        if (!updatedOrganizationIds.has(organization.id)) return;
        if (!organization.impact && organization.impacto) {
            organization.impact = organization.impacto;
        }
    });
})();
