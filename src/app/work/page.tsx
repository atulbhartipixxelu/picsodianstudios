import { prisma } from "@/lib/prisma";
import { serializeWork } from "@/lib/utils";
import { WorkIndex } from "@/components/work/WorkIndex";
import { selectedWorkId } from "@/lib/exclusiveSelect";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const [works, selectedId] = await Promise.all([
    prisma.work.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    }),
    selectedWorkId(),
  ]);

  const publicWorks = works.map((work) =>
    serializeWork({ ...work, selected: work.id === selectedId }),
  );
  const selected = publicWorks.find((w) => w.id === selectedId) ?? null;

  return <WorkIndex works={publicWorks} selected={selected} />;
}
