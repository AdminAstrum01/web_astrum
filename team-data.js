const TEAM_MEMBERS = [
    {
        nombre: "Jesús Gálvez",
        nombreCompleto: "Jesús Alexander Emmanuel Gálvez Cruz",
        rol: "Fundador · Presidente · Representante legal",
        area: "Fundadores",
        areas: ["Fundadores", "Consejo Supremo"],
        subarea: "Presidencia",
        foto: "/images/fundadores/jesus_galvez.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/jesusgalvezcruz/",
            email: "jesus.galvez@redastrum.org"
        }
    },
    {
        nombre: "Fabio Alfaro",
        nombreCompleto: "Fabio Antonio Alfaro Jauregui",
        rol: "Cofundador · Vicepresidente",
        area: "Fundadores",
        areas: ["Fundadores", "Consejo Supremo"],
        subarea: "Vicepresidencia",
        foto: "/images/fundadores/fabio_alfaro.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/fabioalfarojauregui/",
            email: "fabio.alfaro@redastrum.org"
        }
    },
    {
        nombre: "Manuel Palomino",
        nombreCompleto: "Manuel Eduardo Palomino Pizango",
        rol: "Cofundador · Tesorero",
        area: "Fundadores",
        areas: ["Fundadores", "Consejo Supremo"],
        subarea: "Tesorería",
        foto: "/images/fundadores/manuel_palomino.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/manuel-palomino-309451382",
            email: "manuel.palomino@redastrum.org"
        }
    },
    {
        nombre: "Claudio Zapata",
        nombreCompleto: "Claudio Roberto Zapata Pizango",
        rol: "Cofundador",
        area: "Fundadores",
        areas: ["Fundadores"],
        subarea: "",
        foto: "/images/fundadores/claudio_zapata.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/claudio-roberto-zapata-pizango-b4a750345/",
            email: "claudio.zapata@redastrum.org"
        }
    },
    {
        nombre: "Jhosany Lazo",
        nombreCompleto: "Jhosany Belen Lazo Alegre",
        rol: "Cofundadora · Representante de Holo Astrum UNMSM",
        area: "Fundadores",
        areas: ["Fundadores", "Consejo de ONGs"],
        subarea: "Holo Astrum UNMSM",
        foto: "/images/representantes_ong/jhosany_lazo.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/belen-lazo-alegre-831740282",
            email: "belen.lazo@redastrum.org"
        }
    },
    {
        nombre: "Valeria Cama",
        nombreCompleto: "Valeria Antuane Cama Cabrera",
        rol: "Cofundadora",
        area: "Fundadores",
        areas: ["Fundadores"],
        subarea: "",
        foto: "/images/fundadores/valeria_cama.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/valeria-cama-cabrera-5b43723a3",
            email: "valeria.cama@redastrum.org"
        }
    },
    {
        nombre: "Marcelo Villagarcía",
        nombreCompleto: "Marcelo Fernando Villagarcía Inca",
        rol: "Coordinador de G-Astrum",
        area: "Consejo Supremo",
        areas: ["Consejo Supremo"],
        subarea: "G-Astrum",
        foto: "/images/consejosupremo/marcelo_villagarcia.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/mafeviin-pe/",
            email: "marcelo.villagarcia@redastrum.org"
        }
    },
    {
        nombre: "Mary Ann Thomas",
        nombreCompleto: "Mary Ann Juliet Thomas Lara",
        rol: "Coordinadora de ONGs · Representante de House of Young Promises",
        area: "Consejo Supremo",
        areas: ["Consejo Supremo", "Consejo de ONGs"],
        subarea: "House of Young Promises",
        foto: "/images/representantes_ong/mary_thomas.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/mary-ann-thomas-lara-1b95033b2",
            email: "mary_ann.thomas@redastrum.org"
        }
    },
    {
        nombre: "Yulissa Restrepo",
        nombreCompleto: "Yulissa Restrepo Arango",
        rol: "Coordinadora de Asesores",
        area: "Consejo Supremo",
        areas: ["Consejo Supremo"],
        subarea: "Asesores",
        foto: "/images/nucleoduro/yulissa_restrepo.webp",
        redes: {
            email: "yulissa.restrepo@redastrum.org"
        }
    },
    {
        nombre: "Sebastian Zapata",
        nombreCompleto: "Sebastian Hans Zapata Espinoza",
        rol: "Coordinador de Áreas de Apoyo",
        area: "Consejo Supremo",
        areas: ["Consejo Supremo"],
        subarea: "Áreas de Apoyo",
        foto: "/images/nucleoduro/sebastian_zapata.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/sebastian-zapata-29382640a/",
            email: "sebastian.zapata@redastrum.org"
        }
    },
    {
        nombre: "Valeria Rivas",
        nombreCompleto: "Valeria Rivas Hurtado",
        rol: "Directora de Marketing",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Marketing",
        foto: "/images/nucleoduro/valeria_rivas.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/valeria-rivas-hurtado-3222a23b0/",
            email: "valeria.rivas@redastrum.org"
        }
    },
    {
        nombre: "José Piedra",
        nombreCompleto: "Jose Piedra",
        rol: "Miembro de Marketing",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Marketing",
        foto: "/images/nucleoduro/jose_piedra.webp",
        redes: {
            email: "jose.piedra@redastrum.org"
        }
    },
    {
        nombre: "Walter Sánchez",
        nombreCompleto: "Walter Jesus Sanchez Pajuelo",
        rol: "Director de Tecnología",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Tecnología",
        foto: "/images/consejosupremo/walter_sanchez.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/walterjsp/",
            email: "walter.sanchez@redastrum.org"
        }
    },
    {
        nombre: "Evans Toribio",
        nombreCompleto: "Evans Josué Toribio Santos",
        rol: "Miembro de Tecnología",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Tecnología",
        foto: "/images/nucleoduro/evans_toribio.webp",
        redes: {
            email: "evans.toribio@redastrum.org"
        }
    },
    {
        nombre: "Amy Maldonado",
        nombreCompleto: "Amy Dayana Maldonado Jaramillo",
        rol: "Miembro de Tecnología",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Tecnología",
        foto: "/images/nucleoduro/amy_maldonado.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/~amymaldonadoj",
            email: "amy.maldonado@redastrum.org"
        }
    },
    {
        nombre: "Brendi Imán",
        nombreCompleto: "Brendi Yulexi Iman Valdiviezo",
        rol: "Miembro de Secretaría",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Secretaría",
        foto: "/images/nucleoduro/BrendiIman.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/brendi-imán-valdiviezo-9b7192369/",
            email: "brendi.valdiviezo@redastrum.org"
        }
    },
    {
        nombre: "Nancy Sucasaca",
        nombreCompleto: "Nancy Rocio Sucasaca Apaza",
        rol: "Miembro de Secretaría",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Secretaría",
        foto: "/images/nucleoduro/nancy_sucasaca.webp",
        redes: {
            email: "nancy.sucasaca@redastrum.org"
        }
    },
    {
        nombre: "Zharick Figueroa",
        nombreCompleto: "Zharick Alejandra Figueroa Carranza",
        rol: "Miembro de Secretaría",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Secretaría",
        foto: "",
        redes: {
            email: "zharick.figueroa@redastrum.org"
        }
    },
    {
        nombre: "Julibeth Román",
        nombreCompleto: "Julibeth Román Arrieta",
        rol: "Directora de Gestión",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Gestión",
        foto: "/images/nucleoduro/julibeth_roman.webp",
        redes: {
            email: "julibeth.roman@redastrum.org"
        }
    },
    {
        nombre: "Daira Lima",
        nombreCompleto: "Daira Grisel Lima Muñoz",
        rol: "Miembro de Gestión",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Gestión",
        foto: "/images/nucleoduro/daira_lima.webp",
        redes: {
            email: "daira.lima@redastrum.org"
        }
    },
    {
        nombre: "Alisson Canales",
        nombreCompleto: "Alisson Camila Canales Canales",
        rol: "Miembro de Gestión",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Gestión",
        foto: "/images/nucleoduro/alisson_canales.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/alisson-canales-1bab55343",
            email: "alisson.canales@redastrum.org"
        }
    },
    {
        nombre: "Dayanna Córdoba",
        nombreCompleto: "Dayanna Nicole Córdoba Orozco",
        rol: "Miembro de Gestión",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "Gestión",
        foto: "/images/nucleoduro/dayanna_cordoba.webp",
        redes: {
            email: "dayanna.cordoba@redastrum.org"
        }
    },
    {
        nombre: "Thayz Caycho",
        nombreCompleto: "Thayz Alexandra Medalith Caycho Vargas",
        rol: "Co-Coordinadora de G-Astrum",
        area: "Núcleo Duro",
        areas: ["Núcleo Duro"],
        subarea: "G-Astrum",
        foto: "/images/nucleoduro/thayz_caycho.webp",
        redes: {
            email: "thayz.caycho@redastrum.org"
        }
    },
    {
        nombre: "Kimberlym Bonilla",
        nombreCompleto: "Kimberlym Makarena Bonilla Gastulo",
        rol: "Representante de Bridges of Equity",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Bridges of Equity",
        foto: "/images/representantes_ong/kimberlym_bonilla.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/kimberlymbonillagastulo/",
            email: "kimberlym.bonilla@redastrum.org"
        }
    },
    {
        nombre: "Jimena Carlos",
        nombreCompleto: "Jimena Isabel Carlos Alan",
        rol: "Representante de Girls In Science",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Girls In Science",
        foto: "/images/representantes_ong/jimena_carlos.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/jimena-isabel-carlos-alan-6a9849314/",
            email: "jimena.carlos@redastrum.org"
        }
    },
    {
        nombre: "Karla Camara",
        nombreCompleto: "Karla Jimena Camara Rosas",
        rol: "Representante de Green Generation",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Green Generation",
        foto: "/images/representantes_ong/karla_camara.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/karla-camara-16587a297",
            email: "karla.camara@redastrum.org"
        }
    },
    {
        nombre: "Celeste Bedoya",
        nombreCompleto: "Angel Celeste Bedoya Yzasiga",
        rol: "Representante de Holo Astrum y Maywa",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Holo Astrum · Maywa",
        foto: "/images/representantes_ong/celeste_bedoya.webp",
        redes: {
            email: "celeste.bedoya@redastrum.org"
        }
    },
    {
        nombre: "Diego Iparraguirre",
        nombreCompleto: "Diego Noe Iparraguirre Romero",
        rol: "Representante de Holo Astrum PUCP",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Holo Astrum PUCP",
        foto: "/images/representantes_ong/diego_iparraguirre.webp",
        redes: {
            email: "diego.iparraguirre@redastrum.org"
        }
    },
    {
        nombre: "Clarisa Farfán",
        nombreCompleto: "Clarisa Teresa Farfan Tapia",
        rol: "Representante de Rikchari",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Rikchari",
        foto: "/images/representantes_ong/clarisa_farfan.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/clarisa-farfan-57328935b/",
            email: "clarisa.farfan@redastrum.org"
        }
    },
    {
        nombre: "Pamela Vega",
        nombreCompleto: "Pamela Giuliana Vega De La Cruz",
        rol: "Representante de Unity",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Unity",
        foto: "/images/representantes_ong/pamela_vega.webp",
        redes: {
            email: "pamela.vega@redastrum.org"
        }
    },
    {
        nombre: "Nadia Huaman",
        nombreCompleto: "Nadia Rossy Mary Huaman Palomino",
        rol: "Representante de Yatimaq",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Yatimaq",
        foto: "/images/representantes_ong/nadia_huaman.webp",
        redes: {
            email: "nadia.huaman@redastrum.org"
        }
    },
    {
        nombre: "Valery Huaranga",
        nombreCompleto: "Valery Corayma Huaranga Rosas",
        rol: "Representante de Youth Plus",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Youth Plus",
        foto: "/images/representantes_ong/valery_huaranga.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/valery-huaranga-rosas-4ba7a7397/",
            email: "valery.huaranga@redastrum.org"
        }
    },
    {
        nombre: "Andrés Navarrete",
        nombreCompleto: "Andrés Sebastian Navarrete Obando",
        rol: "Representante de Red Mundial de Jóvenes Académicos",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Red Mundial de Jóvenes Académicos",
        foto: "/images/representantes_ong/andres_navarrete.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/andres-sebastian-navarrete-obando-73a4a5343/",
            email: "andres.navarrete@redastrum.org"
        }
    },
    {
        nombre: "Ximena Cortez",
        nombreCompleto: "Ximena Camila Cortez Cruz",
        rol: "Representante de For Our Rights",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "For Our Rights",
        foto: "/images/representantes_ong/ximena_cortez.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/ximena-camila-cortez-cruz-63407b1b8/"
        }
    },
    {
        nombre: "Jashira Meza",
        nombreCompleto: "Jashira Ashly Meza Peña",
        rol: "Representante de Oportunidades con Impacto",
        area: "Consejo de ONGs",
        areas: ["Consejo de ONGs"],
        subarea: "Oportunidades con Impacto",
        foto: "/images/representantes_ong/jashira_meza.webp",
        redes: {
            linkedin: "https://www.linkedin.com/in/jashirameza/"
        }
    }
];
