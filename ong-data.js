const ONGS = [
    {
        id: "holo-astrum",
        nombre: "Holo Astrum",
        logo: "images/logo_ong/holo_astrum.webp",
        descripcion: "Holo Astrum impulsa espacios de formación integral orientados al liderazgo, el pensamiento crítico y el desarrollo humano de jóvenes.",
        mision: "Formar jóvenes con propósito, criterio y capacidad de liderazgo desde una educación integral.",
        publico: "Estudiantes escolares, universitarios y jóvenes líderes.",
        valor: "Aporta experiencia en el diseño y desarrollo de programas educativos para jóvenes.",
        contacto: "info@redastrum.org",
        proyectos: [
            {
                nombre: "Modo PUCP",
                descripcion: "Programa de orientación y preparación para estudiantes que inician su experiencia universitaria."
            },
            {
                nombre: "Formaciones Astrum",
                descripcion: "Espacios de aprendizaje integral para fortalecer pensamiento crítico, propósito y liderazgo."
            },
            {
                nombre: "Talleres de liderazgo",
                descripcion: "Experiencias formativas para convertir ideas juveniles en iniciativas con impacto."
            }
        ]
    },
    {
        id: "yatimaq",
        nombre: "Yatimaq",
        logo: "images/logo_ong/yatimaq.webp",
        descripcion: "Yatimaq desarrolla iniciativas educativas con enfoque comunitario para acercar oportunidades formativas a jóvenes.",
        mision: "Crear experiencias educativas accesibles y con impacto social.",
        publico: "Jóvenes de comunidades educativas y organizaciones aliadas.",
        valor: "Fortalece la dimensión territorial y comunitaria del ecosistema Astrum.",
        proyectos: [
            {
                nombre: "Talleres comunitarios",
                descripcion: "Actividades educativas orientadas a las necesidades de comunidades y organizaciones aliadas."
            },
            {
                nombre: "Mentorías educativas",
                descripcion: "Acompañamiento a jóvenes para fortalecer sus trayectorias formativas."
            }
        ]
    },
    {
        id: "girls-in-science",
        nombre: "Girls in Science",
        logo: "images/logo_ong/girls_in_science.webp",
        descripcion: "Girls in Science promueve la participación de niñas y jóvenes mujeres en ciencia, tecnología, ingeniería y matemáticas.",
        mision: "Inspirar y acompañar a jóvenes mujeres en su camino hacia áreas científicas y tecnológicas.",
        publico: "Niñas, escolares y universitarias interesadas en STEM.",
        valor: "Aporta enfoque de equidad, ciencia y representación femenina dentro de la red.",
        proyectos: [
            {
                nombre: "Charlas STEM",
                descripcion: "Encuentros de divulgación y orientación sobre carreras científicas y tecnológicas."
            },
            {
                nombre: "Mentorías científicas",
                descripcion: "Acompañamiento para jóvenes interesadas en desarrollar una trayectoria dentro de STEM."
            }
        ]
    },
    {
        id: "unity",
        nombre: "Unity",
        logo: "images/logo_ong/unity.webp",
        descripcion: "Unity impulsa espacios de integración, bienestar y colaboración entre jóvenes con vocación de servicio.",
        mision: "Crear comunidad y fortalecer el bienestar integral de jóvenes.",
        publico: "Jóvenes voluntarios, estudiantes y comunidades juveniles.",
        valor: "Aporta una línea de integración, acompañamiento y cultura comunitaria.",
        proyectos: [
            {
                nombre: "Espacios de integración",
                descripcion: "Actividades para fortalecer vínculos, colaboración y sentido de comunidad."
            },
            {
                nombre: "Actividades de bienestar",
                descripcion: "Iniciativas orientadas al desarrollo y bienestar integral de jóvenes."
            }
        ]
    },
    {
        id: "bridges-of-equity",
        nombre: "Bridges of Equity",
        logo: "images/logo_ong/bridges_of_equity.webp",
        descripcion: "Iniciativa juvenil que promueve el liderazgo y la equidad social como herramientas de transformación comunitaria. Acompaña a jóvenes para que desarrollen iniciativas sociales, educativas y participativas con propósito.",
        mision: "Impulsar a jóvenes a liderar con propósito, desarrollando proyectos virtuales que promuevan la equidad, el liderazgo y la transformación positiva en sus comunidades.",
        vision: "Consolidarse como una iniciativa juvenil de referencia en formación en liderazgo y equidad, impulsando agentes de cambio capaces de fortalecer comunidades más justas, empáticas y colaborativas.",
        publico: "Adolescentes y jóvenes de 15 a 25 años.",
        region: "Lambayeque, Perú",
        fechaFundacion: "1 de octubre de 2025",
        impacto: {
            directo: 340,
            indirecto: 520,
            miembros: 25
        },
        ods: [
            "ODS 4 · Educación de calidad",
            "ODS 5 · Igualdad de género"
        ],
        reconocimientoGubernamental: false,
        redes: {
            instagram: "https://www.instagram.com/bridgesofequity",
            facebook: "https://www.facebook.com/share/18cnNBWrT4/",
            youtube: "https://youtube.com/@bridgesofequity",
            linkedin: "https://www.linkedin.com/in/bridges-of-equity-493bb63a7"
        },
        proyectos: [
            {
                nombre: "Puentes de Tinta",
                descripcion: "Espacio de expresión, creatividad y reflexión que impulsa concursos de escritura, pensamiento crítico y nuevas voces juveniles.",
                enlace: "https://www.instagram.com/p/DVtmvruFDt4/"
            }
        ]
    },
    {
        id: "youth-plus",
        nombre: "Youth Plus",
        logo: "images/logo_ong/youth_plus.webp",
        descripcion: "Organización juvenil internacional creada por y para jóvenes que promueve la participación ciudadana, el liderazgo y el empoderamiento adolescente mediante proyectos educativos, políticos, ambientales y sociales.",
        mision: "Informar, orientar y hacer partícipes a adolescentes y jóvenes sobre política, educación, cambio climático y reducción de desigualdades, fortaleciendo su crecimiento personal y su capacidad de generar cambio.",
        vision: "Convertirse en una comunidad juvenil referente a nivel nacional e internacional por impulsar liderazgo, participación ciudadana y desarrollo integral mediante proyectos, alianzas y espacios formativos innovadores.",
        publico: "Adolescentes y jóvenes de 14 a 25 años interesados en política, liderazgo, educación, cambio climático y reducción de desigualdades.",
        region: "Lima, Perú; alcance nacional e internacional",
        fechaFundacion: "28 de enero de 2026",
        impacto: {
            directo: 150,
            indirecto: 500,
            miembros: 63
        },
        ods: [
            "ODS 4 · Educación de calidad",
            "ODS 5 · Igualdad de género",
            "ODS 10 · Reducción de las desigualdades",
            "ODS 13 · Acción por el clima"
        ],
        reconocimientoGubernamental: true,
        redes: {
            instagram: "https://www.instagram.com/youth.plus.organization",
            facebook: "https://www.facebook.com/profile.php?id=61587399263543",
            linkedin: "https://www.linkedin.com/in/youth-plus-organizaci%C3%B3n-7985a73a9/"
        },
        proyectos: [
            {
                nombre: "Política desde el Cole",
                descripcion: "Curso latinoamericano de cuatro módulos sobre ciencias políticas, relaciones internacionales, participación juvenil y construcción de perfil. Registró 218 inscripciones.",
                enlace: "https://www.instagram.com/p/DVZxatlj2BW/"
            },
            {
                nombre: "Climate Action Lab",
                descripcion: "Bootcamp de tres sesiones para acercar a jóvenes al activismo medioambiental y al diseño de acciones frente al cambio climático.",
                enlace: "https://www.instagram.com/p/DVmsVmuDsmU/"
            },
            {
                nombre: "Dynamic English",
                descripcion: "Curso virtual de seis sesiones para fortalecer competencias prácticas de inglés en adolescentes y jóvenes.",
                enlace: "https://www.instagram.com/p/DV_jO5YkRpJ/"
            },
            {
                nombre: "Conec-tate: Hackea tu Futuro",
                descripcion: "Bootcamp de seis sesiones sobre programación, datos, inteligencia artificial, desarrollo web, ciberseguridad y emprendimiento tecnológico.",
                enlace: "https://www.instagram.com/p/DWusoOVFM-h/"
            }
        ]
    },
    {
        id: "house-of-young-promises",
        nombre: "House of Young Promises",
        logo: "images/logo_ong/house_of_the_young_promises.webp",
        descripcion: "Organización juvenil nacional, autónoma y sin fines de lucro con sede en Tacna. Es un ecosistema diseñado por estudiantes para cerrar brechas de información académica y transformar el potencial juvenil en impacto social.",
        mision: "Empoderar a estudiantes de secundaria mediante acompañamiento estratégico en liderazgo, redacción y preparación para oportunidades globales, cerrando la brecha de información académica.",
        vision: "Ser la red juvenil referente del país que transforma el potencial académico en impacto social tangible, formando la próxima generación de becarios y líderes sociales.",
        publico: "Escolares de nivel secundaria.",
        region: "Perú, con sede en Tacna",
        fechaFundacion: "7 de marzo de 2026",
        impacto: {
            directo: 65,
            indirecto: 252,
            miembros: 65
        },
        ods: [
            "ODS 4 · Educación de calidad",
            "ODS 17 · Alianzas para lograr los objetivos"
        ],
        reconocimientoGubernamental: false,
        redes: {
            instagram: "https://www.instagram.com/houseofyoungpromises/",
            linkedin: "https://www.linkedin.com/in/house-of-young-promises-2034823a7/"
        },
        proyectos: [
            {
                nombre: "1.er Censo Nacional de Aspiraciones Juveniles",
                descripcion: "Proyecto desplegado en las 26 regiones del Perú para identificar barreras académicas, socioeconómicas, informativas y aspiracionales de la juventud.",
                enlace: "https://www.instagram.com/p/DXX3LkDAAdV/"
            },
            {
                nombre: "Encuentro Juvenil en favor de la Cultura",
                descripcion: "Iniciativa de diálogo y participación para visibilizar talento juvenil, identidad cultural y colaboración entre organizaciones.",
                enlace: "https://www.instagram.com/p/DX8H3VxgMX6/"
            }
        ]
    },
    {
        id: "green-generation",
        nombre: "Green Generation",
        logo: "images/logo_ong/green_generation.webp",
        descripcion: "Organización juvenil latinoamericana que promueve el desarrollo de una generación comprometida con la sostenibilidad ambiental.",
        mision: "Formar jóvenes líderes ambientales capaces de generar cambios sostenibles en sus comunidades mediante educación, acción e innovación.",
        vision: "Ser la generación latinoamericana que convive y se desarrolla en armonía con el ambiente, adoptando prácticas sostenibles que sean referentes a nivel global.",
        publico: "Jóvenes de 14 a 25 años.",
        region: "Perú, con alcance latinoamericano",
        fechaFundacion: "17 de enero de 2024",
        impacto: {
            directo: 400,
            indirecto: 800,
            miembros: 14
        },
        ods: [
            "ODS 3 · Salud y bienestar",
            "ODS 4 · Educación de calidad",
            "ODS 13 · Acción por el clima"
        ],
        reconocimientoGubernamental: true,
        redes: {
            instagram: "https://www.instagram.com/green_generation_oficial/",
            facebook: "https://www.facebook.com/profile.php?id=61573878930361",
            youtube: "https://www.youtube.com/@GreenGeneration-n5n",
            linkedin: "https://www.linkedin.com/in/green-generation-45b181379"
        },
        proyectos: [
            {
                nombre: "Pasaporte STEM: Sostenibilidad y Ambiente",
                descripcion: "Cinco sesiones sobre energías renovables, agricultura sostenible, design thinking, biorremediación y gestión del agua.",
                enlace: "https://www.instagram.com/p/DJMrcxLxl1Y/"
            },
            {
                nombre: "Basura Challenge",
                descripcion: "Campaña de limpieza de cuatro áreas naturales y urbanas, incluyendo playas de Lima y espacios costeros y fluviales de Chimbote.",
                enlace: "https://www.instagram.com/p/DPNfCKNjow_/"
            },
            {
                nombre: "Forjando Liderazgo",
                descripcion: "Ciclo de cinco sesiones para desarrollar liderazgo, propósito, impacto cotidiano y marca personal en jóvenes.",
                enlace: "https://www.instagram.com/p/DKOTGhINByp/"
            }
        ]
    },
    {
        id: "red-mundial-jovenes-academicos",
        nombre: "Red Mundial de Jóvenes Académicos",
        sigla: "RMJA",
        logo: "https://drive.google.com/thumbnail?id=1TXnSIvCApvLpsMwTtPHwwKWBxTH-y3sp&sz=w500",
        descripcion: "Organización no gubernamental juvenil y sin fines de lucro orientada al desarrollo integral de adolescentes y jóvenes mediante pensamiento crítico, liderazgo y participación ciudadana.",
        mision: "Desarrollar, capacitar y ofrecer herramientas para fortalecer la competitividad de jóvenes y convertir su voz en acción a favor de la justicia, la equidad y el cambio social.",
        vision: "Ser una red internacional de líderes juveniles que promueva pensamiento crítico, equidad, justicia social y la construcción de un futuro sostenible y humano.",
        publico: "Estudiantes de secundaria y universitarios.",
        region: "Ambato, Ecuador; operación virtual internacional",
        fechaFundacion: "1 de febrero de 2026",
        impacto: {
            directo: 53,
            indirecto: 120,
            miembros: 10
        },
        ods: [
            "ODS 3 · Salud y bienestar",
            "ODS 4 · Educación de calidad",
            "ODS 5 · Igualdad de género",
            "ODS 6 · Agua limpia y saneamiento",
            "ODS 10 · Reducción de las desigualdades",
            "ODS 12 · Producción y consumo responsables",
            "ODS 13 · Acción por el clima",
            "ODS 14 · Vida submarina",
            "ODS 15 · Vida de ecosistemas terrestres",
            "ODS 16 · Paz, justicia e instituciones sólidas",
            "ODS 17 · Alianzas para lograr los objetivos"
        ],
        reconocimientoGubernamental: false,
        redes: {
            web: "https://rmjovenesacademicos.com",
            instagram: "https://www.instagram.com/jovenes_abc/",
            facebook: "https://www.facebook.com/abc.jovenes/"
        },
        proyectos: [
            {
                nombre: "Academia Diplomacia Joven · Munner Lab",
                descripcion: "Programa de ocho sesiones sobre Modelo de Naciones Unidas, diplomacia y relaciones internacionales, con 16 horas de formación para jóvenes de Ecuador y Latinoamérica.",
                enlace: "https://abc.rmjovenesacademicos.com"
            }
        ]
    }
];
