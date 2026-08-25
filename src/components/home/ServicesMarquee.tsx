import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";

type Item = {
  n: string;
  label: string;
  tag: string;
  image: string;
};

const SERVICES: Item[] = [
  {
    n: "01",
    label: "2D Animation",
    tag: "Graphic / Performance",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "02",
    label: "Motion Graphics",
    tag: "Type / Texture / Camera",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "03",
    label: "Character",
    tag: "Creature / Acting",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "04",
    label: "Prop Animation",
    tag: "Weight / Material",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "05",
    label: "Film Production",
    tag: "Direction / Picture",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "06",
    label: "Lookdev",
    tag: "Light / Surface",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "07",
    label: "Compositing",
    tag: "Finish / Integration",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    n: "08",
    label: "Title Design",
    tag: "Sequence / Identity",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
  },
];

function Track({
  items,
  reverse = false,
}: {
  items: Item[];
  reverse?: boolean;
}) {
  const row = [...items, ...items];

  return (
    <div className="services-mask">
      <div
        className={
          reverse ? "services-track services-track-reverse" : "services-track"
        }
      >
        {row.map((item, i) => (
          <article
            key={`${item.n}-${reverse ? "b" : "a"}-${i}`}
            className="services-cell"
          >
            <div className="services-frame">
              <span className="services-sprocket" aria-hidden />
              <SafeImage
                src={item.image}
                alt=""
                className="services-still"
              />
              <span className="services-safe" aria-hidden />
              <span className="services-index">{item.n}</span>
            </div>
            <div className="services-copy">
              <p className="services-word">{item.label}</p>
              <p className="services-tag">{item.tag}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ServicesMarquee({ stills = [] }: { stills?: string[] }) {
  const items = SERVICES.map((service, i) => ({
    ...service,
    image: stills.length ? stills[i % stills.length] : service.image,
  }));
  const reverseItems = [...items].reverse();

  return (
    <section className="services-stage">
      <div className="services-head">
        <div>
          <div className="flex items-center gap-3">
            <span className="crosshair" aria-hidden />
            <p className="micro text-signal">Capabilities / 04</p>
          </div>
          <h2 className="services-heading mt-4">What we make</h2>
          <p className="services-lede">
            Eight crafts. One pipeline. Pictures with a pulse — from a single
            prop to a full title sequence.
          </p>
        </div>
        <div className="services-meta">
          <p className="micro text-paper/55">08 / crafts</p>
          <Link href="/work" className="micro text-signal" data-cursor="Index">
            See it in motion →
          </Link>
        </div>
      </div>

      <div className="services-rows">
        <Track items={items} />
        <div className="services-rule" aria-hidden />
        <Track items={reverseItems} reverse />
      </div>
    </section>
  );
}
