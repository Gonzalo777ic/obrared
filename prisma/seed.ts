import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client.js";
import { SUBSCRIPTION_TIER_SCORES } from "../src/constants/subscription.ts";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const roles = [
  {
    slug: "admin",
    name: "Administrador",
    description: "Acceso total a la plataforma",
    sortOrder: 1,
  },
  {
    slug: "cliente",
    name: "Cliente",
    description: "Usuario base al registrarse",
    sortOrder: 2,
  },
  {
    slug: "anunciante",
    name: "Anunciante",
    description: "Publica anuncios y contrataciones",
    sortOrder: 3,
  },
  {
    slug: "trabajador",
    name: "Trabajador",
    description: "Perfil de mano de obra técnica",
    sortOrder: 4,
  },
  {
    slug: "empresa",
    name: "Empresa",
    description: "Cuenta corporativa B2B",
    sortOrder: 5,
  },
] as const;

const specialties = [
  { slug: "perforista", name: "Perforista", sortOrder: 1 },
  { slug: "enmaderero", name: "Enmaderero", sortOrder: 2 },
  { slug: "albanil", name: "Albañil", sortOrder: 3 },
  { slug: "operador-maquinaria", name: "Operador de maquinaria", sortOrder: 4 },
  { slug: "fierrero", name: "Fierrero", sortOrder: 5 },
  { slug: "electricista", name: "Electricista", sortOrder: 6 },
  { slug: "soldador", name: "Soldador", sortOrder: 7 },
  { slug: "pintor", name: "Pintor", sortOrder: 8 },
  { slug: "encofrado", name: "Encofrado", sortOrder: 9 },
] as const;

const machineryTypes = [
  { slug: "jumbo", name: "Jumbo", sortOrder: 1 },
  { slug: "retroexcavadora", name: "Retroexcavadora", sortOrder: 2 },
  { slug: "cargador-frontal", name: "Cargador frontal", sortOrder: 3 },
  { slug: "excavadora", name: "Excavadora", sortOrder: 4 },
  { slug: "volquete", name: "Volquete", sortOrder: 5 },
  { slug: "motoniveladora", name: "Motoniveladora", sortOrder: 6 },
  { slug: "trompo", name: "Trompo", sortOrder: 7 },
  { slug: "andamios", name: "Andamios", sortOrder: 8 },
  { slug: "amoladora", name: "Amoladora", sortOrder: 9 },
  { slug: "rotomartillo", name: "Rotomartillo", sortOrder: 10 },
  { slug: "flota-vehicular", name: "Flota vehicular", sortOrder: 11 },
  { slug: "maquinaria-pesada", name: "Maquinaria pesada", sortOrder: 12 },
  { slug: "cuadrillas-propias", name: "Cuadrillas propias", sortOrder: 13 },
  { slug: "ninguna", name: "Sin maquinaria", sortOrder: 99 },
] as const;

const availabilityStatuses = [
  { slug: "libre", name: "Libre para trabajar", sortOrder: 1 },
  { slug: "en-obra", name: "Actualmente en obra", sortOrder: 2 },
  { slug: "inmediata", name: "Inmediata", sortOrder: 3 },
  { slug: "por-turnos", name: "Por turnos", sortOrder: 4 },
] as const;

const workerLevels = [
  { slug: "ayudante", name: "Ayudante / Peón", sortOrder: 1 },
  { slug: "oficial", name: "Oficial", sortOrder: 2 },
  { slug: "operario", name: "Operario", sortOrder: 3 },
  { slug: "maestro", name: "Maestro de Obra", sortOrder: 4 },
  { slug: "contratista", name: "Contratista", sortOrder: 5 },
  { slug: "peon", name: "Peón", sortOrder: 6 },
] as const;

const categories = [
  {
    slug: "construccion-civil",
    name: "Construcción Civil",
    sortOrder: 1,
    specialtySlugs: ["albanil", "fierrero", "electricista", "soldador"],
  },
  {
    slug: "operadores-maquinaria",
    name: "Operadores de Maquinaria",
    sortOrder: 2,
    specialtySlugs: ["operador-maquinaria"],
  },
  {
    slug: "mineria",
    name: "Minería (Socavón/Tajo abierto)",
    sortOrder: 3,
    specialtySlugs: ["perforista", "enmaderero", "operador-maquinaria"],
  },
  {
    slug: "acabados",
    name: "Acabados y Remodelación",
    sortOrder: 4,
    specialtySlugs: ["pintor", "albanil", "electricista"],
  },
  {
    slug: "movimiento-tierras",
    name: "Movimiento de tierras",
    sortOrder: 5,
    specialtySlugs: ["operador-maquinaria"],
  },
  {
    slug: "estructuras",
    name: "Estructuras",
    sortOrder: 6,
    specialtySlugs: ["fierrero", "encofrado", "albanil"],
  },
  {
    slug: "supervision",
    name: "Supervisión",
    sortOrder: 7,
    specialtySlugs: ["albanil", "fierrero", "electricista"],
  },
] as const;

