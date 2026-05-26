import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const experiences = [
  {
    code: "EXP-001",
    slug: "experiencia-mercado-de-bazurto",
    name: "Experiencia Mercado de Bazurto",
    types: ["Gastronómica", "Cultural"],
    price: 115000,
    duration: "3 Horas",
    description:
      "Rompe la burbuja turística y vive una inmersión ultra-auténtica en el corazón de Cartagena. Déjate guiar por los pasillos llenos de magia del Mercado de Bazurto en una experiencia diseñada para conectar con las raíces del sabor caribeño, escuchar las historias vivas de sus protagonistas y disfrutar de un almuerzo tradicional e impredecible, directo del mar a tu plato.",
    includes: [
      "Anfitrión Bilingüe / Traductor Cultural",
      "Charla de Tradición Oral con Matrona",
      "Momento Frío Local: 1 o 2 cervezas Costeñita",
      "Almuerzo de la Cosecha del Día (pesca fresca)",
      "Kit de Aventura: recomendaciones de vestuario en app",
    ],
    images: [],
    active: true,
    featured: true,
    order: 1,
  },
  {
    code: "EXP-002",
    slug: "experiencia-centro-historico",
    name: "Experiencia Centro Histórico",
    types: ["Gastronómica", "Cultural"],
    price: 180000,
    duration: "3 Horas",
    description:
      "Descubre Cartagena a través de sus dos mayores tesoros: su historia colonial y su evolución gastronómica. En este recorrido ultra-sensorial, caminarás por las calles más icónicas de la Ciudad Amurallada guiado por un experto, para luego sentarte a disfrutar de una propuesta de alta cocina contemporánea donde el mismísimo Chef te contará los secretos detrás de cada bocado.",
    includes: [
      "Recorrido Histórico Guiado por calles, plazas y baluartes coloniales",
      "Almuerzo Premium a 3 Tiempos (entrada, plato fuerte y postre)",
      "Charla Exclusiva con el Chef",
      "Refresco Tradicional: boli de frutas locales",
    ],
    images: [],
    active: true,
    featured: true,
    order: 2,
  },
  {
    code: "EXP-003",
    slug: "cata-de-frutas-locales-y-tropicales",
    name: "Cata de Frutas Locales y Tropicales",
    types: ["Gastronómica", "Cultural"],
    price: 150000,
    duration: "2 Horas",
    description:
      "Descubre la riqueza y la biodiversidad del Caribe a través de sus sabores más vibrantes. En esta experiencia guiada por un experto, aprenderás a identificar, catar y valorar las frutas locales de temporada en un viaje sensorial que despertará tus papilas gustativas y te enseñará sus usos tradicionales en la cocina local.",
    includes: [
      "Charla de Introducción Botánica",
      "Cata Dirigida de 5 a 6 Frutas Seleccionadas (30-50g c/u)",
      "Estación de Limpieza de Paladar (agua mineral, manzana verde, galletas neutras)",
      "Taller de Aplicación Culinaria: salsas y mixología local",
    ],
    images: [],
    active: true,
    featured: false,
    order: 3,
  },
  {
    code: "EXP-004",
    slug: "el-totumazo",
    name: "El Totumazo",
    types: ["Gastronómica"],
    price: 55000,
    duration: "1.5 Horas",
    description:
      "Vive el verdadero pulso de la cocina popular de Cartagena a través de su plato más reconfortante: el sancocho tradicional. Rompe los esquemas turísticos y deléitate con una sopa monumental y cargada de sabor caribeño, servida hirviendo en una totuma artesanal, el recipiente ancestral de nuestra tierra.",
    includes: [
      "Totumazo de Sancocho Tradicional (pescado, trifásico o costilla)",
      "Arroz, aguacate y el clásico banano",
      "Bebida Típica Acompañante (jugo de corozo o agua e' panela con limón)",
      "Introducción a la Vajilla Ancestral: historia de la totuma",
      "Acompañamiento de Seguridad personalizado",
    ],
    images: [],
    active: true,
    featured: false,
    order: 4,
  },
  {
    code: "EXP-005",
    slug: "cartagena-paddle-experience",
    name: "Cartagena Paddle Experience",
    types: ["Bienestar", "Deporte", "Aventura"],
    price: 50000,
    duration: "2 Horas",
    description:
      "Domina el mar de Cartagena sobre una tabla de Paddle Surf y recibe el día desde una perspectiva inolvidable. Disfruta de nuestra Clase Clásica de Amanecer, la sesión más solicitada del catálogo, donde navegarás en aguas calmas mientras el sol sale sobre el horizonte caribeño. Para los más osados, descubre bajo disponibilidad nuestra travesía especial de polo a polo cruzando hasta Tierra Bomba.",
    includes: [
      "Clase Clásica de Amanecer 5:00 AM - 7:00 AM (o 7:00 AM - 9:00 AM)",
      "Alquiler de tabla de SUP, remo y chaleco salvavidas",
      "Registro Fotográfico por los instructores",
      "Bote de apoyo y instructores certificados",
      "Hidratación al terminar: agua mineral o agua de coco",
    ],
    images: [],
    active: true,
    featured: true,
    order: 5,
  },
  {
    code: "EXP-006",
    slug: "senderismo-y-conexion-natural",
    name: "Senderismo y Conexión Natural",
    types: ["Naturaleza", "Bienestar"],
    price: 65000,
    duration: "3 Horas",
    description:
      "Desconéctate del asfalto y respira el secreto mejor guardado de la región. Explora el Jardín Botánico Guillermo Piñeres en una caminata guiada a través de senderos vivos llenos de fauna nativa, árboles centenarios y un asombroso bosque seco tropical. Una experiencia perfecta para caminar sin prisa, escuchar el canto de las aves, avistar monos aulladores y conectar con el lado verde y revitalizante del Caribe.",
    includes: [
      "Entrada al Jardín Botánico Guillermo Piñeres",
      "Senderismo Guiado por guía local experto",
      "Avistamiento de Fauna: aves exóticas, iguanas y monos aulladores",
      "Estación de Hidratación y Descanso al finalizar",
    ],
    images: [],
    active: true,
    featured: false,
    order: 6,
  },
  {
    code: "EXP-007",
    slug: "plan-relax-yoga-pilates-aromaterapia",
    name: "Plan Relax: Yoga, Pilates & Aromaterapia",
    types: ["Bienestar", "Naturaleza"],
    price: 95000,
    duration: "3.5 Horas",
    description:
      "Regálale a tu cuerpo un oasis de relajación y balance en el entorno más revitalizante de la región. Vive el Plan Relax oficial dentro del Jardín Botánico Guillermo Piñeres, un santuario natural rodeado de bosque seco tropical. Disfruta de una jornada guiada de yoga, pilates y una profunda sesión de relajación con aromaterapia, inciensos y pétalos de rosas.",
    includes: [
      "Brazalete de Ingreso al Jardín Botánico",
      "Sesión guiada de Yoga, Pilates y relajación profunda con aromaterapia",
      "Colchonetas, balones terapéuticos, inciensos y pétalos de rosas",
      "Refrigerio Premium a elección (Croissant, Malla vegetal, Envoltini Pizza o Sándwich)",
      "Bebida a elección + Boli Típico Cartagenero de obsequio",
    ],
    images: [],
    active: true,
    featured: false,
    order: 7,
  },
  {
    code: "EXP-008",
    slug: "the-local-nightlife-experience",
    name: "The Local Nightlife Experience",
    types: ["Vida Nocturna", "Cultura Local", "Experiencia VIP"],
    price: 200000,
    duration: "4 Horas",
    description:
      "Sal de la burbuja turística tradicional y vive la verdadera noche cartagenera desde la comodidad, la seguridad y el estatus que mereces. Conéctate con la energía de la Zona Suroccidental en The Local Nightlife Experience, un recorrido premium por los sectores más vibrantes como Blas de Lezo y Los Caracoles. Descubre la auténtica cultura del \"estadero\" caribeño y los gastrobares más cotizados del momento.",
    includes: [
      "Anfitrión Logístico Dedicado (coordinador bilingüe/local VIP)",
      "Transporte Privado Puerta a Puerta (climatizado)",
      "Acceso Exclusivo a Zona VIP sin filas",
      "Coctel de Bienvenida artesanal por persona",
      "Servicio de Botella Premium por mesa/grupo",
      "Kit de Hidratación Post-Rumba (Gatorade o Electrolit)",
    ],
    images: [],
    active: true,
    featured: true,
    order: 8,
  },
  {
    code: "EXP-009",
    slug: "tarde-de-verbena-salsa-jibaro-champeta-africana",
    name: "Tarde de Verbena: Salsa Jíbaro & Champeta Africana",
    types: ["Cultura Local", "Música", "Experiencia VIP"],
    price: 180000,
    duration: "4 Horas",
    description:
      "Siente el verdadero pulso sonoro del Caribe y viaja a la raíz de la cultura popular cartagenera. Con Tarde de Verbena, vivirás una experiencia vespertina exclusiva en el corazón del Suroccidente, recorriendo los estaderos legendarios de Blas de Lezo. Descubre la magia de la tarde caribeña al ritmo de la Salsa Jíbaro más fina, los coleccionistas de vinilos y la descarga rítmica de la Champeta Africana.",
    includes: [
      "Acompañamiento Local Permanente durante las 4 horas",
      "Transporte Privado Puerta a Puerta (climatizado)",
      "Acomodación VIP Reservada (El Coreano, El York o Vueltabajero)",
      "Cubetazo de Bienvenida: cervezas nacionales por mesa/grupo",
      "Snack Típico de Esquina: fritos cartageneros",
    ],
    images: [],
    active: true,
    featured: true,
    order: 9,
  },
  {
    code: "EXP-010",
    slug: "champeta-masterclass-ritmo-y-sabor-local",
    name: "Champeta Masterclass: Ritmo y Sabor Local",
    types: ["Cultura", "Danza", "Experiencia Interactiva"],
    price: 110000,
    duration: "2 Horas",
    description:
      "Rompe los esquemas y aprende a moverte como un verdadero local. Con Champeta Masterclass, dominarás el ritmo urbano que hace vibrar a toda Cartagena. Un coreógrafo e instructor nativo te enseñará desde cero la historia, el conteo musical y los pasos esenciales de la champeta criolla y africana. No importa si nunca has bailado; este taller está diseñado para que te diviertas, sueltes el cuerpo y adquieras toda la actitud caribeña.",
    includes: [
      "Instructor de Baile Nativo profesional cartagenero",
      "Locación Premium Seleccionada (salón privado, terraza o zona de playa)",
      "Kit de Bienvenida: pañoleta típica verbenera de obsequio",
      "Estación de Hidratación Ilimitada durante toda la sesión",
      "Registro Multimedia Opcional (15 min de grabación final)",
    ],
    images: [],
    active: true,
    featured: false,
    order: 10,
  },
];

async function main() {
  console.log("🌱 Seeding CataPlan experiences...");

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { code: exp.code },
      update: exp,
      create: exp,
    });
    console.log(`  ✓ ${exp.code} - ${exp.name}`);
  }

  console.log(`\n✅ ${experiences.length} experiencias cargadas correctamente.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
