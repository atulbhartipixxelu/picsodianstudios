import { prisma } from "@/lib/prisma";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

const FALLBACK_VIDEO =
  "https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4";
const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=80";

export default async function AdminLoginPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });
  const videoUrl = settings?.showreelUrl || FALLBACK_VIDEO;
  const poster = settings?.showreelPoster || FALLBACK_POSTER;

  const isEmbed =
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be") ||
    videoUrl.includes("vimeo.com");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {isEmbed ? (
        <iframe
          src={videoUrl}
          title="Showreel"
          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.15] object-cover"
          allow="autoplay; muted"
        />
      ) : (
        <video
          className="login-video absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,7,8,0.35),rgba(7,7,8,0.82))]" />
      <div className="relative z-10 w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
