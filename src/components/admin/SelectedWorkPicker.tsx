"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; title: string; selected: boolean };

export function SelectedWorkPicker({ works }: { works: Option[] }) {
  const router = useRouter();
  const current = works.find((w) => w.selected)?.id ?? "";
  const [busy, setBusy] = useState(false);

  async function onChange(id: string) {
    setBusy(true);
    if (id) {
      await fetch(`/api/admin/works/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: true }),
      });
    } else if (current) {
      await fetch(`/api/admin/works/${current}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: false }),
      });
    }
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="dash-panel mt-10 p-6 md:p-8">
      <p className="micro text-white/40">Work page</p>
      <h2 className="dash-section-title mt-2">Selected work</h2>
      <p className="mt-2 max-w-xl text-sm text-white/50">
        This project shows under the banner on the Work page. Pick one — the
        previous selection turns off automatically.
      </p>
      <select
        className="field mt-5 max-w-md"
        value={current}
        disabled={busy || works.length === 0}
        onChange={(e) => void onChange(e.target.value)}
      >
        <option value="">None</option>
        {works.map((work) => (
          <option key={work.id} value={work.id}>
            {work.title}
          </option>
        ))}
      </select>
    </div>
  );
}