const workers = [
  {
    fullName: "José Quispe Huamán",
    specialtySlug: "perforista",
    levelSlug: "maestro",
    machinerySlug: "jumbo",
    availabilitySlug: "inmediata",
    departmentCode: "04",
    departmentName: "Arequipa",
    cityCode: "0401",
    cityName: "Arequipa",
    districtCode: "040101",
    districtName: "Arequipa",
    isFeatured: true,
    isVerified: true,
    updatedAt: new Date("2026-08-05T08:30:00.000Z"),
  },
  {
    fullName: "Miguel Ángel Rojas",
    specialtySlug: "operador-maquinaria",
    levelSlug: "oficial",
    machinerySlug: "retroexcavadora",
    availabilitySlug: "libre",
    departmentCode: "15",
    departmentName: "Lima",
    cityCode: "1501",
    cityName: "Lima",
    districtCode: "150131",
    districtName: "San Isidro",
    isFeatured: true,
    isVerified: true,
    updatedAt: new Date("2026-08-05T07:15:00.000Z"),
  },
  {
    fullName: "Carlos Mendoza Paredes",
    specialtySlug: "enmaderero",
    levelSlug: "oficial",
    machinerySlug: "ninguna",
    availabilitySlug: "por-turnos",
    departmentCode: "19",
    departmentName: "Pasco",
    cityCode: "1901",
    cityName: "Pasco",
    districtCode: "190101",
    districtName: "Chaupimarca",
    isFeatured: true,
    isVerified: false,
    updatedAt: new Date("2026-08-04T18:40:00.000Z"),
  },
  {
    fullName: "Luis Fernando Soto",
    specialtySlug: "albanil",
    levelSlug: "maestro",
    machinerySlug: "ninguna",
    availabilitySlug: "inmediata",
    departmentCode: "15",
    departmentName: "Lima",
    cityCode: "1501",
    cityName: "Lima",
    districtCode: "150140",
    districtName: "Santiago de Surco",
    isFeatured: true,
    isVerified: true,
    updatedAt: new Date("2026-08-04T16:05:00.000Z"),
  },
  {
    fullName: "Pedro Castillo Ramos",
    specialtySlug: "operador-maquinaria",
    levelSlug: "maestro",
    machinerySlug: "excavadora",
    availabilitySlug: "libre",
    departmentCode: "13",
    departmentName: "La Libertad",
    cityCode: "1301",
    cityName: "Trujillo",
    districtCode: "130101",
    districtName: "Trujillo",
    isFeatured: false,
    isVerified: true,
    updatedAt: new Date("2026-08-05T09:10:00.000Z"),
  },
  {
    fullName: "Andrés Vilca Mamani",
    specialtySlug: "fierrero",
    levelSlug: "oficial",
    machinerySlug: "ninguna",
    availabilitySlug: "inmediata",
    departmentCode: "08",
    departmentName: "Cusco",
    cityCode: "0801",
    cityName: "Cusco",
    districtCode: "080101",
    districtName: "Cusco",
    isFeatured: false,
    isVerified: false,
    updatedAt: new Date("2026-08-05T06:50:00.000Z"),
  },
  {
    fullName: "Ricardo Núñez Vega",
    specialtySlug: "electricista",
    levelSlug: "oficial",
    machinerySlug: "ninguna",
    availabilitySlug: "libre",
    departmentCode: "15",
    departmentName: "Lima",
    cityCode: "1501",
    cityName: "Lima",
    districtCode: "150101",
    districtName: "Lima",
    isFeatured: false,
    isVerified: false,
    updatedAt: new Date("2026-08-05T05:20:00.000Z"),
  },
  {
    fullName: "Héctor Páucar León",
    specialtySlug: "soldador",
    levelSlug: "maestro",
    machinerySlug: "ninguna",
    availabilitySlug: "por-turnos",
    departmentCode: "02",
    departmentName: "Ancash",
    cityCode: "0201",
    cityName: "Huaraz",
    districtCode: "020101",
    districtName: "Huaraz",
    isFeatured: false,
    isVerified: true,
    updatedAt: new Date("2026-08-04T22:00:00.000Z"),
  },
  {
    fullName: "Edgar Salas Chávez",
    specialtySlug: "pintor",
    levelSlug: "peon",
    machinerySlug: "ninguna",
    availabilitySlug: "inmediata",
    departmentCode: "04",
    departmentName: "Arequipa",
    cityCode: "0401",
    cityName: "Arequipa",
    districtCode: "040108",
    districtName: "Cerro Colorado",
    isFeatured: false,
    isVerified: false,
    updatedAt: new Date("2026-08-04T14:30:00.000Z"),
  },
  {
    fullName: "Martín Huerta Díaz",
    specialtySlug: "operador-maquinaria",
    levelSlug: "oficial",
    machinerySlug: "volquete",
    availabilitySlug: "libre",
    departmentCode: "20",
    departmentName: "Piura",
    cityCode: "2001",
    cityName: "Piura",
    districtCode: "200101",
    districtName: "Piura",
    isFeatured: false,
    isVerified: false,
    updatedAt: new Date("2026-08-03T19:45:00.000Z"),
  },
  {
    fullName: "Wilmer Toribio Quispe",
    specialtySlug: "perforista",
    levelSlug: "oficial",
    machinerySlug: "jumbo",
    availabilitySlug: "inmediata",
    departmentCode: "11",
    departmentName: "Ica",
    cityCode: "1101",
    cityName: "Ica",
    districtCode: "110101",
    districtName: "Ica",
    isFeatured: false,
    isVerified: true,
    updatedAt: new Date("2026-08-05T10:00:00.000Z"),
  },
  {
    fullName: "Segundo Alvarado Ruiz",
    specialtySlug: "albanil",
    levelSlug: "peon",
    machinerySlug: "ninguna",
    availabilitySlug: "libre",
    departmentCode: "14",
    departmentName: "Lambayeque",
    cityCode: "1401",
    cityName: "Chiclayo",
    districtCode: "140101",
    districtName: "Chiclayo",
    isFeatured: false,
    isVerified: false,
    updatedAt: new Date("2026-08-02T11:10:00.000Z"),
  },
] as const;

