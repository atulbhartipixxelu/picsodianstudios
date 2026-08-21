"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    if (!res.ok) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="login-panel grid overflow-hidden md:grid-cols-2"
    >
      <div className="relative flex flex-col justify-between overflow-hidden border-b border-white/10 p-8 md:border-r md:border-b-0 md:p-12">
        <span className="login-sweep" aria-hidden />

        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="login-logo-float w-fit"
        >
          <Logo className="h-14" />
        </motion.div>

        <div className="mt-12 md:mt-20">
          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="micro text-signal"
          >
            {"Private access".split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.03 }}
                className="inline-block"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.p>

          <h1 className="font-display mt-3 text-5xl uppercase leading-[0.9] tracking-tight md:text-6xl">
            <span className="block overflow-hidden">
              {"Sign".split("").map((ch, i) => (
                <motion.span
                  key={ch + i}
                  initial={{ y: "110%", rotate: 8, opacity: 0 }}
                  animate={{ y: "0%", rotate: 0, opacity: 1 }}
                  transition={{
                    delay: 0.4 + i * 0.06,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%", opacity: 0, scale: 0.8 }}
                animate={{ y: "0%", opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-stroke-login inline-block"
              >
                in
              </motion.span>
            </span>
          </h1>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.95, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 block h-px w-16 origin-left bg-signal"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mt-6 max-w-[14rem] text-sm leading-relaxed text-white/55"
          >
            Picsodian Studios dashboard. Add work, read enquiries, run the reel.
          </motion.p>
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-12">
        <motion.label
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid gap-2"
        >
          <span className="micro text-white/40">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            defaultValue="admin@picsodianstudios.com"
            className="login-line"
          />
        </motion.label>

        <motion.label
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62 }}
          className="mt-8 grid gap-2"
        >
          <span className="micro text-white/40">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            className="login-line"
          />
        </motion.label>

        {error && <p className="micro mt-5 text-signal">{error}</p>}

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          disabled={loading}
          className="login-shine mt-10 py-4 text-ink micro tracking-[0.22em] disabled:opacity-60"
        >
          {loading ? "Please wait…" : "Enter studio"}
        </motion.button>
      </div>
    </motion.form>
  );
}
