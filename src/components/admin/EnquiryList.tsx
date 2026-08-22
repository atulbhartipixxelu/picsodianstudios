"use client";

import { useRouter } from "next/navigation";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  status: string;
  createdAt: string;
};

export function EnquiryList({ items }: { items: Enquiry[] }) {
  const router = useRouter();

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (!items.length) {
    return (
      <div className="mt-8 border border-white/10 bg-ink-2 px-6 py-20 text-center">
        <p className="text-white/50">No enquiries yet.</p>
        <p className="micro mt-2 text-white/30">
          New contact form messages will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-4">
      {items.map((item) => (
        <article key={item.id} className="dash-panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-tight">
                {item.name}
              </h2>
              <p className="mt-1 text-sm text-white/45">
                {item.email}
                {item.company ? ` · ${item.company}` : ""}
              </p>
            </div>
            <span
              className={
                item.status === "new"
                  ? "micro bg-signal px-2 py-1 text-ink"
                  : "micro border border-white/15 px-2 py-1 text-white/50"
              }
            >
              {item.status}
            </span>
          </div>
          <p className="micro mt-4 text-white/35">
            {item.projectType || "General"} · {item.budget || "Budget n/a"} ·{" "}
            {new Date(item.createdAt).toLocaleString()}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-white/75">{item.message}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["new", "read", "archived"].map((status) => (
              <button
                key={status}
                onClick={() => setStatus(item.id, status)}
                className="border border-white/15 px-3 py-1.5 text-xs uppercase tracking-wider hover:border-signal hover:text-signal"
              >
                {status}
              </button>
            ))}
            <button onClick={() => remove(item.id)} className="micro text-signal">
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
