"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Clapperboard,
  Film,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/banner", label: "Banner", icon: Film },
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
    <aside className="fixed top-0 left-0 z-20 hidden h-screen w-64 flex-col border-r border-white/8 bg-ink md:flex">
      <div className="border-b border-white/8 px-6 py-6">
        <Logo className="h-10" />
        <p className="micro mt-4 text-white/35">Studio admin</p>
        <p className="mt-1 truncate text-sm text-white/70">{name}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 py-4">
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
              className={cn("dash-nav-link", active && "is-on")}
            >
              <Icon size={16} strokeWidth={1.6} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="dash-nav-link mb-3 border-t border-white/8"
      >
        <LogOut size={16} strokeWidth={1.6} />
        Log out
      </button>
    </aside>
  );
}
