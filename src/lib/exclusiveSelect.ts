import { prisma } from "@/lib/prisma";

/** Selected column is on the DB; use SQL until the running Prisma client is regenerated. */

export async function exclusiveSelectWork(id: string, selected: boolean) {
  if (!selected) {
    await prisma.$executeRaw`UPDATE "Work" SET selected = false WHERE id = ${id}`;
    return;
  }

  await prisma.$executeRaw`UPDATE "Work" SET selected = false WHERE id <> ${id}`;
  await prisma.$executeRaw`UPDATE "Work" SET selected = true WHERE id = ${id}`;
}

export async function listPublishedWorkPicks() {
  return prisma.$queryRaw<Array<{ id: string; title: string; selected: boolean }>>`
    SELECT id, title, selected FROM "Work"
    WHERE published = true
    ORDER BY title ASC
  `;
}

export async function selectedWorkId() {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "Work" WHERE selected = true AND published = true LIMIT 1
  `;
  return rows[0]?.id ?? null;
}

export async function workIsSelected(id: string) {
  const rows = await prisma.$queryRaw<Array<{ selected: boolean }>>`
    SELECT selected FROM "Work" WHERE id = ${id} LIMIT 1
  `;
  return Boolean(rows[0]?.selected);
}

export async function selectedByWorkId() {
  const rows = await prisma.$queryRaw<Array<{ id: string; selected: boolean }>>`
    SELECT id, selected FROM "Work"
  `;
  return new Map(rows.map((row) => [row.id, Boolean(row.selected)]));
}