function resolveSubscriptionScore(worker: {
  isFeatured: boolean;
  isVerified: boolean;
}) {
  if (worker.isFeatured && worker.isVerified) {
    return SUBSCRIPTION_TIER_SCORES.premium;
  }

  if (worker.isFeatured) {
    return SUBSCRIPTION_TIER_SCORES.standard;
  }

  if (worker.isVerified) {
    return SUBSCRIPTION_TIER_SCORES.basic;
  }

  return SUBSCRIPTION_TIER_SCORES.free;
}

function buildWorkerImages(fullName: string) {
  const seed = fullName
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return [
    {
      url: `https://picsum.photos/seed/${seed}-1/640/480`,
      altText: `${fullName} - foto de obra 1`,
      sortOrder: 0,
    },
    {
      url: `https://picsum.photos/seed/${seed}-2/640/480`,
      altText: `${fullName} - foto de obra 2`,
      sortOrder: 1,
    },
    {
      url: `https://picsum.photos/seed/${seed}-3/640/480`,
      altText: `${fullName} - foto de obra 3`,
      sortOrder: 2,
    },
  ];
}

async function syncWorkerImages(workerProfileId: string, fullName: string) {
  const images = buildWorkerImages(fullName);

  for (const image of images) {
    const existing = await prisma.workerImage.findFirst({
      where: {
        workerProfileId,
        sortOrder: image.sortOrder,
        isDeleted: false,
      },
    });

    if (existing) {
      await prisma.workerImage.update({
        where: { id: existing.id },
        data: {
          url: image.url,
          altText: image.altText,
          isDeleted: false,
          deletedAt: null,
        },
      });
      continue;
    }

    await prisma.workerImage.create({
      data: {
        workerProfileId,
        url: image.url,
        altText: image.altText,
        sortOrder: image.sortOrder,
      },
    });
  }
}

async function seedRoles() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        name: role.name,
        description: role.description,
        sortOrder: role.sortOrder,
        isActive: true,
        isDeleted: false,
      },
      create: role,
    });
  }
}

