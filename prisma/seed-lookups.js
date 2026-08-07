// @ts-check
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const lookups = [
  // ─── CURRENCY ────────────────────────────────────────────────────
  {
    category: 'CURRENCY',
    code: 'INR',
    label: 'Indian Rupee',
    value: '₹',
    sortOrder: 1,
  },

  // ─── TYPE (Machine / Fixture / Operation) ────────────────────────
  { category: 'TYPE', code: 'MILL', label: 'Mill', sortOrder: 1 },
  { category: 'TYPE', code: 'LATHE', label: 'Lathe', sortOrder: 2 },

  // ─── PRIORITY ────────────────────────────────────────────────────
  {
    category: 'PRIORITY',
    code: 'LOW',
    label: 'Low',
    sortOrder: 1,
    metadata: { color: '#6b7280' },
  },
  {
    category: 'PRIORITY',
    code: 'MEDIUM',
    label: 'Medium',
    sortOrder: 2,
    metadata: { color: '#3b82f6' },
  },
  {
    category: 'PRIORITY',
    code: 'HIGH',
    label: 'High',
    sortOrder: 3,
    metadata: { color: '#f59e0b' },
  },

  // ─── MACHINE_STATUS ───────────────────────────────────────────────
  {
    category: 'MACHINE_STATUS',
    code: 'IDLE',
    label: 'Idle',
    sortOrder: 1,
    metadata: { color: '#6b7280' },
  },
  {
    category: 'MACHINE_STATUS',
    code: 'RUNNING',
    label: 'Running',
    sortOrder: 2,
    metadata: { color: '#22c55e' },
  },
  {
    category: 'MACHINE_STATUS',
    code: 'MAINTENANCE',
    label: 'Maintenance',
    sortOrder: 3,
    metadata: { color: '#f59e0b' },
  },

  // ─── UNIT ─────────────────────────────────────────────────────────
  {
    category: 'UNIT',
    code: 'MM',
    label: 'Millimeters',
    value: 'mm',
    sortOrder: 1,
  },
  {
    category: 'UNIT',
    code: 'INCH',
    label: 'Inches',
    value: 'in',
    sortOrder: 2,
  },
  {
    category: 'UNIT',
    code: 'CM',
    label: 'Centimeters',
    value: 'cm',
    sortOrder: 3,
  },

  // ─── SHIFT_TYPE ────────────────────────────────────────────────────
  {
    category: 'SHIFT_TYPE',
    code: 'MORNING',
    label: 'Morning',
    sortOrder: 1,
    metadata: { icon: '🌅' },
  },
  {
    category: 'SHIFT_TYPE',
    code: 'EVENING',
    label: 'Evening',
    sortOrder: 2,
    metadata: { icon: '🌇' },
  },
  {
    category: 'SHIFT_TYPE',
    code: 'NIGHT',
    label: 'Night',
    sortOrder: 3,
    metadata: { icon: '🌙' },
  },
];

async function main() {
  console.log('🌱 Seeding lookups...\n');

  for (const lookup of lookups) {
    // Prisma v7 rejects null in unique-where; use findFirst + create/update instead
    const existing = await prisma.lookup.findFirst({
      where: { category: lookup.category, code: lookup.code, tenantId: null },
    });

    if (existing) {
      await prisma.lookup.update({
        where: { id: existing.id },
        data: {
          label: lookup.label,
          sortOrder: lookup.sortOrder ?? 0,
          ...(lookup.value !== undefined && { value: lookup.value }),
          ...(lookup.description !== undefined && {
            description: lookup.description,
          }),
          ...(lookup.metadata !== undefined && { metadata: lookup.metadata }),
        },
      });
      console.log(
        `  🔄 [${lookup.category}] ${lookup.code} → "${lookup.label}" (updated)`,
      );
    } else {
      await prisma.lookup.create({
        data: {
          category: lookup.category,
          code: lookup.code,
          label: lookup.label,
          sortOrder: lookup.sortOrder ?? 0,
          tenantId: null,
          ...(lookup.value !== undefined && { value: lookup.value }),
          ...(lookup.description !== undefined && {
            description: lookup.description,
          }),
          ...(lookup.metadata !== undefined && { metadata: lookup.metadata }),
        },
      });
      console.log(
        `  ✅ [${lookup.category}] ${lookup.code} → "${lookup.label}" (created)`,
      );
    }
  }

  console.log(`\n✨ Done! ${lookups.length} lookup values upserted.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
