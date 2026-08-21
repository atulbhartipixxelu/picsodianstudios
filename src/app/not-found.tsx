import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center bg-ink px-4 text-center">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 sprockets md:w-7" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-5 sprockets md:w-7" />
      <div>
        <p className="micro text-signal">404 / Missing reel</p>
        <h1 className="display-huge mt-4 text-7xl">Cut.</h1>
        <p className="mt-4 text-paper/70">This frame doesn&apos;t exist.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/" className="micro text-signal">
            Home
          </Link>
          <Link href="/work" className="micro text-mist">
            Work
          </Link>
        </div>
      </div>
    </div>
  );
}