async function seedCatalog() {
  for (const item of specialties) {
    await prisma.specialty.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sortOrder: item.sortOrder,
        isActive: true,
        isDeleted: false,
      },
      create: item,
    });
  }

  for (const item of machineryTypes) {
    await prisma.machineryType.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sortOrder: item.sortOrder,
        isActive: true,
        isDeleted: false,
      },
      create: item,
    });
  }

  for (const item of availabilityStatuses) {
    await prisma.availabilityStatus.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sortOrder: item.sortOrder,
        isActive: true,
        isDeleted: false,
      },
      create: item,
    });
  }

  for (const item of workerLevels) {
    await prisma.workerLevel.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sortOrder: item.sortOrder,
        isActive: true,
        isDeleted: false,
      },
      create: item,
    });
  }

  const specialtyMap = Object.fromEntries(
    (await prisma.specialty.findMany()).map((item) => [item.slug, item.id]),
  );

  for (const category of categories) {
    const record = await prisma.workCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        isActive: true,
        isDeleted: false,
      },
      create: {
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });

    await prisma.workCategorySpecialty.deleteMany({
      where: { categoryId: record.id },
    });

    for (const specialtySlug of category.specialtySlugs) {
      const specialtyId = specialtyMap[specialtySlug];
      if (!specialtyId) continue;

      await prisma.workCategorySpecialty.create({
        data: { categoryId: record.id, specialtyId },
      });
    }
  }

  return {
    specialtyMap,
    levelMap: Object.fromEntries(
      (await prisma.workerLevel.findMany()).map((item) => [item.slug, item.id]),
    ),
    machineryMap: Object.fromEntries(
      (await prisma.machineryType.findMany()).map((item) => [
        item.slug,
        item.id,
      ]),
    ),
    availabilityMap: Object.fromEntries(
      (await prisma.availabilityStatus.findMany()).map((item) => [
        item.slug,
        item.id,
      ]),
    ),
  };
}

async function seedWorkers(maps: Awaited<ReturnType<typeof seedCatalog>>) {
  for (const worker of workers) {
    const levelSlug = worker.levelSlug === "peon" ? "ayudante" : worker.levelSlug;
    const availabilitySlug =
      worker.availabilitySlug === "inmediata"
        ? "libre"
        : worker.availabilitySlug === "por-turnos"
          ? "en-obra"
          : worker.availabilitySlug;

    const specialtyId = maps.specialtyMap[worker.specialtySlug];
    const levelId = maps.levelMap[levelSlug];
    const machineryId = maps.machineryMap[worker.machinerySlug];
    const availabilityId = maps.availabilityMap[availabilitySlug];

    if (!specialtyId || !levelId || !machineryId || !availabilityId) {
      throw new Error(`Catálogo incompleto para ${worker.fullName}`);
    }

    const existing = await prisma.workerProfile.findFirst({
      where: { fullName: worker.fullName, isDeleted: false },
    });

    const data = {
      publisherType: "individual",
      fullName: worker.fullName,
      whatsapp: "+51900000000",
      documentType: "dni",
      documentNumber: "00000000",
      presentation: `Profesional con experiencia en ${worker.specialtySlug}.`,
      yearsOfExperience: 5,
      levelId,
      availabilityId,
      departmentCode: worker.departmentCode,
      departmentName: worker.departmentName,
      cityCode: worker.cityCode,
      cityName: worker.cityName,
      districtCode: worker.districtCode,
      districtName: worker.districtName,
      subscriptionScore: resolveSubscriptionScore(worker),
      isFeatured: worker.isFeatured,
      isVerified: worker.isVerified,
      updatedAt: worker.updatedAt,
    };

    if (existing) {
      await prisma.workerProfileSpecialty.deleteMany({
        where: { workerProfileId: existing.id },
      });
      await prisma.workerProfileMachinery.deleteMany({
        where: { workerProfileId: existing.id },
      });
      await prisma.workerCoverageDistrict.deleteMany({
        where: { workerProfileId: existing.id },
      });

      const updated = await prisma.workerProfile.update({
        where: { id: existing.id },
        data: {
          ...data,
          specialties: {
            create: [{ specialtyId }],
          },
          machinery: {
            create: [{ machineryId }],
          },
          coverageDistricts: {
            create: [
              {
                departmentCode: worker.departmentCode,
                departmentName: worker.departmentName,
                cityCode: worker.cityCode,
                cityName: worker.cityName,
                districtCode: worker.districtCode,
                districtName: worker.districtName,
              },
            ],
          },
        },
      });
      await syncWorkerImages(updated.id, worker.fullName);
      continue;
    }

    const created = await prisma.workerProfile.create({
      data: {
        ...data,
        specialties: {
          create: [{ specialtyId }],
        },
        machinery: {
          create: [{ machineryId }],
        },
        coverageDistricts: {
          create: [
            {
              departmentCode: worker.departmentCode,
              departmentName: worker.departmentName,
              cityCode: worker.cityCode,
              cityName: worker.cityName,
              districtCode: worker.districtCode,
              districtName: worker.districtName,
            },
          ],
        },
      },
    });
    await syncWorkerImages(created.id, worker.fullName);
  }
}

async function main() {
  await seedRoles();
  const maps = await seedCatalog();
  await seedWorkers(maps);
  console.log("Seed completado (roles, catálogo y trabajadores).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
