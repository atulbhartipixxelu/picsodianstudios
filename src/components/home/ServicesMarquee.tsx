const ITEMS = [
  "2D Animation",
  "Motion Graphics",
  "Character",
  "Prop Animation",
  "Film Production",
  "Lookdev",
  "Compositing",
  "Title Design",
];

export function ServicesMarquee() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <section className="flex min-h-[100svh] items-center overflow-hidden border-y border-line bg-ink-2">
      <div className="animate-marquee flex w-max gap-10 py-8">
        {row.map((item, i) => (
          <span
            key={item + i}
            className="display-huge flex items-center gap-10 text-5xl text-paper/90 md:text-7xl"
          >
            {item}
            <span className="h-3 w-3 bg-signal" />
          </span>
        ))}
      </div>
    </section>
  );
}
