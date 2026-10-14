// Fotografías actualizadas por los miembros en octubre de 2026.
const TEAM_PHOTOS = {
    "Manuel Palomino": "/images/miembros/manuel_palomino.webp",
    "Mariana Gaona": "/images/miembros/mariana_gaona.webp",
    "Manuel Quito": "/images/miembros/manuel_quito.webp",
    "Jhenifer Hernández": "/images/miembros/jhenifer_hernandez.webp",
    "Paula Rodríguez": "/images/miembros/paula_rodriguez.webp",
    "Gadiel Lora": "/images/miembros/gadiel_lora.webp",
    "Sergio Calle": "/images/miembros/sergio_calle.webp",
    "Ana Marroquín": "/images/miembros/ana_marroquin.webp",
    "Cielo Sallo": "/images/miembros/cielo_sallo.webp",
    "Brisa Chanduví": "/images/miembros/brisa_chanduvi.webp",
    "Nayda Texsi": "/images/miembros/nayda_texsi.webp"
};
TEAM_MEMBERS.forEach(member => {
    if (TEAM_PHOTOS[member.nombre]) member.foto = TEAM_PHOTOS[member.nombre];
});

const TEAM_ROLE_UPDATES = {
    "Paula Rodríguez": "Representante de Por Ti",
    "Gadiel Lora": "Representante de Pares"
};
TEAM_MEMBERS.forEach(member => {
    if (TEAM_ROLE_UPDATES[member.nombre]) member.rol = TEAM_ROLE_UPDATES[member.nombre];
});
