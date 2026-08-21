"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Clapperboard,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/works", label: "Works", icon: Clapperboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="fixed top-0 left-0 z-20 hidden h-screen w-64 flex-col border-r border-white/8 bg-[#0c0c0f] md:flex">
      <div className="px-6 py-6">
        <Logo className="h-12" />
        <p className="micro mt-4 text-signal">Studio admin</p>
        <p className="mt-1 text-sm text-white/50">{name}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                active
                  ? "bg-signal text-ink"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 border-t border-white/8 px-7 py-5 text-left text-sm text-white/45 hover:text-signal"
      >
        <LogOut size={16} />
        Log out
      </button>
    </aside>
  );
}
