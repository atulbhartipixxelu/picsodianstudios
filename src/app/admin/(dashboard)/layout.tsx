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
    <div className="dash-app min-h-screen bg-ink text-paper">
      <AdminNav name={session.name} />
      <div className="ml-0 md:ml-64">
        <header className="flex items-center justify-between border-b border-white/8 px-6 py-3.5 md:px-10">
          <p className="text-sm text-white/40">Studio dashboard</p>
          <Link
            href="/"
            target="_blank"
            className="dash-btn dash-btn-ghost"
          >
            View site
          </Link>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-white/8 px-6 py-3 md:hidden">
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
              className="shrink-0 border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:border-white/30 hover:text-paper"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-8 pb-16 md:px-10 md:py-10">
          <AdminReveal>{children}</AdminReveal>
        </div>
      </div>
    </div>
  );
}
