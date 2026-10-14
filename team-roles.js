// Cargos públicos contrastados con la base de Red Astrum, 14 de octubre de 2026.
const CURRENT_COUNCIL = [
    {
        "nombre": "Jesús Gálvez",
        "rol": "Fundador · Presidente · Representante legal",
        "subarea": "Presidencia"
    },
    {
        "nombre": "Fabio Alfaro",
        "rol": "Cofundador · Vicepresidente",
        "subarea": "Vicepresidencia"
    },
    {
        "nombre": "Manuel Palomino",
        "rol": "Cofundador · Tesorero",
        "subarea": "Tesorería"
    },
    {
        "nombre": "Mary Thomas",
        "rol": "Delegado de ONGs · Representante de House of Young Promises",
        "subarea": "ONGs"
    },
    {
        "nombre": "Sebastian Zapata",
        "rol": "Delegado de Áreas de Apoyo",
        "subarea": "Áreas de Apoyo"
    }
];
const CURRENT_SUPPORT = [
    {
        "nombre": "Valeria Rivas",
        "rol": "Miembro Marketing",
        "subarea": "Marketing"
    },
    {
        "nombre": "José Piedra",
        "rol": "Miembro Marketing",
        "subarea": "Marketing"
    },
    {
        "nombre": "Yulissa Restrepo",
        "rol": "Miembro Tecnología",
        "subarea": "Tecnología"
    },
    {
        "nombre": "Evans Toribio",
        "rol": "Miembro Tecnología",
        "subarea": "Tecnología"
    },
    {
        "nombre": "Amy Maldonado",
        "rol": "Miembro Tecnología",
        "subarea": "Tecnología"
    },
    {
        "nombre": "Brendi Imán",
        "rol": "Miembro Secretaría",
        "subarea": "Secretaría"
    },
    {
        "nombre": "Nancy Sucasaca",
        "rol": "Miembro Secretaría",
        "subarea": "Secretaría"
    },
    {
        "nombre": "Zharick Figueroa",
        "rol": "Miembro Secretaría",
        "subarea": "Secretaría"
    },
    {
        "nombre": "Julibeth Román",
        "rol": "Miembro Gestión",
        "subarea": "Gestión"
    },
    {
        "nombre": "Daira Lima",
        "rol": "Miembro Gestión",
        "subarea": "Gestión"
    },
    {
        "nombre": "Alisson Canales",
        "rol": "Miembro Gestión",
        "subarea": "Gestión"
    },
    {
        "nombre": "Dayanna Córdova",
        "rol": "Miembro Gestión",
        "subarea": "Gestión"
    },
    {
        "nombre": "Thayz Caycho",
        "rol": "Miembro Gestión",
        "subarea": "Gestión"
    },
    {
        "nombre": "Marcelo Villagarcía",
        "rol": "Miembro Gestión",
        "subarea": "Gestión"
    }
];
const internalGroups = ["Consejo Supremo", "Núcleo Duro", "Miembros de Apoyo"];
const internalRoles = new Map([
    ...CURRENT_COUNCIL.map(member => [member.nombre, {...member, group: "Consejo Supremo"}]),
    ...CURRENT_SUPPORT.map(member => [member.nombre, {...member, group: "Miembros de Apoyo"}])
]);
for (let index = TEAM_MEMBERS.length - 1; index >= 0; index--) {
    const member = TEAM_MEMBERS[index];
    const previousGroups = member.areas || [member.area];
    const current = internalRoles.get(member.nombre);
    if (current) {
        member.areas = [...previousGroups.filter(group => !internalGroups.includes(group)), current.group];
        member.area = member.areas.includes("Fundadores") ? "Fundadores" : current.group;
        member.rol = current.rol;
        member.subarea = current.subarea;
    } else if (previousGroups.some(group => internalGroups.includes(group))) {
        member.areas = previousGroups.filter(group => !internalGroups.includes(group));
        if (!member.areas.length) {
            TEAM_MEMBERS.splice(index, 1);
        } else {
            member.area = member.areas[0];
        }
    }
}

