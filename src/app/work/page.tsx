import { getPublishedWorks } from "@/lib/public-data";
import { WorkIndex } from "@/components/work/WorkIndex";
import { selectedWorkId } from "@/lib/exclusiveSelect";

export const revalidate = 60;

export const metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const [works, selectedId] = await Promise.all([
    getPublishedWorks(),
    selectedWorkId(),
  ]);

  const publicWorks = works.map((work) => ({
    ...work,
    selected: work.id === selectedId,
  }));
  const selected = publicWorks.find((w) => w.id === selectedId) ?? null;

  return <WorkIndex works={publicWorks} selected={selected} />;
}
