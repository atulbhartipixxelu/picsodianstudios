import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminReveal } from "@/components/admin/AdminReveal";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-ink text-paper">
      <AdminNav name={session.name} />
      <div className="ml-0 md:ml-64">
        <header className="flex items-center justify-between px-6 py-5 md:px-10">
          <div>
            <p className="micro text-signal">Picsodian Studios</p>
            <p className="mt-1 text-sm text-white/40">Dashboard</p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-signal hover:text-signal"
          >
            View site
          </Link>
        </header>
        <nav className="flex gap-2 overflow-x-auto px-6 pb-2 md:hidden">
          {[
            ["/admin", "Overview"],
            ["/admin/banner", "Banner"],
            ["/admin/works", "Works"],
            ["/admin/enquiries", "Enquiries"],
            ["/admin/settings", "Settings"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 border border-white/10 px-3 py-1.5 text-xs uppercase tracking-wider text-white/70"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="relative px-6 pb-16 md:px-10">
          <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 bg-signal/8 blur-[100px]" />
          <AdminReveal>{children}</AdminReveal>
        </div>
      </div>
    </div>
  );
}
