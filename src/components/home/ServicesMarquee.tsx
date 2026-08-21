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
    <section className="overflow-hidden border-y border-line bg-ink-2 py-8">
      <div className="animate-marquee flex w-max gap-10">
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
