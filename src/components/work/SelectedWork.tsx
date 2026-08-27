import Link from "next/link";
import type { PublicWork } from "@/lib/utils";
import { embedVideoSrc, isDirectVideo } from "@/lib/video";
import { SafeImage } from "@/components/ui/SafeImage";

export function SelectedWork({ work }: { work: PublicWork }) {
  const direct =
    work.videoUrl && isDirectVideo(work.videoUrl) ? work.videoUrl : null;
  const embed = work.videoUrl && !direct ? embedVideoSrc(work.videoUrl) : null;
  const still = work.heroImage || work.thumbnail;

  return (
    <section className="work-pick">
      <div className="work-pick-media" aria-hidden>
        {embed ? (
          <iframe
            src={embed}
            title={work.title}
            className="work-pick-video"
            allow="autoplay; muted"
          />
        ) : direct ? (
          <video
            src={direct}
            poster={still}
            className="work-pick-video"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <SafeImage src={still} alt="" className="work-pick-video" />
        )}
        <div className="work-pick-shade" />
      </div>

      <div className="work-pick-copy">
        <p className="micro text-signal">Selected</p>
        <h2 className="work-pick-title">{work.title}</h2>
        {work.synopsis ? (
          <p className="work-pick-lede">{work.synopsis}</p>
        ) : null}
        <p className="micro mt-5 text-paper/70">
          {work.year}
          {work.category ? ` · ${work.category}` : ""}
          {work.client ? ` · ${work.client}` : ""}
        </p>
        <Link
          href={`/work/${work.slug}`}
          data-cursor="View"
          className="work-pick-btn"
        >
          Open cut
        </Link>
      </div>
    </section>
  );
}
