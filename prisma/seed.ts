import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const specialties = [
  { slug: "perforista", name: "Perforista", sortOrder: 1 },
  { slug: "enmaderero", name: "Enmaderero", sortOrder: 2 },
  { slug: "albanil", name: "Albañil", sortOrder: 3 },
  { slug: "operador-maquinaria", name: "Operador de maquinaria", sortOrder: 4 },
  { slug: "fierrero", name: "Fierrero", sortOrder: 5 },
  { slug: "electricista", name: "Electricista", sortOrder: 6 },
  { slug: "soldador", name: "Soldador", sortOrder: 7 },
  { slug: "pintor", name: "Pintor", sortOrder: 8 },
] as const;

const machineryTypes = [
  { slug: "jumbo", name: "Jumbo", sortOrder: 1 },
  { slug: "retroexcavadora", name: "Retroexcavadora", sortOrder: 2 },
  { slug: "cargador-frontal", name: "Cargador frontal", sortOrder: 3 },
  { slug: "excavadora", name: "Excavadora", sortOrder: 4 },
  { slug: "volquete", name: "Volquete", sortOrder: 5 },
  { slug: "motoniveladora", name: "Motoniveladora", sortOrder: 6 },
  { slug: "ninguna", name: "Sin maquinaria", sortOrder: 99 },
] as const;

const availabilityStatuses = [
  { slug: "inmediata", name: "Inmediata", sortOrder: 1 },
  { slug: "por-turnos", name: "Por turnos", sortOrder: 2 },
  { slug: "libre", name: "Libre", sortOrder: 3 },
] as const;

const workerLevels = [
  { slug: "peon", name: "Peón", sortOrder: 1 },
  { slug: "oficial", name: "Oficial", sortOrder: 2 },
  { slug: "maestro", name: "Maestro", sortOrder: 3 },
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
    const specialtyId = maps.specialtyMap[worker.specialtySlug];
    const levelId = maps.levelMap[worker.levelSlug];
    const machineryId = maps.machineryMap[worker.machinerySlug];
    const availabilityId = maps.availabilityMap[worker.availabilitySlug];

    if (!specialtyId || !levelId || !machineryId || !availabilityId) {
      throw new Error(`Catálogo incompleto para ${worker.fullName}`);
    }

    const existing = await prisma.workerProfile.findFirst({
      where: { fullName: worker.fullName, isDeleted: false },
    });

    const data = {
      fullName: worker.fullName,
      specialtyId,
      levelId,
      machineryId,
      availabilityId,
      departmentCode: worker.departmentCode,
      departmentName: worker.departmentName,
      cityCode: worker.cityCode,
      cityName: worker.cityName,
      districtCode: worker.districtCode,
      districtName: worker.districtName,
      isFeatured: worker.isFeatured,
      isVerified: worker.isVerified,
      updatedAt: worker.updatedAt,
    };

    if (existing) {
      await prisma.workerProfile.update({
        where: { id: existing.id },
        data,
      });
      continue;
    }

    await prisma.workerProfile.create({ data });
  }
}

async function main() {
  const maps = await seedCatalog();
  await seedWorkers(maps);
  console.log("Seed completado.");
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
