(() => {
    "use strict";

    // Sincronización incremental del formulario institucional.
    // Corte: 3 de agosto de 2026. Solo se incluyen altas o respuestas
    // posteriores a la última actualización pública del 26 de julio de 2026.
    const patches = [
        {
            id: "holo-astrum",
            descripcion: "Organización juvenil peruana sin fines de lucro, parte de Red Astrum, que busca transformar la vida de los adolescentes y jóvenes peruanos a través de la educación holística mediante talleres, círculos, programas y más, integrando dimensiones emocionales, mentales, sociales, físicas y espirituales para que puedan enfrentar los desafíos del mundo real.",
            mision: "Transformar la vida de los jóvenes peruanos a través de una educación holística que fomente su desarrollo integral.",
            vision: "Ser una organización referente en educación holística juvenil en el Perú y Latinoamérica, creando una comunidad consciente, empática y capaz.",
            publico: "Estudiantes de secundaria o egresados de nivel socioeconómico C y D, en búsqueda de orientación personal o con problemas personales.",
            region: "Perú",
            fechaFundacion: "1 de julio de 2025",
            impacto: {
                directo: 500,
                indirecto: 5000,
                miembros: 30
            },
            proyectos: [
                {
                    nombre: "Picnic en Lima",
                    descripcion: "El 21 de febrero de 2026 se realizó un picnic en el Parque de la Exposición para conectar socialmente y fortalecer los lazos entre las personas con el fin de promover la salud mental. La memoria reporta 16 participantes.",
                    enlace: "https://www.instagram.com/p/DVZOS_NEaC9/"
                },
                {
                    nombre: "Picnic en Chiclayo",
                    descripcion: "El 8 de marzo de 2026 se realizó un picnic en el Paseo de las Musas como réplica del Picnic en Lima. La memoria reporta la participación de 8 personas.",
                    enlace: "https://www.instagram.com/p/DVtzEKYkWot/"
                },
                {
                    nombre: "Picnic Latam",
                    descripcion: "Versión prototipo del Picnic en Lima realizada el 15 de febrero de 2026. Se desarrollaron seis juegos y se conectó a participantes de Latinoamérica para promover la salud mental.",
                    enlace: "https://www.instagram.com/p/DUl1xxmEaeU/"
                },
                {
                    nombre: "Concurso de poemas: ¿Qué quiero cambiar de mi colegio?",
                    descripcion: "Concurso de poemas que invitó a escolares de primero a quinto de secundaria de todo el Perú a expresar creativamente qué desean cambiar de sus instituciones educativas.",
                    enlace: "https://www.instagram.com/p/DW3_r7QxuWE/"
                },
                {
                    nombre: "Navidad en el Comedor Margarita Manrique",
                    descripcion: "Chocolatada realizada en diciembre junto al equipo de Astrum en favor de las familias del Comedor Margarita Manrique de Ancón.",
                    enlace: "https://www.instagram.com/p/DSq79FlEaWS/?img_index=1"
                }
            ]
        },
        {
            id: "rikchari",
            logo: "https://drive.google.com/thumbnail?id=1RNoXrsV_7fW46xyR65VO28Rne4OgtmPL&sz=w500",
            descripcion: "Rikchari es una organización juvenil sin fines de lucro que promueve el acceso equitativo a la educación, el liderazgo y el desarrollo integral de niños, adolescentes y jóvenes en comunidades vulnerables mediante proyectos educativos, culturales y sociales.",
            mision: "Impulsar oportunidades de aprendizaje, liderazgo y participación ciudadana para que niños, adolescentes y jóvenes desarrollen su máximo potencial y contribuyan al progreso de sus comunidades.",
            vision: "Ser una organización referente en el Perú por su impacto en la transformación educativa y el empoderamiento juvenil, construyendo comunidades con mayores oportunidades, equidad e innovación social.",
            publico: "Niños, adolescentes y jóvenes, especialmente estudiantes de instituciones educativas públicas y comunidades en situación de vulnerabilidad.",
            region: "Perú, Lima Norte",
            fechaFundacion: "24 de julio de 2025",
            impacto: {
                directo: 300,
                indirecto: 1200,
                miembros: 15
            },
            ods: [
                "ODS 4 · Educación de calidad",
                "ODS 10 · Reducción de las desigualdades",
                "ODS 17 · Alianzas para lograr los objetivos"
            ],
            proyectos: [
                {
                    nombre: "Inauguración de biblioteca escolar en Nuestra Señora de la Paz",
                    descripcion: "El 17 de septiembre de 2025 se inauguró una biblioteca escolar con aproximadamente 3,000 libros para estudiantes de inicial, primaria y secundaria. El proyecto incluyó mantenimiento de murales, instalación de estantes, traslado, clasificación y forrado de libros.",
                    enlace: "https://www.youtube.com/watch?v=1fR7usFUak0"
                },
                {
                    nombre: "Clases de preparación para el COAR",
                    descripcion: "Preparación gratuita para el examen cognitivo y la entrevista socioemocional del COAR, dirigida a estudiantes de segundo de secundaria de los colegios Nuestra Señora de la Paz y Sagrada Familia Apova, ubicados en Ex-Villas de Ancón.",
                    enlace: "https://drive.google.com/drive/folders/1zUEyq-hz4i1aU1zwu15eAWwragtxVbA1?usp=sharing"
                }
            ]
        }
    ];

    const additions = [
        {
            id: "oportunidades-con-impacto",
            nombre: "Oportunidades con Impacto",
            sigla: "OCI",
            logo: "https://drive.google.com/thumbnail?id=1ynRmlfnIY4oPr8yvBbbF4hL5FgpJX7fz&sz=w500",
            descripcion: "\"Una oportunidad puede cambiar una vida.\" Por eso existe Oportunidades con Impacto (OCI): una iniciativa que democratiza el acceso a oportunidades de desarrollo integral —becas, voluntariados, programas de liderazgo, intercambios, entre otras— para jóvenes de forma descentralizada, especialmente para quienes no tienen redes, referentes ni viven en la capital. Busca que más jóvenes descubran su potencial y se conviertan en agentes de cambio desde sus propias comunidades.",
            mision: "Democratizar el acceso a oportunidades de desarrollo para jóvenes, acercándoles información confiable, orientación práctica y contenido accesible que les permita descubrir, postular y aprovechar experiencias educativas, profesionales y de impacto social que transformen sus vidas.",
            vision: "Ser una organización juvenil referente en Latinoamérica por conectar a jóvenes con oportunidades transformadoras, construyendo una comunidad que impulse el liderazgo, el desarrollo personal y profesional, y la generación de impacto positivo en sus territorios.",
            publico: "Jóvenes de entre 18 y 29 años, principalmente estudiantes universitarios y jóvenes en transición al mundo profesional, que buscan crecer personal y profesionalmente, pero que no siempre cuentan con acceso a información, redes o referentes que les permitan descubrir y aprovechar oportunidades de desarrollo.",
            region: "Perú",
            fechaFundacion: "1 de julio de 2025",
            impacto: {
                directo: 500,
                indirecto: 50000,
                miembros: 2
            },
            ods: [
                "ODS 4 · Educación de calidad",
                "ODS 8 · Trabajo decente y crecimiento económico",
                "ODS 10 · Reducción de las desigualdades"
            ],
            reconocimientoGubernamental: false,
            redes: {
                instagram: "https://www.instagram.com/oportunidadesconimpacto/",
                linkedin: "https://www.linkedin.com/company/112524049"
            },
            proyectos: [
                {
                    nombre: "Recopilación de voluntariados mensuales",
                    descripcion: "Proyecto de curaduría y difusión de oportunidades de voluntariado nacionales e internacionales mediante videos cortos en redes sociales. Cada publicación reúne convocatorias verificadas, resume sus principales requisitos y beneficios y presenta la información de forma clara y accesible.",
                    enlace: "https://www.instagram.com/reel/DW-V89agCPu/"
                }
            ]
        },
        {
            id: "for-our-rights",
            nombre: "For Our Rights",
            sigla: "FOR",
            logo: "https://drive.google.com/thumbnail?id=1PiUf5tLM0vNGVmXAQc4JUQbBFcws18TN&sz=w500",
            descripcion: "FOR es una organización juvenil creada por y para jóvenes que busca informar, orientar y hacer partícipes a los adolescentes sobre la importancia de la salud y la política. Trabaja con los ODS 2, 3, 15 y 16, contribuyendo a fortalecer su crecimiento personal y su formación como agentes de cambio en sus comunidades.",
            mision: "FOR es una organización juvenil creada por y para jóvenes que busca informar, orientar y hacer partícipes a los adolescentes sobre la importancia de la salud y la política. Trabaja con los ODS 2, 3, 15 y 16, contribuyendo a fortalecer su crecimiento personal y su formación como agentes de cambio en sus comunidades.",
            vision: "Ser una organización referente a nivel nacional e internacional en la defensa de los derechos humanos, reconocida por generar un impacto sostenible en la calidad de vida de las personas, formando ciudadanos conscientes, críticos y comprometidos con la construcción de un mundo más equitativo, saludable y en armonía con la naturaleza.",
            publico: "Jóvenes de 14 a 25 años.",
            region: "Perú, Lima",
            fechaFundacion: "3 de abril de 2026",
            impacto: {
                directo: 120,
                indirecto: 1080,
                miembros: 15
            },
            ods: [
                "ODS 2 · Hambre cero",
                "ODS 3 · Salud y bienestar",
                "ODS 15 · Vida de ecosistemas terrestres",
                "ODS 16 · Paz, justicia e instituciones sólidas"
            ],
            reconocimientoGubernamental: true,
            redes: {
                instagram: "https://www.instagram.com/for.our.rights/",
                facebook: "https://www.facebook.com/people/For-Our-Rights/61588826231671/",
                linkedin: "https://www.linkedin.com/in/for-our-rights-undefined-88348a407/"
            },
            proyectos: [
                {
                    nombre: "Manos por las Patas · Voluntariado Animalista I",
                    descripcion: "El 17 de mayo de 2026 se desarrolló la jornada Manos por las Patas, organizada por For Our Rights y Aki, con actividades de alimentación, limpieza y cuidado de animales rescatados, además de sensibilización sobre tenencia responsable y adopción.",
                    enlace: "https://www.instagram.com/p/DYcayOVEbT8/?img_index=1"
                },
                {
                    nombre: "Manos por las Patas · Voluntariado Animalista II",
                    descripcion: "El 31 de mayo de 2026 se llevó a cabo una segunda jornada en Chorrillos con labores de limpieza, alimentación, organización de donaciones y cuidado de perros y gatos rescatados.",
                    enlace: "https://www.instagram.com/p/DYlMeGWsth7/"
                },
                {
                    nombre: "Congreso de Salud",
                    descripcion: "El 20 de junio de 2026 FOR participó como organización invitada en el Congreso de Salud organizado por IEEE EMBS, con ponencias y espacios de aprendizaje sobre prevención, información confiable y ciencias de la salud.",
                    enlace: "https://www.instagram.com/p/DZyf-CyjUm0/?img_index=3"
                },
                {
                    nombre: "Incubadora de ONGs",
                    descripcion: "Proyecto iniciado el 9 de junio de 2026 por For Our Rights en colaboración con Youth Plus y RIAC para fortalecer organizaciones juveniles y brindar herramientas de diseño, viabilidad e innovación social.",
                    enlace: "https://www.instagram.com/p/DY0bOEVCSoR/?img_index=1"
                },
                {
                    nombre: "Los Aprobados · Club de Estudio",
                    descripcion: "Actividad virtual realizada el 1 de junio de 2026 para resolver dudas, fortalecer conocimientos académicos y promover el aprendizaje colaborativo. La memoria reporta un total de 100 inscritos.",
                    enlace: "https://www.instagram.com/p/DZD3MogCRoa/?img_index=1"
                },
                {
                    nombre: "KAY ART · Concurso Artístico",
                    descripcion: "Concurso artístico dirigido a jóvenes de 15 a 29 años, con inscripciones del 15 de julio al 15 de agosto de 2026 y categorías de canto, artes visuales y escritura inspiradas en la identidad, la cultura y el talento peruano.",
                    enlace: "https://www.instagram.com/p/Da1Y0WkDOuD/"
                }
            ]
        }
    ];

    const organizationsById = new Map(ONGS.map(organization => [organization.id, organization]));

    patches.forEach(patch => {
        const organization = organizationsById.get(patch.id);
        if (organization) Object.assign(organization, patch);
    });

    additions.forEach(profile => {
        const existing = organizationsById.get(profile.id);
        if (existing) {
            Object.assign(existing, profile);
        } else {
            ONGS.push(profile);
            organizationsById.set(profile.id, profile);
        }
    });

    const ENGLISH_TRANSLATIONS = new Map([
        ["Perú, Lima Norte", "Peru, Northern Lima"],
        ["Perú, Lima", "Peru, Lima"],
        ["1 de julio de 2025", "July 1, 2025"],
        ["24 de julio de 2025", "July 24, 2025"],
        ["3 de abril de 2026", "April 3, 2026"],
        ["ODS 2 · Hambre cero", "SDG 2 · Zero Hunger"],
        ["ODS 8 · Trabajo decente y crecimiento económico", "SDG 8 · Decent Work and Economic Growth"],
        [patches[0].descripcion, "A Peruvian youth-led nonprofit and part of Red Astrum that seeks to transform the lives of Peruvian adolescents and young people through holistic education using workshops, circles, programs, and other activities that integrate emotional, mental, social, physical, and spiritual dimensions so they can face real-world challenges."],
        [patches[0].mision, "Transform the lives of young Peruvians through holistic education that fosters their overall development."],
        [patches[0].vision, "Become a leading organization in holistic youth education in Peru and Latin America, creating a conscious, empathetic, and capable community."],
        [patches[0].publico, "Secondary school students or graduates from socioeconomic groups C and D who seek personal guidance or face personal difficulties."],
        ["Picnic en Lima", "Lima Picnic"],
        [patches[0].proyectos[0].descripcion, "On February 21, 2026, a picnic was held at Parque de la Exposición to promote social connection and strengthen relationships in support of mental health. The report records 16 participants."],
        ["Picnic en Chiclayo", "Chiclayo Picnic"],
        [patches[0].proyectos[1].descripcion, "On March 8, 2026, a picnic was held at Paseo de las Musas as a replication of the Lima Picnic. The report records 8 participants."],
        ["Picnic Latam", "Latin America Picnic"],
        [patches[0].proyectos[2].descripcion, "A prototype of the Lima Picnic held on February 15, 2026. Six games were delivered and participants from across Latin America connected to promote mental health."],
        ["Concurso de poemas: ¿Qué quiero cambiar de mi colegio?", "Poetry contest: What do I want to change about my school?"],
        [patches[0].proyectos[3].descripcion, "A poetry contest inviting Peruvian students from the first through fifth years of secondary school to creatively express what they want to change about their educational institutions."],
        ["Navidad en el Comedor Margarita Manrique", "Christmas at the Margarita Manrique Community Kitchen"],
        [patches[0].proyectos[4].descripcion, "A Christmas chocolate event held in December with the Astrum team for families supported by the Margarita Manrique community kitchen in Ancón."],
        [patches[1].descripcion, "Rikchari is a youth-led nonprofit that promotes equitable access to education, leadership, and holistic development for children, adolescents, and young people in vulnerable communities through educational, cultural, and social projects."],
        [patches[1].mision, "Advance learning, leadership, and civic participation opportunities so children, adolescents, and young people can reach their full potential and contribute to the progress of their communities."],
        [patches[1].vision, "Become a leading organization in Peru for educational transformation and youth empowerment, building communities with greater opportunities, equity, and social innovation."],
        [patches[1].publico, "Children, adolescents, and young people, especially students from public educational institutions and communities experiencing vulnerability."],
        ["Inauguración de biblioteca escolar en Nuestra Señora de la Paz", "Opening of the Nuestra Señora de la Paz School Library"],
        [patches[1].proyectos[0].descripcion, "On September 17, 2025, a school library with approximately 3,000 books was opened for early-years, primary, and secondary students. The project included mural maintenance, shelving installation, book transport, classification, and covering."],
        ["Clases de preparación para el COAR", "COAR Preparation Classes"],
        [patches[1].proyectos[1].descripcion, "Free preparation for the COAR cognitive exam and socio-emotional interview, aimed at second-year secondary students from Nuestra Señora de la Paz and Sagrada Familia Apova schools in Ex-Villas de Ancón."],
        [additions[0].descripcion, "\"One opportunity can change a life.\" Oportunidades con Impacto (OCI) therefore democratizes decentralized access to holistic development opportunities—scholarships, volunteering, leadership programs, exchanges, and more—especially for young people who lack networks or mentors and do not live in the capital. It seeks to help more young people discover their potential and become agents of change in their own communities."],
        [additions[0].mision, "Democratize access to development opportunities for young people by providing reliable information, practical guidance, and accessible content that helps them discover, apply for, and benefit from educational, professional, and social-impact experiences that transform their lives."],
        [additions[0].vision, "Become a leading youth organization in Latin America for connecting young people with transformative opportunities, building a community that advances leadership, personal and professional development, and positive impact in their territories."],
        [additions[0].publico, "Young people aged 18 to 29, mainly university students and young professionals in transition who seek personal and professional growth but do not always have access to information, networks, or mentors that help them discover and benefit from development opportunities."],
        ["Recopilación de voluntariados mensuales", "Monthly Volunteer Opportunity Roundup"],
        [additions[0].proyectos[0].descripcion, "A project that curates and shares national and international volunteer opportunities through short social-media videos. Each post gathers verified calls, summarizes their main requirements and benefits, and presents the information clearly and accessibly."],
        [additions[1].descripcion, "FOR is a youth organization created by and for young people that seeks to inform, guide, and involve adolescents in health and politics. It works around SDGs 2, 3, 15, and 16, helping strengthen their personal growth and development as agents of change in their communities."],
        [additions[1].mision, "FOR is a youth organization created by and for young people that seeks to inform, guide, and involve adolescents in health and politics. It works around SDGs 2, 3, 15, and 16, helping strengthen their personal growth and development as agents of change in their communities."],
        [additions[1].vision, "Become a nationally and internationally recognized organization defending human rights, known for creating sustainable impact in people's quality of life and developing conscious, critical citizens committed to building a more equitable, healthy world in harmony with nature."],
        [additions[1].publico, "Young people aged 14 to 25."],
        ["Manos por las Patas · Voluntariado Animalista I", "Hands for Paws · Animal Welfare Volunteering I"],
        [additions[1].proyectos[0].descripcion, "On May 17, 2026, the Hands for Paws event was organized by For Our Rights and Aki, involving feeding, cleaning, and care for rescued animals as well as awareness-raising on responsible ownership and adoption."],
        ["Manos por las Patas · Voluntariado Animalista II", "Hands for Paws · Animal Welfare Volunteering II"],
        [additions[1].proyectos[1].descripcion, "On May 31, 2026, a second event was held in Chorrillos involving cleaning, feeding, donation organization, and care for rescued dogs and cats."],
        ["Congreso de Salud", "Health Congress"],
        [additions[1].proyectos[2].descripcion, "On June 20, 2026, FOR participated as a guest organization in the Health Congress organized by IEEE EMBS, featuring talks and learning spaces on prevention, reliable information, and health sciences."],
        ["Incubadora de ONGs", "NGO Incubator"],
        [additions[1].proyectos[3].descripcion, "A project launched on June 9, 2026, by For Our Rights in collaboration with Youth Plus and RIAC to strengthen youth organizations and provide tools for design, feasibility, and social innovation."],
        ["Los Aprobados · Club de Estudio", "Los Aprobados · Study Club"],
        [additions[1].proyectos[4].descripcion, "An online activity held on June 1, 2026, to answer questions, strengthen academic knowledge, and promote collaborative learning. The report records 100 registrations."],
        ["KAY ART · Concurso Artístico", "KAY ART · Arts Contest"],
        [additions[1].proyectos[5].descripcion, "An arts contest for young people aged 15 to 29, with registration from July 15 to August 15, 2026, and categories in singing, visual arts, and writing inspired by Peruvian identity, culture, and talent."]
    ]);

    const baseI18n = window.AstrumI18n;
    if (baseI18n) {
        window.AstrumI18n = Object.freeze({
            ...baseI18n,
            translateText(value = "") {
                if (baseI18n.getLanguage() !== "en") return value;
                return ENGLISH_TRANSLATIONS.get(value) || baseI18n.translateText(value);
            },
            searchable(value = "") {
                const base = baseI18n.searchable(value);
                const translated = ENGLISH_TRANSLATIONS.get(value);
                return translated ? `${base} ${translated}` : base;
            }
        });
    }
})();
