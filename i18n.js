(() => {
    "use strict";

    const STORAGE_KEY = "redastrum-language";
    const DEFAULT_LANGUAGE = "es";
    const SUPPORTED_LANGUAGES = new Set(["es", "en"]);
    const TRANSLATABLE_ATTRIBUTES = ["alt", "aria-label", "placeholder", "title"];
    const TRANSLATABLE_META_SELECTOR =
        'meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]';

    const MESSAGES = {
        es: {
            "language.group": "Seleccionar idioma",
            "language.es": "Ver sitio en español",
            "language.en": "Ver sitio en inglés",
            "language.changed.es": "Idioma cambiado a español.",
            "language.changed.en": "Idioma cambiado a inglés.",
            "common.updating": "Información en actualización",
            "team.photo": "Foto de {name}",
            "team.email": "Escribir a {name}",
            "team.linkedin": "LinkedIn de {name}",
            "ongs.network": "ONG de Red Astrum",
            "ongs.logo": "Logo de {name}",
            "ongs.open": "Abrir portal de {name}",
            "ongs.count.one": "1 organización",
            "ongs.count.many": "{count} organizaciones",
            "ong.website": "Sitio web",
            "ong.social": "{platform} de {name}",
            "ong.email": "Escribir a {name}",
            "ong.institutionalEmail": "Correo institucional",
            "ong.accreditationDescription": "Esta constancia emitida por Red Astrum acredita que {name} forma parte de la red institucional.",
            "ong.accreditationAria": "Ver constancia de acreditación institucional de {name} en PDF",
            "ong.impact.direct": "Personas impactadas directamente",
            "ong.impact.indirect": "Personas impactadas indirectamente",
            "ong.impact.members": "Miembros de la organización",
            "ong.recognition.yes": "La organización reporta reconocimiento por una entidad gubernamental.",
            "ong.recognition.no": "La organización no reporta actualmente reconocimiento por una entidad gubernamental.",
            "ong.project.defaultNetwork": "Proyecto desarrollado por {name} dentro del ecosistema Red Astrum.",
            "ong.project.default": "Proyecto desarrollado por {name}.",
            "ong.project.evidence": "Ver evidencia",
            "ong.notFound.title": "ONG no encontrada",
            "ong.notFound.message": "La organización solicitada no existe o aún no ha sido registrada.",
            "ong.notFound.link": "Volver al directorio"
        },
        en: {
            "language.group": "Choose language",
            "language.es": "View site in Spanish",
            "language.en": "View site in English",
            "language.changed.es": "Language changed to Spanish.",
            "language.changed.en": "Language changed to English.",
            "common.updating": "Information being updated",
            "team.photo": "Photo of {name}",
            "team.email": "Email {name}",
            "team.linkedin": "{name}'s LinkedIn profile",
            "ongs.network": "Red Astrum NGO",
            "ongs.logo": "{name} logo",
            "ongs.open": "Open the portal for {name}",
            "ongs.count.one": "1 organization",
            "ongs.count.many": "{count} organizations",
            "ong.website": "Website",
            "ong.social": "{name} on {platform}",
            "ong.email": "Email {name}",
            "ong.institutionalEmail": "Institutional email",
            "ong.accreditationDescription": "This certificate issued by Red Astrum confirms that {name} is part of the institutional network.",
            "ong.accreditationAria": "View {name}'s institutional accreditation certificate as a PDF",
            "ong.impact.direct": "People directly reached",
            "ong.impact.indirect": "People indirectly reached",
            "ong.impact.members": "Organization members",
            "ong.recognition.yes": "The organization reports recognition by a government entity.",
            "ong.recognition.no": "The organization currently reports no recognition by a government entity.",
            "ong.project.defaultNetwork": "A project developed by {name} within the Red Astrum ecosystem.",
            "ong.project.default": "A project developed by {name}.",
            "ong.project.evidence": "View evidence",
            "ong.notFound.title": "NGO not found",
            "ong.notFound.message": "The requested organization does not exist or has not been registered yet.",
            "ong.notFound.link": "Back to the directory"
        }
    };

    const ENGLISH_TRANSLATIONS = [
        // Navigation, global metadata and accessibility.
        ["Inicio", "Home"],
        ["Acerca de", "About"],
        ["Sobre nosotros", "About us"],
        ["Equipo", "Team"],
        ["ONGs", "NGOs"],
        ["Programas", "Programs"],
        ["Programas de Red Astrum", "Red Astrum programs"],
        ["Únete a Red Astrum", "Join Red Astrum"],
        ["Contacto", "Contact"],
        ["Servicios", "Services"],
        ["Servicios de Red Astrum", "Red Astrum services"],
        ["Abrir Astrum Certifica para verificar certificados, constancias y acreditaciones", "Open Astrum Certifica to verify certificates and accreditations"],
        ["Abrir menú", "Open menu"],
        ["Cerrar menú", "Close menu"],
        ["Navegación móvil", "Mobile navigation"],
        ["Logo Red Astrum", "Red Astrum logo"],
        ["Logo de Red Astrum", "Red Astrum logo"],
        ["Ir al inicio de Red Astrum", "Go to the Red Astrum homepage"],
        ["Ir a la siguiente sección", "Go to the next section"],
        ["© 2026 Red Astrum. Todos los derechos reservados.", "© 2026 Red Astrum. All rights reserved."],
        ["RUC: 20615815005", "Peruvian Tax ID (RUC): 20615815005"],
        ["RUC 20615815005", "Peruvian Tax ID (RUC) 20615815005"],
        ["Formulario de contacto Red Astrum", "Red Astrum contact form"],
        ["Confirmación del formulario de contacto", "Contact form confirmation"],
        ["Cargando…", "Loading…"],

        // Home.
        ["Educación integral para todos", "Holistic education for everyone"],
        ["Nacida el 1 de julio del 2025, la Red Astrum agrupa ONGs, agrupaciones estudiantiles y docentes para demostrar que la educación no tiene límites.", "Founded on July 1, 2025, Red Astrum brings together NGOs, student groups, and educators to prove that education has no limits."],
        ["Astronauta Red Astrum", "Red Astrum astronaut"],
        ["Conozca nuestro proyecto", "Discover our project"],
        ["MISIÓN", "MISSION"],
        ["Misión", "Mission"],
        ["Impulsar una educación integral basada en la practicidad del mundo real que forme jóvenes conscientes, críticos y capaces de transformar su realidad.", "Promote a holistic education grounded in real-world practice that develops conscious, critical young people who can transform their reality."],
        ["Icono misión", "Mission icon"],
        ["VISIÓN", "VISION"],
        ["Visión", "Vision"],
        ["Construir en Latinoamérica una educación fuera de lo convencional, donde los jóvenes desarrollen su mente, su propósito y su capacidad de cambiar el mundo.", "Build an unconventional model of education in Latin America where young people develop their minds, their purpose, and their ability to change the world."],
        ["Icono visión", "Vision icon"],
        ["Somos la primera red educativa juvenil que promueve el desarrollo de la educación holística en Perú y Latinoamérica.", "We are the first youth-led educational network promoting holistic education in Peru and Latin America."],
        ["El pensamiento Astrum", "The Astrum mindset"],
        ["Nos distinguimos por un liderazgo altruista y basado en el servicio. Desde esta visión desarrollamos nuestras iniciativas y formamos a estudiantes y docentes comprometidos con una educación más humana.", "We are guided by altruistic, service-based leadership. From this perspective, we develop our initiatives and support students and educators committed to a more humane education."],
        ["Icono pensamiento Astrum", "Astrum mindset icon"],
        ["En Red Astrum realizamos actividades como...", "At Red Astrum, our activities include..."],
        ["Formaciones internas de liderazgo", "Internal leadership training"],
        ["Formaciones internas basadas en el liderazgo", "Internal training in leadership"],
        ["Astrum y la cultura interna.", "and Astrum's internal culture."],
        ["Proyectos comunitarios", "Community projects"],
        ["Proyectos comunitarios diseñados a partir", "Community projects designed around"],
        ["de las ODS y la realidad nacional.", "the SDGs and Peru's national context."],
        ["Conferencia climática internacional", "International climate conference"],
        ["Espacios de networking como conferencias,", "Networking spaces such as conferences,"],
        ["cumbres y eventos informales.", "summits, and informal events."],
        ["Impacto de la Red Astrum", "Red Astrum's impact"],
        ["Proyectos educativos lanzados", "Educational projects launched"],
        ["Jóvenes peruanos alcanzados", "Young Peruvians reached"],
        ["ONGs de Red Astrum", "Red Astrum NGOs"],
        ["Instituciones aliadas globales", "Global partner institutions"],
        ["Miembros Astrum", "Astrum members"],
        ["Asesores de la Red Astrum", "Red Astrum advisors"],
        ["ONGs de la Red Astrum", "Red Astrum NGOs"],
        ["La Red Astrum opera principalmente a través de sus organizaciones juveniles, las cuales impulsan iniciativas educativas, sociales y de liderazgo. A continuación, se presentan las organizaciones que conforman esta red y que trabajan conjuntamente para generar impacto en la formación de jóvenes.", "Red Astrum operates primarily through its youth organizations, which lead educational, social, and leadership initiatives. These organizations make up our network and work together to create meaningful impact in young people's development."],
        ["Abrir portal de Holo Astrum", "Open the Holo Astrum portal"],
        ["Explorar organizaciones de Red Astrum", "Explore Red Astrum organizations"],
        ["Abrir portal de Yatimaq", "Open the Yatimaq portal"],
        ["Abrir portal de Girls in Science", "Open the Girls in Science portal"],
        ["Abrir portal de Unity", "Open the Unity portal"],
        ["Abrir portal de Bridges of Equity", "Open the Bridges of Equity portal"],
        ["Abrir portal de Green Generation", "Open the Green Generation portal"],
        ["Abrir portal de House of Young Promises", "Open the House of Young Promises portal"],
        ["Abrir portal de Youth Plus", "Open the Youth Plus portal"],
        ["Explorar portales de ONGs", "Explore NGO portals"],
        ["Contáctanos 😊", "Contact us 😊"],
        ["Nombre", "Name"],
        ["Tu nombre completo", "Your full name"],
        ["Organización (opcional)", "Organization (optional)"],
        ["Nombre de tu organización", "Your organization's name"],
        ["Correo electrónico", "Email address"],
        ["nombre@organizacion.org", "name@organization.org"],
        ["Asunto", "Subject"],
        ["Selecciona un asunto", "Select a subject"],
        ["Información general", "General information"],
        ["Unirme a Red Astrum", "Join Red Astrum"],
        ["Alianzas y colaboraciones", "Partnerships and collaborations"],
        ["Donaciones", "Donations"],
        ["Programas y talleres", "Programs and workshops"],
        ["Eventos", "Events"],
        ["Prensa", "Press"],
        ["Otros", "Other"],
        ["Mensaje", "Message"],
        ["Cuéntanos cómo podemos ayudarte", "Tell us how we can help"],
        ["Enviar mensaje", "Send message"],

        // About.
        ["Sobre nosotros — Red Astrum", "About us — Red Astrum"],
        ["Una red nacida para", "A network born to"],
        ["transformar", "transform"],
        ["la educación", "education"],
        ["La Red Astrum es una red educativa creada por jóvenes que impulsa una nueva forma de aprender: más libre, integral y orientada a transformar la sociedad.", "Red Astrum is a youth-created educational network advancing a new way of learning: freer, more holistic, and focused on transforming society."],
        ["Historia", "Our history"],
        ["De una iniciativa a una red", "From one initiative to a network"],
        ["Red Astrum nació a partir de Holo Astrum, una iniciativa educativa fundada en 2024 enfocada en enseñar ciencia y tecnología a jóvenes. Con el desarrollo de nuestros programas comprendimos que la educación debía ir más allá del conocimiento y enfocarse en el desarrollo integral del estudiante.", "Red Astrum grew out of Holo Astrum, an educational initiative founded in 2024 to teach science and technology to young people. As our programs evolved, we realized that education needed to go beyond knowledge and focus on each student's holistic development."],
        ["Así, el 1 de julio de 2025, junto a Holo Astrum y Yatimaq, nació Red Astrum con el propósito de conectar organizaciones juveniles y construir un ecosistema que impulse una educación más humana, colaborativa y transformadora.", "That is how Red Astrum was founded on July 1, 2025, together with Holo Astrum and Yatimaq: to connect youth organizations and build an ecosystem that advances a more humane, collaborative, and transformative education."],
        ["\"Descubrimos que educar no es dirigir, sino acompañar.\" — Jesús Gálvez", "\"We discovered that education is not about directing people, but walking alongside them.\" — Jesús Gálvez"],
        ["Nace Holo Astrum", "Holo Astrum is born"],
        ["Iniciativa enfocada en ciencia y tecnología para jóvenes peruanos.", "An initiative focused on science and technology for young Peruvians."],
        ["Expansión del enfoque", "A broader approach"],
        ["Comprendemos que la educación debe desarrollar al estudiante de forma integral.", "We recognize that education must support each student's holistic development."],
        ["Fundación de Red Astrum", "Red Astrum is founded"],
        ["Junto a Holo Astrum y Yatimaq, nace la red para conectar organizaciones juveniles.", "Together with Holo Astrum and Yatimaq, the network is created to connect youth organizations."],
        ["Hoy", "Today"],
        ["14 organizaciones de la Red", "14 network organizations"],
        ["Más de 2500 jóvenes peruanos alcanzados y creciendo en Latinoamérica.", "More than 2,500 young Peruvians reached, with a growing presence across Latin America."],
        ["Por qué nació", "Why we were founded"],
        ["La educación que necesitamos no existe todavía", "The education we need does not exist yet"],
        ["La educación convencional forma estudiantes pasivos. Red Astrum nace para construir una alternativa: una educación que desarrolle la mente, las emociones, los valores y el propósito de cada persona.", "Conventional education produces passive students. Red Astrum was created to build an alternative: an education that develops each person's mind, emotions, values, and sense of purpose."],
        ["Tradicional", "Traditional"],
        ["Memorizar contenidos", "Memorizing content"],
        ["El profesor dirige", "Teacher-led instruction"],
        ["Evaluación por exámenes", "Exam-based assessment"],
        ["Conocimiento desconectado", "Disconnected knowledge"],
        ["Holística", "Holistic"],
        ["Desarrolla mente y valores", "Develops the mind and values"],
        ["Pensamiento crítico", "Critical thinking"],
        ["Aprendizaje por experiencia", "Experiential learning"],
        ["Propósito y transformación", "Purpose and transformation"],
        ["Quiénes lo forman", "Who makes up our network"],
        ["Una comunidad de personas comprometidas", "A community of committed people"],
        ["Red Astrum reúne a distintos actores del ecosistema educativo que comparten una misma convicción: que la educación puede y debe ser diferente.", "Red Astrum brings together people and institutions across the educational ecosystem who share one conviction: education can and should be different."],
        ["Estudiantes", "Students"],
        ["Educadores", "Educators"],
        ["Instituciones", "Institutions"],
        ["Organizaciones juveniles", "Youth organizations"],
        ["Nuestra inteligencia artificial", "Our artificial intelligence"],
        ["Saturnday AI es la inteligencia estratégica y la IA oficial de Red Astrum. Está aquí para convertir ideas en planes, coordinar operaciones y potenciar el impacto de nuestra red.", "Saturnday AI is Red Astrum's strategic intelligence and official AI. It turns ideas into plans, coordinates operations, and amplifies our network's impact."],
        ["Apoya la planificación, el análisis, la preparación de documentos y el seguimiento de proyectos. Trabaja siempre bajo control humano: Saturnday AI recomienda y acompaña; las personas y los órganos autorizados toman las decisiones.", "It supports planning, analysis, document preparation, and project tracking. It always works under human oversight: Saturnday AI recommends and assists, while people and authorized governing bodies make the decisions."],
        ["Tecnología para potenciar personas, no para reemplazarlas.", "Technology that empowers people rather than replacing them."],
        ["Capacidades principales de Saturnday AI", "Saturnday AI's core capabilities"],
        ["IA oficial", "Official AI"],
        ["Inteligencia estratégica de Red Astrum", "Red Astrum's strategic intelligence"],
        ["Convierte ideas en planes", "Turns ideas into plans"],
        ["Coordina operaciones", "Coordinates operations"],
        ["Analiza y recomienda", "Analyzes and recommends"],
        ["Da seguimiento", "Tracks progress"],
        ["Decisiones humanas. Operaciones potenciadas por IA.", "Human decisions. AI-enhanced operations."],
        ["Liderazgo al servicio de los demás", "Leadership in service of others"],
        ["El Pensamiento Astrum", "The Astrum Mindset"],

        // G-Astrum.
        ["G-Astrum es el programa de clubes juveniles de Red Astrum: Política, Lectura, Videojuegos y Cine, con liderazgo compartido y aprendizaje práctico.", "G-Astrum is Red Astrum's youth club program for Politics, Reading, Video Games, and Film, built around shared leadership and practical learning."],
        ["G-Astrum | Programa de clubes juveniles de Red Astrum", "G-Astrum | Red Astrum Youth Club Program"],
        ["Cuatro clubes juveniles para explorar, participar, conectar y liderar dentro de Red Astrum.", "Four youth clubs where members can explore, participate, connect, and lead within Red Astrum."],
        ["El programa de clubes juveniles de Red Astrum.", "Red Astrum's youth club program."],
        ["G-Astrum, Comunidad de Líderes", "G-Astrum, Leadership Community"],
        ["Comunidad de Líderes · V2.0", "Leadership Community · V2.0"],
        ["Programa de clubes juveniles de Red Astrum", "Red Astrum Youth Club Program"],
        ["Tus intereses pueden convertirse en", "Your interests can become"],
        ["clubes reales.", "real clubs."],
        ["G-Astrum es el programa de clubes juveniles de Red Astrum.", "G-Astrum is Red Astrum's youth club program."],
        ["Reúne a jóvenes alrededor de temas que les importan para aprender haciendo, conversar con criterio, crear experiencias y asumir responsabilidades en comunidad.", "It brings young people together around topics they care about to learn by doing, engage in thoughtful discussion, create experiences, and take on responsibilities as a community."],
        ["No es una organización aparte:", "It is not a separate organization:"],
        ["es un sistema de clubes de Red Astrum donde jóvenes exploran, participan, conectan y lideran.", "it is a Red Astrum club system where young people explore, participate, connect, and lead."],
        ["Conocer los clubes", "Explore the clubs"],
        ["Ver convocatorias", "View opportunities"],
        ["Datos del piloto G-Astrum", "G-Astrum pilot data"],
        ["clubes piloto", "pilot clubs"],
        ["líderes", "leaders"],
        ["semanas", "weeks"],
        ["talleres por club", "workshops per club"],
        ["CLUBES", "CLUBS"],
        ["Política", "Politics"],
        ["Lectura", "Reading"],
        ["Videojuegos", "Video Games"],
        ["Cine", "Film"],
        ["Una comunidad para...", "A community to..."],
        ["Aprender haciendo y construir con otros.", "Learn by doing and build with others."],
        ["Explorar", "Explore"],
        ["Temas relevantes desde distintas perspectivas.", "Relevant topics from different perspectives."],
        ["Participar", "Participate"],
        ["Conversar, practicar, crear y colaborar.", "Discuss, practice, create, and collaborate."],
        ["Conectar", "Connect"],
        ["Con jóvenes, especialistas, aliados y organizaciones.", "Connect with young people, specialists, partners, and organizations."],
        ["Liderar", "Lead"],
        ["Actividades útiles para una comunidad real.", "Useful activities for a real community."],
        ["4 clubes · 8 líderes", "4 clubs · 8 leaders"],
        ["Cuatro intereses. Cuatro comunidades temáticas.", "Four interests. Four thematic communities."],
        ["El piloto contempla cuatro clubes, cada uno con dos líderes y una ruta de cuatro talleres durante un ciclo de ocho semanas.", "The pilot includes four clubs, each with two leaders and a four-workshop pathway over an eight-week cycle."],
        ["Logo Club Política", "Politics Club logo"],
        ["Ciudadanía y deliberación plural.", "Citizenship and pluralistic deliberation."],
        ["Logo Club Lectura", "Reading Club logo"],
        ["Comprensión y pensamiento crítico.", "Comprehension and critical thinking."],
        ["Logo Club Videojuegos", "Video Games Club logo"],
        ["Estrategia y convivencia digital.", "Strategy and positive digital interaction."],
        ["Logo Club Cine", "Film Club logo"],
        ["Lenguaje audiovisual y creación.", "Audiovisual language and creative work."],
        ["Cómo funciona", "How it works"],
        ["Un ciclo piloto de ocho semanas.", "An eight-week pilot cycle."],
        ["La ruta avanza desde la inducción de líderes hasta talleres, participación comunitaria y cierre del ciclo.", "The pathway progresses from leader onboarding to workshops, community participation, and the end-of-cycle review."],
        ["Inducción", "Onboarding"],
        ["Acuerdo de dupla y ajuste del plan.", "Pair agreement and plan refinement."],
        ["Activación", "Activation"],
        ["Presentación del club y primer taller.", "Club introduction and first workshop."],
        ["Profundización", "Deepening"],
        ["Segundo taller y comunidad.", "Second workshop and community building."],
        ["Aplicación", "Application"],
        ["Tercer taller y experiencia práctica.", "Third workshop and practical experience."],
        ["Cierre", "Closing"],
        ["Cuarto taller y evaluación del ciclo.", "Fourth workshop and cycle evaluation."],
        ["Dos líderes por club", "Two leaders per club"],
        ["Liderazgo compartido para sostener la experiencia.", "Shared leadership to sustain the experience."],
        ["Programa y Talleres", "Program and Workshops"],
        ["Diseño de contenidos, sesiones, facilitación y calidad formativa.", "Content design, sessions, facilitation, and learning quality."],
        ["Comunidad y Operaciones", "Community and Operations"],
        ["Convocatoria, comunicación, logística, convivencia y continuidad.", "Recruitment, communication, logistics, community well-being, and continuity."],
        ["Programa de clubes", "Club program"],
        ["Red Astrum → G-Astrum → Clubes", "Red Astrum → G-Astrum → Clubs"],
        ["Identidad propia, pertenencia institucional clara.", "A distinct identity with clear institutional belonging."],
        ["El lenguaje azul y amarillo distingue la experiencia de clubes, mientras Red Astrum permanece visible como su casa institucional.", "The blue-and-yellow visual language distinguishes the club experience while Red Astrum remains visible as its institutional home."],
        ["Próximas oportunidades", "Upcoming opportunities"],
        ["¿Quieres participar en un club G-Astrum?", "Would you like to join a G-Astrum club?"],
        ["Consulta únicamente las convocatorias y canales oficiales de Red Astrum.", "Use only Red Astrum's official opportunity listings and communication channels."],
        ["Ver oportunidades", "View opportunities"],
        ["G-Astrum · Programa de clubes juveniles de Red Astrum", "G-Astrum · Red Astrum Youth Club Program"],

        // Picnic Astrum.
        ["Picnic Astrum | Bienestar, conexión y comunidad", "Picnic Astrum | Well-being, connection, and community"],
        ["Una experiencia grupal de dos horas con movimiento, atención plena y conexión comunitaria para promover el bienestar al aire libre.", "A two-hour group experience combining movement, mindfulness, and community connection to promote well-being outdoors."],
        ["Ir al inicio de Red Astrum", "Go to the Red Astrum homepage"],
        ["Grupo de participantes sentado en círculo sobre el césped durante Picnic Astrum", "A group of participants sitting in a circle on the grass during Picnic Astrum"],
        ["Bienestar · conexión · comunidad", "Well-being · connection · community"],
        ["Una pausa al aire libre para", "An outdoor pause to"],
        ["reconectar", "reconnect"],
        ["Picnic Astrum es una experiencia grupal guiada que combina movimiento, juego, atención plena y conexión comunitaria en un ambiente inclusivo.", "Picnic Astrum is a guided group experience that combines movement, play, mindfulness, and community connection in an inclusive setting."],
        ["Quiero organizar un picnic", "I want to organize a picnic"],
        ["Conocer la experiencia", "Discover the experience"],
        ["2 horas", "2 hours"],
        ["de experiencia", "of activities"],
        ["A tu ritmo", "At your own pace"],
        ["participación flexible", "flexible participation"],
        ["Al aire libre", "Outdoors"],
        ["naturaleza y comunidad", "nature and community"],
        ["Mucho más que un picnic", "Much more than a picnic"],
        ["Un espacio cuidado para bajar el ritmo, compartir y volver al presente", "A welcoming space to slow down, share, and return to the present"],
        ["Durante dos horas, cada persona participa a su manera en dinámicas lúdicas, movimiento corporal, conversación cuidada, una merienda consciente y un cierre con una acción personal de autocuidado.", "Over two hours, each person participates in their own way through playful activities, body movement, thoughtful conversation, mindful snacking, and a closing moment focused on a personal self-care action."],
        ["No necesitas experiencia previa y nunca estás obligado a hablar o contar algo personal.", "You do not need any previous experience, and you are never required to speak or share anything personal."],
        ["Naturaleza", "Nature"],
        ["Un entorno abierto para hacer una pausa y volver al presente.", "An open setting where you can pause and return to the present."],
        ["Conexión", "Connection"],
        ["Oportunidades seguras de encuentro, apoyo y pertenencia.", "Safe opportunities to meet, support one another, and feel a sense of belonging."],
        ["Autocuidado", "Self-care"],
        ["Hidratación, merienda consciente y herramientas cotidianas.", "Hydration, mindful snacking, and practical everyday tools."],
        ["Así se vive", "What the experience is like"],
        ["Cinco momentos para reconectar", "Five moments to reconnect"],
        ["Llegada y batería social", "Arrival and social battery"],
        ["Elige una señal visual para comunicar cuánta interacción deseas y rompe el hielo con el Termómetro de Globos.", "Choose a visual signal to show how much interaction you want, then break the ice with the Balloon Thermometer."],
        ["Movimiento y estrés", "Movement and stress"],
        ["Agua, Cemento y Estresores invita a jugar y reconocer cómo responde el cuerpo ante la presión y el apoyo.", "Water, Concrete, and Stressors invites you to play and notice how your body responds to pressure and support."],
        ["Participantes conversando en una manta de picnic en un parque", "Participants talking on a picnic blanket in a park"],
        ["Merienda consciente", "Mindful snack"],
        ["Una pausa para observar sabores, texturas y sensaciones con ejercicios breves de atención plena.", "A pause to notice flavors, textures, and sensations through brief mindfulness exercises."],
        ["Telaraña de Soporte", "Support Web"],
        ["El grupo crea una red simbólica mientras comparte fortalezas, recursos o mensajes de apoyo.", "The group creates a symbolic web while sharing strengths, resources, and messages of support."],
        ["Plan personal y despedida", "Personal plan and farewell"],
        ["Cada participante elige una acción pequeña y realista de autocuidado para continuar después del picnic.", "Each participant chooses a small, realistic self-care action to continue after the picnic."],
        ["Manos de participantes sosteniendo una red de lana durante una dinámica grupal", "Participants' hands holding a yarn web during a group activity"],
        ["Tu ritmo también cuenta", "Your pace matters too"],
        ["Un espacio realmente inclusivo", "A truly inclusive space"],
        ["Conectar sin dejar de ser tú", "Connect while staying true to yourself"],
        ["Picnic Astrum reconoce que no todas las personas socializan de la misma manera. Por eso, la experiencia ofrece alternativas para participar con seguridad y autonomía.", "Picnic Astrum recognizes that not everyone socializes in the same way. That is why the experience offers different ways to participate safely and independently."],
        ["Puedes pasar u observar.", "You can pass or observe."],
        ["Tú eliges cuánto compartir.", "You choose how much to share."],
        ["Batería social visible.", "Visible social battery."],
        ["Señales para expresar tus límites de interacción.", "Signals that let you express your interaction boundaries."],
        ["Opciones no verbales.", "Nonverbal options."],
        ["Sin contacto visual forzado y con libertad para pausar.", "No forced eye contact, with the freedom to take a break."],
        ["Escucha cuidada.", "Thoughtful listening."],
        ["Sin comparar experiencias ni dar consejos automáticos.", "No comparing experiences or giving unsolicited advice."],
        ["Lo que nos dejó el piloto", "What we learned from the pilot"],
        ["Una experiencia que deja huella", "An experience that makes a lasting impression"],
        ["Resultados descriptivos de 22 respuestas recogidas después de la actividad, en tres fechas de junio y julio de 2026.", "Descriptive results from 22 responses collected after the activity across three dates in June and July 2026."],
        ["recomendaría la experiencia", "would recommend the experience"],
        ["21 de 22 personas", "21 out of 22 people"],
        ["reportó una mejora en su bienestar", "reported improved well-being"],
        ["al menos un poco mejor", "at least a little better"],
        ["en sensación de conexión", "sense of connection"],
        ["promedio autoinformado", "self-reported average"],
        ["en bienestar actual", "current well-being"],
        ["promedio de cinco indicadores", "average across five indicators"],
        ["Estas cifras reflejan percepciones posteriores a la actividad. No constituyen una evaluación clínica ni demuestran causalidad.", "These figures reflect participants' perceptions after the activity. They are not a clinical assessment and do not establish causality."],
        ["Voces del picnic", "Voices from the picnic"],
        ["Lo cuentan quienes estuvieron ahí", "Hear from those who were there"],
        ["Las actividades me ayudaron a dejar atrás el estrés del día a día y a conectar más.", "The activities helped me leave everyday stress behind and connect more deeply."],
        ["Pude conectar en un ambiente agradable y conocer nuevas perspectivas.", "I was able to connect in a welcoming environment and discover new perspectives."],
        ["Me ayudó a despejar la mente y salir de mi zona de confort.", "It helped me clear my mind and step outside my comfort zone."],
        ["Momentos Astrum", "Astrum moments"],
        ["La experiencia en imágenes", "The experience in pictures"],
        ["Grupo de participantes reunido al aire libre después de Picnic Astrum", "A group of participants gathered outdoors after Picnic Astrum"],
        ["Varias personas escriben en fichas durante una actividad de reflexión", "Several people writing on cards during a reflection activity"],
        ["Participantes en una presentación de Picnic Astrum en un espacio institucional", "Participants at a Picnic Astrum presentation in an institutional setting"],
        ["Reflexión y plan personal", "Reflection and personal plan"],
        ["Conexión y comunidad", "Connection and community"],
        ["Un formato que se adapta", "A flexible format"],
        ["Llévalo a tu espacio", "Bring it to your space"],
        ["Picnic Astrum puede realizarse con comunidades, instituciones educativas, organizaciones y equipos de trabajo.", "Picnic Astrum can be held for communities, educational institutions, organizations, and work teams."],
        ["Comunidades", "Communities"],
        ["Para fortalecer vínculos y crear nuevas redes de apoyo.", "Strengthen relationships and create new support networks."],
        ["Instituciones educativas", "Educational institutions"],
        ["Una experiencia de bienestar para adolescentes, jóvenes y personas adultas.", "A well-being experience for teenagers, young people, and adults."],
        ["Organizaciones y equipos", "Organizations and teams"],
        ["Para hacer una pausa compartida y cuidar la conexión humana.", "Take a shared pause and nurture human connection."],
        ["Antes de venir", "Before you join us"],
        ["Preguntas frecuentes", "Frequently asked questions"],
        ["¿Picnic Astrum es una terapia?", "Is Picnic Astrum a form of therapy?"],
        ["No. Es una experiencia comunitaria guiada de bienestar y conexión. No reemplaza psicoterapia, diagnóstico ni atención profesional.", "No. It is a guided community experience focused on well-being and connection. It does not replace psychotherapy, diagnosis, or professional care."],
        ["¿Cuánto dura?", "How long does it last?"],
        ["La experiencia completa dura aproximadamente dos horas.", "The full experience lasts approximately two hours."],
        ["¿Tengo que hablar o contar algo personal?", "Do I have to speak or share anything personal?"],
        ["No. Puedes pasar, observar o participar de forma no verbal. Tú eliges cuánto compartir.", "No. You can pass, observe, or participate nonverbally. You choose how much to share."],
        ["¿Quiénes pueden participar?", "Who can participate?"],
        ["Adolescentes, jóvenes y personas adultas, además de comunidades, instituciones educativas, organizaciones y equipos de trabajo.", "Teenagers, young people, and adults can participate, as can communities, educational institutions, organizations, and work teams."],
        ["¿Una organización puede realizar su propio Picnic Astrum?", "Can an organization host its own Picnic Astrum?"],
        ["Sí. El proyecto fue diseñado como un formato replicable con guía, fichas, materiales y preparación para facilitadores.", "Yes. The project was designed as a repeatable format with a guide, activity cards, materials, and facilitator preparation."],
        ["El próximo encuentro puede empezar contigo", "The next gathering can start with you"],
        ["Lleva Picnic Astrum a tu comunidad, institución o equipo", "Bring Picnic Astrum to your community, institution, or team"],
        ["Conversemos para crear una experiencia de dos horas que invite a pausar, moverse, compartir y fortalecer vínculos.", "Let us create a two-hour experience that invites people to pause, move, share, and strengthen relationships."],
        ["Escribir a Red Astrum", "Contact Red Astrum"],

        // Team.
        ["Equipo - Red Astrum", "Team - Red Astrum"],
        ["Conoce a los fundadores, el Consejo Supremo, el Núcleo Duro y el Consejo de ONGs de Red Astrum.", "Meet Red Astrum's founders, Supreme Council, Core Team, and NGO Council."],
        ["Nuestro", "Our"],
        ["Conoce a las personas que lideran, gestionan y representan a las organizaciones que integran Red Astrum.", "Meet the people who lead, manage, and represent the organizations that make up Red Astrum."],
        ["Filtrar equipo", "Filter the team"],
        ["Buscar por nombre, rol u ONG...", "Search by name, role, or NGO..."],
        ["Grupos del equipo", "Team groups"],
        ["Todos", "All"],
        ["Fundadores", "Founders"],
        ["Consejo Supremo", "Supreme Council"],
        ["Núcleo Duro", "Core Team"],
        ["Consejo de ONGs", "NGO Council"],
        ["Mostrando", "Showing"],
        ["perfiles únicos", "unique profiles"],
        ["Directorio institucional actualizado a agosto de 2026. El Consejo de ONGs reúne 14 representantes para 14 organizaciones.", "Institutional directory updated in August 2026. The NGO Council brings together 14 representatives from 14 organizations."],
        ["No se encontraron integrantes con ese filtro.", "No team members matched that filter."],
        ["Fundador · Presidente · Representante legal", "Founder · President · Legal representative"],
        ["Presidencia", "Office of the President"],
        ["Cofundador · Vicepresidente", "Co-founder · Vice President"],
        ["Vicepresidencia", "Office of the Vice President"],
        ["Cofundador · Tesorero", "Co-founder · Treasurer"],
        ["Tesorería", "Treasury"],
        ["Cofundador", "Co-founder"],
        ["Cofundadora", "Co-founder"],
        ["Cofundadora · Representante de Holo Astrum UNMSM", "Co-founder · Holo Astrum UNMSM Representative"],
        ["Coordinador de G-Astrum", "G-Astrum Coordinator"],
        ["Coordinadora de ONGs · Representante de House of Young Promises", "NGO Coordinator · House of Young Promises Representative"],
        ["Coordinadora de Asesores", "Advisors Coordinator"],
        ["Asesores", "Advisors"],
        ["Coordinador de Áreas de Apoyo", "Support Areas Coordinator"],
        ["Áreas de Apoyo", "Support Areas"],
        ["Directora de Marketing", "Marketing Director"],
        ["Miembro de Marketing", "Marketing Team Member"],
        ["Director de Tecnología", "Technology Director"],
        ["Tecnología", "Technology"],
        ["Miembro de Tecnología", "Technology Team Member"],
        ["Miembro de Secretaría", "Secretariat Team Member"],
        ["Secretaría", "Secretariat"],
        ["Directora de Gestión", "Operations Director"],
        ["Gestión", "Operations"],
        ["Miembro de Gestión", "Operations Team Member"],
        ["Representante de Bridges of Equity", "Bridges of Equity Representative"],
        ["Representante de Girls In Science", "Girls In Science Representative"],
        ["Representante de Green Generation", "Green Generation Representative"],
        ["Representante de Holo Astrum y Maywa", "Holo Astrum and Maywa Representative"],
        ["Representante de Holo Astrum PUCP", "Holo Astrum PUCP Representative"],
        ["Representante de Rikchari", "Rikchari Representative"],
        ["Representante de Unity", "Unity Representative"],
        ["Representante de Yatimaq", "Yatimaq Representative"],
        ["Representante de Youth Plus", "Youth Plus Representative"],
        ["Representante de Red Mundial de Jóvenes Académicos", "Red Mundial de Jóvenes Académicos Representative"],
        ["Representante de Oportunidades con Impacto", "Oportunidades con Impacto Representative"],

        // NGO directory and portal.
        ["ONGs - Red Astrum", "NGOs - Red Astrum"],
        ["Explora las organizaciones de Red Astrum, sus áreas de impacto, proyectos y resultados.", "Explore Red Astrum's organizations, their impact areas, projects, and results."],
        ["Ecosistema Astrum", "Astrum Ecosystem"],
        ["Conoce las organizaciones de nuestro ecosistema, sus áreas de impacto, proyectos y resultados. Selecciona una ONG para abrir su portal institucional.", "Discover the organizations in our ecosystem, their impact areas, projects, and results. Select an NGO to open its institutional portal."],
        ["Buscar organizaciones", "Search organizations"],
        ["Buscar por nombre, descripción o región", "Search by name, description, or region"],
        ["No encontramos organizaciones", "No organizations found"],
        ["Prueba con otro nombre, término o región.", "Try another name, keyword, or region."],
        ["Portal ONG - Red Astrum", "NGO Portal - Red Astrum"],
        ["Portal institucional de una organización integrante de Red Astrum.", "Institutional portal for a Red Astrum member organization."],
        ["Volver a ONGs", "Back to NGOs"],
        ["Enlaces institucionales", "Institutional links"],
        ["Secciones del portal", "Portal sections"],
        ["Información", "Information"],
        ["Impacto", "Impact"],
        ["Proyectos", "Projects"],
        ["Región", "Region"],
        ["Fundación", "Founded"],
        ["Documento de validez", "Validation document"],
        ["Acreditación institucional", "Institutional accreditation"],
        ["Código de constancia", "Certificate code"],
        ["Fecha de emisión", "Issue date"],
        ["Ver constancia PDF", "View certificate PDF"],
        ["Público objetivo", "Target audience"],
        ["Valor dentro de Red Astrum", "Value within Red Astrum"],
        ["Reconocimiento institucional", "Institutional recognition"],
        ["Objetivos de Desarrollo Sostenible", "Sustainable Development Goals"],
        ["Información en actualización", "Information being updated"],
        ["Esta organización aún no ha publicado indicadores de impacto.", "This organization has not published impact indicators yet."],
        ["Portafolio en actualización", "Portfolio being updated"],
        ["Los proyectos de esta organización se incorporarán próximamente.", "This organization's projects will be added soon."],
        ["ONG de Red Astrum", "Red Astrum NGO"],

        // Astrum Certifica.
        ["Verificador público de certificados, constancias, acreditaciones y reconocimientos emitidos mediante Astrum Certifica.", "Public verifier for certificates, accreditations, and recognitions issued through Astrum Certifica."],
        ["Verificador Astrum Certifica | Red Astrum", "Astrum Certifica Verifier | Red Astrum"],
        ["Volver al inicio de Red Astrum", "Back to the Red Astrum home page"],
        ["Educación holística", "Holistic education"],
        ["Volver al sitio web", "Back to the website"],
        ["Verificador público de Astrum Certifica", "Astrum Certifica public verifier"],
        ["Cargando el verificador seguro…", "Loading the secure verifier…"],
        ["La consulta muestra únicamente información institucional necesaria para validar el documento. No publica DNI, correos, evidencias ni información interna de auditoría.", "The lookup displays only the institutional information required to validate the document. It does not publish national ID numbers, email addresses, evidence, or internal audit information."],
        ["Verificación institucional mediante Astrum Certifica", "Institutional verification through Astrum Certifica"],
        ["Activa JavaScript para utilizar el verificador de Astrum Certifica.", "Enable JavaScript to use the Astrum Certifica verifier."],

        // Reusable organization data.
        ["Perú", "Peru"],
        ["Lima, Perú · comunidad PUCP", "Lima, Peru · PUCP community"],
        ["Lima, Perú · comunidad UNMSM", "Lima, Peru · UNMSM community"],
        ["Lima y otras comunidades del Perú", "Lima and other communities in Peru"],
        ["Lambayeque, Perú", "Lambayeque, Peru"],
        ["Lima, Perú; alcance nacional e internacional", "Lima, Peru; national and international reach"],
        ["Perú, con sede en Tacna", "Peru, based in Tacna"],
        ["Perú, con alcance latinoamericano", "Peru, with Latin American reach"],
        ["Ambato, Ecuador; operación virtual internacional", "Ambato, Ecuador; international virtual operations"],
        ["1 de enero de 2024", "January 1, 2024"],
        ["1 de febrero de 2026", "February 1, 2026"],
        ["1 de octubre de 2025", "October 1, 2025"],
        ["28 de enero de 2026", "January 28, 2026"],
        ["7 de marzo de 2026", "March 7, 2026"],
        ["17 de enero de 2024", "January 17, 2024"],
        ["18 de junio de 2026", "June 18, 2026"],
        ["28 de junio de 2026", "June 28, 2026"],
        ["3 de agosto de 2026", "August 3, 2026"],
        ["ODS 3 · Salud y bienestar", "SDG 3 · Good Health and Well-being"],
        ["ODS 4 · Educación de calidad", "SDG 4 · Quality Education"],
        ["ODS 5 · Igualdad de género", "SDG 5 · Gender Equality"],
        ["ODS 6 · Agua limpia y saneamiento", "SDG 6 · Clean Water and Sanitation"],
        ["ODS 10 · Reducción de las desigualdades", "SDG 10 · Reduced Inequalities"],
        ["ODS 12 · Producción y consumo responsables", "SDG 12 · Responsible Consumption and Production"],
        ["ODS 13 · Acción por el clima", "SDG 13 · Climate Action"],
        ["ODS 14 · Vida submarina", "SDG 14 · Life Below Water"],
        ["ODS 15 · Vida de ecosistemas terrestres", "SDG 15 · Life on Land"],
        ["ODS 16 · Paz, justicia e instituciones sólidas", "SDG 16 · Peace, Justice and Strong Institutions"],
        ["ODS 17 · Alianzas para lograr los objetivos", "SDG 17 · Partnerships for the Goals"],

        // Organization profiles and projects.
        ["Organización juvenil peruana sin fines de lucro que busca transformar la vida de adolescentes y jóvenes mediante una educación holística que integra dimensiones emocionales, mentales, sociales, físicas y espirituales.", "A Peruvian youth-led nonprofit seeking to transform the lives of adolescents and young people through holistic education that integrates emotional, mental, social, physical, and spiritual dimensions."],
        ["Desarrollar integralmente a adolescentes y jóvenes mediante experiencias educativas que articulen dimensiones emocionales, mentales, sociales, físicas y espirituales para enfrentar los desafíos del mundo real.", "Support the holistic development of adolescents and young people through educational experiences that connect emotional, mental, social, physical, and spiritual dimensions with real-world challenges."],
        ["Consolidarse como un referente latinoamericano en educación holística juvenil, formando personas conscientes, equilibradas y capaces de construir comunidades más humanas, resilientes y colaborativas.", "Become a Latin American benchmark for holistic youth education, developing conscious and balanced people who can build more humane, resilient, and collaborative communities."],
        ["Adolescentes y jóvenes peruanos.", "Peruvian adolescents and young people."],
        ["Aporta experiencia en educación holística y en el diseño de experiencias de aprendizaje para jóvenes.", "Contributes expertise in holistic education and in designing learning experiences for young people."],
        ["Talleres, círculos y programas que integran ciencia, arte, liderazgo y reflexión para fortalecer el desarrollo humano.", "Workshops, circles, and programs integrating science, art, leadership, and reflection to strengthen human development."],
        ["Convocatoria en seis áreas para sumar jóvenes a la gestión de proyectos, investigación, comunicaciones y alianzas.", "A call across six areas for young people to join project management, research, communications, and partnership work."],
        ["Formaciones Astrum", "Astrum Training"],
        ["Convocatoria de equipo 2026", "2026 Team Call"],
        ["Organización juvenil que busca brindar aprendizaje académico y oportunidades a niños, adolescentes y jóvenes de Latinoamérica.", "A youth organization that provides academic learning and opportunities to children, adolescents, and young people across Latin America."],
        ["Motivar a jóvenes a reconocer su potencial y transformar sus aspiraciones en iniciativas con propósito.", "Inspire young people to recognize their potential and turn their aspirations into purpose-driven initiatives."],
        ["Ser una comunidad latinoamericana que convierte los sueños y el potencial de niños y jóvenes en trayectorias educativas, proyectos con propósito y oportunidades reales de desarrollo.", "Be a Latin American community that turns the dreams and potential of children and young people into educational pathways, purpose-driven projects, and genuine development opportunities."],
        ["Jóvenes.", "Young people."],
        ["Aporta una mirada centrada en el potencial juvenil, la iniciativa y la construcción de propósito.", "Contributes a perspective centered on youth potential, initiative, and purpose."],
        ["Espacio institucional en desarrollo para compartir iniciativas, convocatorias y oportunidades dirigidas a jóvenes.", "An emerging institutional space for sharing initiatives, calls, and opportunities for young people."],
        ["Comunidad Maywa", "Maywa Community"],
        ["Agrupación estudiantil de la PUCP que fomenta una educación holística y práctica en la comunidad universitaria, creando espacios para aprender, reflexionar y crecer más allá del aula.", "A PUCP student organization that promotes practical, holistic education across the university community by creating spaces to learn, reflect, and grow beyond the classroom."],
        ["Promover una educación holística y práctica que fortalezca el aprendizaje, la reflexión, el bienestar y el desarrollo integral de estudiantes PUCP.", "Promote practical, holistic education that strengthens learning, reflection, well-being, and the overall development of PUCP students."],
        ["Ser la comunidad universitaria referente de la PUCP en formación holística, bienestar y liderazgo humano, integrando el conocimiento académico con el desarrollo personal y el servicio a la sociedad.", "Become PUCP's leading university community for holistic learning, well-being, and human-centered leadership by connecting academic knowledge with personal development and service to society."],
        ["Estudiantes de la Pontificia Universidad Católica del Perú.", "Students at the Pontifical Catholic University of Peru."],
        ["Conecta la educación integral con la experiencia universitaria y el bienestar estudiantil.", "Connects holistic education with the university experience and student well-being."],
        ["Encuentro dedicado a la salud mental, la conexión y el bienestar dentro de la comunidad universitaria.", "A gathering dedicated to mental health, connection, and well-being within the university community."],
        ["Actividades para que estudiantes conozcan, reflexionen y aprovechen mejor su vida universitaria.", "Activities that help students explore, reflect on, and make the most of university life."],
        ["Espacios más allá del aula", "Beyond the Classroom"],
        ["ONG estudiantil en la UNMSM e iniciativa de Red Astrum que fomenta una educación integral en la comunidad universitaria.", "A UNMSM student NGO and Red Astrum initiative promoting holistic education within the university community."],
        ["Crear experiencias de educación integral, bienestar y conexión que complementen la formación universitaria de estudiantes sanmarquinos.", "Create holistic education, well-being, and connection experiences that complement the university education of UNMSM students."],
        ["Ser la comunidad universitaria referente de la UNMSM en educación integral, bienestar y liderazgo consciente, fortaleciendo estudiantes capaces de transformar su entorno con humanidad y propósito.", "Become UNMSM's leading university community for holistic education, well-being, and conscious leadership, empowering students to transform their surroundings with humanity and purpose."],
        ["Estudiantes de la Universidad Nacional Mayor de San Marcos.", "Students at the National University of San Marcos."],
        ["Extiende la educación integral y el acompañamiento estudiantil a la comunidad sanmarquina.", "Extends holistic education and student support across the UNMSM community."],
        ["Encuentro juvenil enfocado en salud mental, conexión y bienestar.", "A youth gathering focused on mental health, connection, and well-being."],
        ["Organización juvenil de Red Astrum orientada al desarrollo de habilidades blandas para la vida, especialmente oratoria, liderazgo y comunicación.", "A Red Astrum youth organization focused on developing life skills, especially public speaking, leadership, and communication."],
        ["Fortalecer habilidades blandas en jóvenes para que se comuniquen, lideren y se desarrollen al máximo.", "Strengthen young people's soft skills so they can communicate, lead, and reach their full potential."],
        ["Ser una comunidad educativa referente en el desarrollo de comunicadores y líderes jóvenes con pensamiento crítico, capaces de participar, argumentar y generar impacto positivo en la sociedad.", "Become a leading educational community for developing young communicators and critical-thinking leaders who can participate, make persuasive arguments, and create a positive social impact."],
        ["Jóvenes y estudiantes.", "Young people and students."],
        ["Fortalece la comunicación, el liderazgo y las capacidades personales dentro del ecosistema Astrum.", "Strengthens communication, leadership, and personal capabilities within the Astrum ecosystem."],
        ["Contenidos y experiencias orientados a fortalecer oratoria, liderazgo y comunicación para la vida.", "Content and experiences designed to strengthen public speaking, leadership, and communication for life."],
        ["Formación en habilidades blandas", "Soft Skills Training"],
        ["Organización juvenil peruana sin fines de lucro que promueve educación científica y oportunidades formativas para niñas, adolescentes y jóvenes de zonas vulnerables, con énfasis en cerrar brechas de género en ciencia.", "A Peruvian youth-led nonprofit promoting science education and learning opportunities for girls, adolescents, and young people from vulnerable communities, with an emphasis on closing gender gaps in science."],
        ["Impactar positivamente en la educación, abrir caminos en STEM y brindar herramientas reales para que más jóvenes se desarrollen académica y profesionalmente sin que su procedencia o contexto sean una barrera.", "Create a positive educational impact, open pathways into STEM, and provide practical tools so more young people can grow academically and professionally regardless of their background or circumstances."],
        ["Ser una organización referente en el Perú y Latinoamérica por cerrar brechas de género y acceso en STEM, formando una generación diversa de niñas y jóvenes capaces de liderar la ciencia, la innovación y el desarrollo sostenible.", "Become a leading organization in Peru and Latin America for closing gender and access gaps in STEM and developing a diverse generation of girls and young women who can lead in science, innovation, and sustainable development."],
        ["Niñas, adolescentes y jóvenes de zonas vulnerables del Perú, con énfasis en mujeres y poblaciones vulnerables.", "Girls, adolescents, and young people from vulnerable communities in Peru, with an emphasis on women and underserved populations."],
        ["Organización asambleísta del Consejo Metropolitano de Participación de la Juventud de Lima, acreditada mediante la Constancia N.° 0010-2025.", "Member organization of Lima's Metropolitan Youth Participation Council, accredited through Certificate No. 0010-2025."],
        ["Aporta enfoque de equidad, divulgación científica y representación femenina dentro de la red.", "Contributes an equity lens, science outreach, and representation of women within the network."],
        ["Actividades de educación científica, biología, medicina y medio ambiente para acercar la ciencia a jóvenes y comunidades.", "Science education activities in biology, medicine, and the environment that bring science closer to young people and communities."],
        ["Espacios que promueven curiosidad científica, habilidades y liderazgo de niñas, adolescentes y jóvenes.", "Spaces that foster scientific curiosity, skills, and leadership among girls, adolescents, and young people."],
        ["Programas y charlas STEM", "STEM Programs and Talks"],
        ["Ciencia y liderazgo femenino", "Science and Women's Leadership"],
        ["Organización juvenil que desarrolla experiencias educativas sobre bienestar emocional, psicología y neurociencia, promoviendo la participación estudiantil y el impacto social.", "A youth organization that creates educational experiences around emotional well-being, psychology, and neuroscience while promoting student participation and social impact."],
        ["Fortalecer el bienestar emocional y la voz de estudiantes mediante programas STEAM, espacios formativos y alianzas juveniles.", "Strengthen students' emotional well-being and voice through STEAM programs, learning spaces, and youth partnerships."],
        ["Consolidarse como una red juvenil referente en bienestar emocional, educación STEAM y participación estudiantil, donde cada joven cuente con herramientas y espacios seguros para impulsar cambios equitativos.", "Become a leading youth network in emotional well-being, STEAM education, and student participation, where every young person has the tools and safe spaces to advance equitable change."],
        ["Estudiantes y jóvenes.", "Students and young people."],
        ["Aporta educación emocional, bienestar y experiencias STEAM con enfoque juvenil.", "Contributes emotional education, well-being, and youth-centered STEAM experiences."],
        ["Semana formativa de psicología y neurociencia dirigida a estudiantes.", "A week-long learning experience in psychology and neuroscience for students."],
        ["Alianzas y actividades para fortalecer el bienestar emocional, la participación estudiantil y el impacto educativo.", "Partnerships and activities that strengthen emotional well-being, student participation, and educational impact."],
        ["Pasaporte STEAM", "STEAM Passport"],
        ["Educación emocional juvenil", "Youth Emotional Education"],
        ["Organización juvenil que impulsa formación en liderazgo con propósito, empatía e impacto social.", "A youth organization advancing purpose-driven leadership, empathy, and social impact."],
        ["Acompañar a jóvenes para fortalecer su liderazgo, propósito personal y capacidad de generar una huella positiva en sus comunidades.", "Support young people in strengthening their leadership, personal purpose, and capacity to make a positive difference in their communities."],
        ["Ser un movimiento juvenil referente en liderazgo con propósito, capaz de movilizar a una generación empática que transforme positivamente sus comunidades.", "Become a leading youth movement for purpose-driven leadership, mobilizing an empathetic generation to transform their communities for the better."],
        ["Jóvenes interesados en liderazgo, propósito y acción social.", "Young people interested in leadership, purpose, and social action."],
        ["Aporta formación en liderazgo empático y herramientas para convertir el propósito juvenil en acción.", "Contributes empathetic leadership training and tools that turn young people's sense of purpose into action."],
        ["Programa formativo para jóvenes que fortalece propósito, empatía y liderazgo con impacto positivo.", "A youth training program that strengthens purpose, empathy, and leadership for positive impact."],
        ["Líderes con Huella", "Leaders Who Leave a Mark"],
        ["Iniciativa juvenil que promueve el liderazgo y la equidad social como herramientas de transformación comunitaria. Acompaña a jóvenes para que desarrollen iniciativas sociales, educativas y participativas con propósito.", "A youth initiative promoting leadership and social equity as tools for community transformation. It supports young people as they develop purpose-driven social, educational, and participatory initiatives."],
        ["Impulsar a jóvenes a liderar con propósito, desarrollando proyectos virtuales que promuevan la equidad, el liderazgo y la transformación positiva en sus comunidades.", "Empower young people to lead with purpose by developing virtual projects that promote equity, leadership, and positive change in their communities."],
        ["Consolidarse como una iniciativa juvenil de referencia en formación en liderazgo y equidad, impulsando agentes de cambio capaces de fortalecer comunidades más justas, empáticas y colaborativas.", "Become a leading youth initiative in leadership and equity education, developing changemakers who can build fairer, more empathetic, and collaborative communities."],
        ["Adolescentes y jóvenes de 15 a 25 años.", "Adolescents and young people ages 15 to 25."],
        ["Espacio de expresión, creatividad y reflexión que impulsa concursos de escritura, pensamiento crítico y nuevas voces juveniles.", "A space for expression, creativity, and reflection that promotes writing contests, critical thinking, and emerging youth voices."],
        ["Puentes de Tinta", "Bridges of Ink"],
        ["Organización juvenil internacional creada por y para jóvenes que promueve la participación ciudadana, el liderazgo y el empoderamiento adolescente mediante proyectos educativos, políticos, ambientales y sociales.", "An international youth organization created by and for young people that promotes civic participation, leadership, and adolescent empowerment through educational, political, environmental, and social projects."],
        ["Informar, orientar y hacer partícipes a adolescentes y jóvenes sobre política, educación, cambio climático y reducción de desigualdades, fortaleciendo su crecimiento personal y su capacidad de generar cambio.", "Inform, guide, and engage adolescents and young people in politics, education, climate change, and inequality reduction while strengthening their personal growth and capacity to create change."],
        ["Convertirse en una comunidad juvenil referente a nivel nacional e internacional por impulsar liderazgo, participación ciudadana y desarrollo integral mediante proyectos, alianzas y espacios formativos innovadores.", "Become a nationally and internationally recognized youth community advancing leadership, civic participation, and holistic development through innovative projects, partnerships, and learning spaces."],
        ["Adolescentes y jóvenes de 14 a 25 años interesados en política, liderazgo, educación, cambio climático y reducción de desigualdades.", "Adolescents and young people ages 14 to 25 interested in politics, leadership, education, climate change, and reducing inequalities."],
        ["Curso latinoamericano de cuatro módulos sobre ciencias políticas, relaciones internacionales, participación juvenil y construcción de perfil. Registró 218 inscripciones.", "A four-module Latin American course on political science, international relations, youth participation, and profile building. It received 218 registrations."],
        ["Bootcamp de tres sesiones para acercar a jóvenes al activismo medioambiental y al diseño de acciones frente al cambio climático.", "A three-session bootcamp introducing young people to environmental activism and the design of climate action."],
        ["Curso virtual de seis sesiones para fortalecer competencias prácticas de inglés en adolescentes y jóvenes.", "A six-session virtual course strengthening practical English skills among adolescents and young people."],
        ["Bootcamp de seis sesiones sobre programación, datos, inteligencia artificial, desarrollo web, ciberseguridad y emprendimiento tecnológico.", "A six-session bootcamp on programming, data, artificial intelligence, web development, cybersecurity, and technology entrepreneurship."],
        ["Política desde el Cole", "Politics from School"],
        ["Conec-tate: Hackea tu Futuro", "Connect: Hack Your Future"],
        ["Organización juvenil nacional, autónoma y sin fines de lucro con sede en Tacna. Es un ecosistema diseñado por estudiantes para cerrar brechas de información académica y transformar el potencial juvenil en impacto social.", "A nationwide, autonomous, youth-led nonprofit based in Tacna. It is an ecosystem designed by students to close academic information gaps and turn youth potential into social impact."],
        ["Empoderar a estudiantes de secundaria mediante acompañamiento estratégico en liderazgo, redacción y preparación para oportunidades globales, cerrando la brecha de información académica.", "Empower secondary school students through strategic support in leadership, writing, and preparation for global opportunities, closing the academic information gap."],
        ["Ser la red juvenil referente del país que transforma el potencial académico en impacto social tangible, formando la próxima generación de becarios y líderes sociales.", "Become the country's leading youth network for turning academic potential into tangible social impact and developing the next generation of scholarship recipients and social leaders."],
        ["Escolares de nivel secundaria.", "Secondary school students."],
        ["Proyecto desplegado en las 26 regiones del Perú para identificar barreras académicas, socioeconómicas, informativas y aspiracionales de la juventud.", "A project deployed across Peru's 26 regions to identify the academic, socioeconomic, informational, and aspirational barriers facing young people."],
        ["Iniciativa de diálogo y participación para visibilizar talento juvenil, identidad cultural y colaboración entre organizaciones.", "A dialogue and participation initiative highlighting youth talent, cultural identity, and collaboration among organizations."],
        ["1.er Censo Nacional de Aspiraciones Juveniles", "1st National Youth Aspirations Census"],
        ["Encuentro Juvenil en favor de la Cultura", "Youth Gathering for Culture"],
        ["Organización juvenil latinoamericana que promueve el desarrollo de una generación comprometida con la sostenibilidad ambiental.", "A Latin American youth organization developing a generation committed to environmental sustainability."],
        ["Formar jóvenes líderes ambientales capaces de generar cambios sostenibles en sus comunidades mediante educación, acción e innovación.", "Develop young environmental leaders who can create sustainable change in their communities through education, action, and innovation."],
        ["Ser la generación latinoamericana que convive y se desarrolla en armonía con el ambiente, adoptando prácticas sostenibles que sean referentes a nivel global.", "Be the Latin American generation that lives and grows in harmony with the environment, adopting sustainable practices that set a global example."],
        ["Jóvenes de 14 a 25 años.", "Young people ages 14 to 25."],
        ["Cinco sesiones sobre energías renovables, agricultura sostenible, design thinking, biorremediación y gestión del agua.", "Five sessions on renewable energy, sustainable agriculture, design thinking, bioremediation, and water management."],
        ["Campaña de limpieza de cuatro áreas naturales y urbanas, incluyendo playas de Lima y espacios costeros y fluviales de Chimbote.", "A cleanup campaign across four natural and urban areas, including beaches in Lima and coastal and river environments in Chimbote."],
        ["Ciclo de cinco sesiones para desarrollar liderazgo, propósito, impacto cotidiano y marca personal en jóvenes.", "A five-session series developing leadership, purpose, everyday impact, and personal branding among young people."],
        ["Pasaporte STEM: Sostenibilidad y Ambiente", "STEM Passport: Sustainability and Environment"],
        ["Forjando Liderazgo", "Forging Leadership"],
        ["Organización no gubernamental juvenil y sin fines de lucro orientada al desarrollo integral de adolescentes y jóvenes mediante pensamiento crítico, liderazgo y participación ciudadana.", "A youth-led nonprofit and nongovernmental organization focused on the holistic development of adolescents and young people through critical thinking, leadership, and civic participation."],
        ["Desarrollar, capacitar y ofrecer herramientas para fortalecer la competitividad de jóvenes y convertir su voz en acción a favor de la justicia, la equidad y el cambio social.", "Develop, train, and provide tools that strengthen young people's capabilities and turn their voices into action for justice, equity, and social change."],
        ["Ser una red internacional de líderes juveniles que promueva pensamiento crítico, equidad, justicia social y la construcción de un futuro sostenible y humano.", "Be an international network of youth leaders promoting critical thinking, equity, social justice, and the construction of a sustainable and humane future."],
        ["Estudiantes de secundaria y universitarios.", "Secondary school and university students."],
        ["Programa de ocho sesiones sobre Modelo de Naciones Unidas, diplomacia y relaciones internacionales, con 16 horas de formación para jóvenes de Ecuador y Latinoamérica.", "An eight-session program on Model United Nations, diplomacy, and international relations, providing 16 hours of training for young people in Ecuador and Latin America."],
        ["Academia Diplomacia Joven · Munner Lab", "Youth Diplomacy Academy · Munner Lab"]
    ];

    function normalizeKey(value) {
        return String(value || "").trim().replace(/\s+/g, " ");
    }

    const englishBySpanish = new Map(
        ENGLISH_TRANSLATIONS.map(([spanish, english]) => [normalizeKey(spanish), english])
    );

    Object.keys(MESSAGES.es).forEach(key => {
        const spanish = MESSAGES.es[key];
        const english = MESSAGES.en[key];
        if (!spanish.includes("{") && spanish !== english) {
            englishBySpanish.set(normalizeKey(spanish), english);
        }
    });

    function formatMessage(message, variables = {}) {
        return Object.entries(variables).reduce((result, [key, value]) => {
            return result.replace(new RegExp("\\{" + key + "\\}", "g"), String(value));
        }, message);
    }

    function resolveInitialLanguage() {
        const params = new URLSearchParams(window.location.search);
        const requestedLanguage = params.get("lang");
        if (SUPPORTED_LANGUAGES.has(requestedLanguage)) return requestedLanguage;

        try {
            const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
            if (SUPPORTED_LANGUAGES.has(storedLanguage)) return storedLanguage;
        } catch {
            // Storage can be unavailable in privacy-restricted browser contexts.
        }

        return DEFAULT_LANGUAGE;
    }

    let currentLanguage = resolveInitialLanguage();
    const textNodeState = new WeakMap();
    const attributeState = new WeakMap();
    let liveRegion = null;

    function translatePattern(value, language) {
        if (language !== "en") return value;

        const normalized = normalizeKey(value);
        const organizationCount = normalized.match(/^(\d+) organizaciones$/);
        if (organizationCount) {
            const count = Number(organizationCount[1]);
            return count === 1 ? "1 organization" : organizationCount[1] + " organizations";
        }

        return englishBySpanish.get(normalized) || value;
    }

    function translateText(value, language = currentLanguage) {
        if (typeof value !== "string" || language === "es") return value;
        return translatePattern(value, language);
    }

    function t(key, variables = {}, language = currentLanguage) {
        const catalog = MESSAGES[language] || MESSAGES[DEFAULT_LANGUAGE];
        const fallbackCatalog = MESSAGES[DEFAULT_LANGUAGE];
        const message = catalog[key] || fallbackCatalog[key] || key;
        return formatMessage(message, variables);
    }

    function searchable(value) {
        const source = String(value || "");
        const english = translateText(source, "en");
        return english === source ? source : source + " " + english;
    }

    function preserveWhitespace(source, translatedCore) {
        const leading = source.match(/^\s*/)?.[0] || "";
        const trailing = source.match(/\s*$/)?.[0] || "";
        return leading + translatedCore + trailing;
    }

    function shouldIgnoreTextNode(node) {
        const parent = node.parentElement;
        return !parent || Boolean(parent.closest("script, style, template"));
    }

    function translateTextNode(node) {
        if (shouldIgnoreTextNode(node)) return;

        let state = textNodeState.get(node);
        if (!state) {
            state = { source: node.nodeValue, rendered: node.nodeValue };
            textNodeState.set(node, state);
        } else if (node.nodeValue !== state.rendered) {
            state.source = node.nodeValue;
        }

        const core = state.source.trim();
        if (!core) {
            state.rendered = state.source;
            return;
        }

        const translated = translateText(core);
        const rendered = preserveWhitespace(state.source, translated);
        state.rendered = rendered;

        if (node.nodeValue !== rendered) node.nodeValue = rendered;
    }

    function getAttributeSource(element, attributeName) {
        let states = attributeState.get(element);
        if (!states) {
            states = new Map();
            attributeState.set(element, states);
        }

        const currentValue = element.getAttribute(attributeName);
        let state = states.get(attributeName);

        if (!state) {
            state = { source: currentValue, rendered: currentValue };
            states.set(attributeName, state);
        } else if (currentValue !== state.rendered) {
            state.source = currentValue;
        }

        return state;
    }

    function translateAttribute(element, attributeName) {
        if (!element.hasAttribute(attributeName)) return;
        if (attributeName === "content" && !element.matches(TRANSLATABLE_META_SELECTOR)) return;

        const state = getAttributeSource(element, attributeName);
        if (state.source === null) return;

        const rendered = translateText(state.source);
        state.rendered = rendered;

        if (element.getAttribute(attributeName) !== rendered) {
            element.setAttribute(attributeName, rendered);
        }
    }

    function localizeInternalLink(element) {
        if (!element.matches?.("a[href]")) return;

        const rawHref = element.getAttribute("href");
        if (!rawHref || rawHref.startsWith("#")) return;

        let url;
        try {
            url = new URL(rawHref, window.location.origin);
        } catch {
            return;
        }

        if (!["http:", "https:"].includes(url.protocol)) return;
        if (url.origin !== window.location.origin) return;

        const extension = url.pathname.split("/").pop()?.includes(".")
            ? url.pathname.split(".").pop()?.toLowerCase()
            : "";
        if (extension && extension !== "html") return;

        if (currentLanguage === DEFAULT_LANGUAGE) {
            url.searchParams.delete("lang");
        } else {
            url.searchParams.set("lang", currentLanguage);
        }

        const localizedHref = url.pathname + url.search + url.hash;
        if (rawHref !== localizedHref) element.setAttribute("href", localizedHref);
    }

    function localizeEmbeddedFrame(element) {
        if (!element.matches?.('iframe[src*="docs.google.com/forms"]')) return;

        const rawSource = element.getAttribute("src");
        if (!rawSource) return;

        const url = new URL(rawSource, window.location.href);
        if (currentLanguage === "en") {
            url.searchParams.set("hl", "en");
        } else {
            url.searchParams.delete("hl");
        }

        if (url.toString() !== rawSource) {
            element.setAttribute("src", url.toString());
        }
    }

    function translateElement(element) {
        TRANSLATABLE_ATTRIBUTES.forEach(attributeName => {
            translateAttribute(element, attributeName);
        });
        if (element.matches?.(TRANSLATABLE_META_SELECTOR)) {
            translateAttribute(element, "content");
        }
        localizeInternalLink(element);
        localizeEmbeddedFrame(element);
    }

    function applyTranslations(root = document) {
        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return;
        }

        if (root.nodeType === Node.ELEMENT_NODE) translateElement(root);

        const ownerDocument = root.nodeType === Node.DOCUMENT_NODE
            ? root
            : root.ownerDocument;
        if (!ownerDocument) return;

        const walker = ownerDocument.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
        );

        let node = walker.nextNode();
        while (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                translateTextNode(node);
            } else {
                translateElement(node);
            }
            node = walker.nextNode();
        }
    }

    function createLanguageSwitcher(modifier) {
        const switcher = document.createElement("div");
        switcher.className = "language-switcher " + modifier;
        switcher.setAttribute("role", "group");
        switcher.setAttribute("aria-label", MESSAGES.es["language.group"]);

        ["es", "en"].forEach(language => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "language-switcher__button";
            button.dataset.language = language;
            button.textContent = language.toUpperCase();
            button.setAttribute("aria-label", MESSAGES.es["language." + language]);
            button.addEventListener("click", () => setLanguage(language));
            switcher.appendChild(button);
        });

        return switcher;
    }

    function injectLanguageControls() {
        const mainHeader = document.querySelector("header:not(.site-header)");
        const desktopActions = mainHeader?.querySelector(":scope > .box-icons");
        if (desktopActions && !desktopActions.querySelector(".language-switcher")) {
            desktopActions.appendChild(createLanguageSwitcher("language-switcher--desktop"));
        }

        const sidebar = document.querySelector(".sidebar");
        if (sidebar && !sidebar.querySelector(".language-switcher")) {
            const switcher = createLanguageSwitcher("language-switcher--mobile");
            const socialLinks = sidebar.querySelector(".social-sidebar");
            sidebar.insertBefore(switcher, socialLinks || null);
        }

        const verifierHeader = document.querySelector(".site-header");
        if (verifierHeader && !verifierHeader.querySelector(".language-switcher")) {
            const switcher = createLanguageSwitcher("language-switcher--verifier");
            const backLink = verifierHeader.querySelector(".back-link");
            verifierHeader.insertBefore(switcher, backLink || null);
        }

        liveRegion = document.createElement("span");
        liveRegion.className = "i18n-sr-only";
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        document.body.appendChild(liveRegion);
    }

    function updateLanguageControls() {
        document.querySelectorAll(".language-switcher__button").forEach(button => {
            const isActive = button.dataset.language === currentLanguage;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    function syncLanguageUrl() {
        if (window.location.protocol === "file:") return;

        const url = new URL(window.location.href);
        if (currentLanguage === DEFAULT_LANGUAGE) {
            url.searchParams.delete("lang");
        } else {
            url.searchParams.set("lang", currentLanguage);
        }

        window.history.replaceState(window.history.state, "", url);
    }

    function persistLanguage() {
        try {
            window.localStorage.setItem(STORAGE_KEY, currentLanguage);
        } catch {
            // The query parameter still keeps the selected language shareable.
        }
    }

    function setLanguage(language, options = {}) {
        if (!SUPPORTED_LANGUAGES.has(language)) return;

        const shouldAnnounce = options.announce !== false;
        const shouldPersist = options.persist !== false;
        const shouldUpdateUrl = options.updateUrl !== false;
        const previousLanguage = currentLanguage;

        currentLanguage = language;
        document.documentElement.lang = language;
        if (shouldPersist) persistLanguage();
        if (shouldUpdateUrl) syncLanguageUrl();

        applyTranslations(document);
        updateLanguageControls();

        if (shouldAnnounce && liveRegion && previousLanguage !== language) {
            liveRegion.textContent = t("language.changed." + language);
        }

        if (previousLanguage !== language) {
            document.dispatchEvent(new CustomEvent("astrum:languagechange", {
                detail: {
                    language,
                    locale: language === "en" ? "en-US" : "es-PE"
                }
            }));
        }
    }

    const observer = new MutationObserver(records => {
        records.forEach(record => {
            if (record.type === "characterData") {
                translateTextNode(record.target);
                return;
            }

            if (record.type === "attributes") {
                translateAttribute(record.target, record.attributeName);
                return;
            }

            record.addedNodes.forEach(node => applyTranslations(node));
        });
    });

    window.AstrumI18n = Object.freeze({
        apply: applyTranslations,
        getLanguage: () => currentLanguage,
        getLocale: () => currentLanguage === "en" ? "en-US" : "es-PE",
        searchable,
        setLanguage,
        t,
        translateText
    });

    document.documentElement.lang = currentLanguage;
    injectLanguageControls();
    applyTranslations(document);
    updateLanguageControls();
    syncLanguageUrl();

    observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: [...TRANSLATABLE_ATTRIBUTES, "content"]
    });
})();
