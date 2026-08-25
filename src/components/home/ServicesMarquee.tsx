import { SafeImage } from "@/components/ui/SafeImage";

type Item = {
  label: string;
  image: string;
};

const SERVICES: Item[] = [
  {
    label: "2D Animation",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Motion Graphics",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Character",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Prop Animation",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Film Production",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Lookdev",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Compositing",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Title Design",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
  },
];

export function ServicesMarquee({ stills = [] }: { stills?: string[] }) {
  const items = SERVICES.map((service, i) => ({
    ...service,
    image: stills.length ? stills[i % stills.length] : service.image,
  }));
  const row = [...items, ...items];

  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-28">
      <div className="px-4 md:px-7">
        <p className="micro text-signal">Capabilities / 04</p>
        <h2 className="services-heading mt-4">What we make</h2>
      </div>

      <div className="mt-14 overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-8 py-6 md:gap-12">
          {row.map((item, i) => (
            <span
              key={`${item.label}-${i}`}
              className="flex items-center gap-8 md:gap-12"
            >
              <span className="services-word">{item.label}</span>
              <span
                className={`relative h-20 w-32 shrink-0 overflow-hidden border border-white/20 md:h-28 md:w-44 ${
                  i % 2 === 0 ? "-rotate-6" : "rotate-3"
                }`}
              >
                <SafeImage
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute inset-1 border border-signal/50" />
              </span>
              <span className="h-2.5 w-2.5 shrink-0 bg-signal" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
