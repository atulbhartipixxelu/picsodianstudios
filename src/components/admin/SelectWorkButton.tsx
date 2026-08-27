"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SelectWorkButton({
  id,
  selected,
}: {
  id: string;
  selected: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    await fetch(`/api/admin/works/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected: !selected }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={
        selected
          ? "bg-signal px-3 py-1.5 micro text-ink"
          : "border border-white/20 px-3 py-1.5 micro text-white/70 hover:text-paper"
      }
    >
      {busy ? "…" : selected ? "Selected" : "Select"}
    </button>
  );
}
