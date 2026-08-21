import { prisma } from "@/lib/prisma";
import { serializeWork } from "@/lib/utils";
import { WorkIndex } from "@/components/work/WorkIndex";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const works = await prisma.work.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
  });

  return <WorkIndex works={works.map(serializeWork)} />;
}
