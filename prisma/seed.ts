import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ABOUT = `Picsodian Studios is a passion-driven creative studio built around ideas, motion, and people who truly care about the work they create. We are a collective of artists from around the world, united by one vision: to tell powerful stories and create visuals that are undeniably cool.

We believe storytelling is more than just frames and effects. It's about blasting the screen with energy, emotion, and imagination in a way that makes you feel like you're part of the experience. It's about creating moments that don't just look good, but stay with you.

At Picsodian Studios, our team shows up every day with the intent to be better than yesterday. We explore, we evolve, and we constantly challenge ourselves to push boundaries. Our goal is to create work that feels mind blowing, fresh, and fearless — work that dares to shake systems, break patterns, and redefine what's possible through visual storytelling.`;

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@picsodianstudios.com";
  const password = process.env.ADMIN_PASSWORD ?? "Picsodian@2026";
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { password: hash, name: "Studio Admin" },
    create: { email, password: hash, name: "Studio Admin" },
  });

  await prisma.setting.upsert({
    where: { id: "studio" },
    update: {},
    create: {
      id: "studio",
      showreelUrl: "/homepagevideo.mp4",
      showreelPoster:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=80",
      tagline: "Creative visual studio. Motion, film, and worlds that stay with you.",
      email: "creatives@picsodianstudios.com",
      instagram: "https://instagram.com/picsodianstudios",
      twitter: "",
      linkedin: "https://www.linkedin.com/company/picsodianstudios",
      vimeo: "",
      about: ABOUT,
    },
  });

  const works = [
    {
      title: "The Crew",
      slug: "the-crew",
      category: "Film",
      year: 2024,
      client: "Picsodian Original",
      director: "Picsodian Studios",
      role: "Direction / Animation / Compositing",
      synopsis:
        "An experimental short film from Picsodian Studios, exploring the boundaries of visual storytelling and pushing the limits of imagination. Set in a dystopian future where humanity faces unprecedented challenges, this story follows a group of unlikely heroes as they navigate through a world transformed by technology and conflict.",
      overview:
        "The Crew is a passion project built to test how far a small studio can push cinematic animation. Every frame was designed to feel like a live-action set that just happens to be drawn — camera language, lighting, and performance first, effects second.",
      crew: JSON.stringify([
        { role: "Production", name: "Picsodian Studios" },
        { role: "Direction", name: "Picsodian Creative Team" },
        { role: "Animation", name: "Studio Artists" },
        { role: "Compositing", name: "Picsodian Post" },
      ]),
      thumbnail:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
      heroImage:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2400&q=80",
      videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
      ]),
      featured: false,
      published: true,
      sortOrder: 4,
    },
    {
      title: "2D DJ GIRL",
      slug: "2d-dj-girl",
      category: "2D",
      year: 2024,
      client: "Original",
      director: "Picsodian Studios",
      role: "2D Animation / Character",
      synopsis:
        "A neon-soaked 2D character piece following a DJ who turns a packed floor into a living waveform. Graphic, rhythmic, and built to hit on beat.",
      overview:
        "Designed as a style frame that grew into a full performance loop. The character work leans into bold graphic shapes, smear frames, and lighting that behaves like a club rig.",
      crew: JSON.stringify([
        { role: "Character Design", name: "Picsodian Studios" },
        { role: "2D Animation", name: "Picsodian Studios" },
      ]),
      thumbnail:
        "https://images.unsplash.com/photo-1571266028243-d220c6c2fc38?auto=format&fit=crop&w=1600&q=80",
      heroImage:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2400&q=80",
      videoUrl: "/works/2d-dj-girl.mp4",
      gallery: JSON.stringify([]),
      featured: true,
      published: true,
      sortOrder: 2,
    },
    {
      title: "Advance Motion Graphics",
      slug: "advance-motion-graphics",
      category: "Motion",
      year: 2024,
      client: "Studio R&D",
      director: "Picsodian Studios",
      role: "Motion Design / 3D",
      synopsis:
        "A high-energy motion system exploring type, texture, and camera moves that feel closer to a title sequence than a typical explainer.",
      overview:
        "Built as an internal R&D reel to stress-test our motion pipeline — from kinetic type to simulated materials and editorial-grade cuts.",
      crew: JSON.stringify([{ role: "Motion Design", name: "Picsodian Studios" }]),
      thumbnail:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
      heroImage:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2400&q=80",
      videoUrl: "/works/advance-motion-graphics.mp4",
      gallery: JSON.stringify([]),
      featured: true,
      published: true,
      sortOrder: 3,
    },
    {
      title: "Chalaki",
      slug: "chalaki",
      category: "2D",
      year: 2023,
      client: "Original",
      director: "Picsodian Studios",
      role: "Direction / 2D",
      synopsis:
        "A short, sly character film about wit, timing, and the kind of humour that lives in a glance. Graphic storytelling with a street-smart pulse.",
      overview:
        "Chalaki was produced as a character study — limited colour, strong posing, and timing that lets the joke land without over-animating.",
      crew: JSON.stringify([{ role: "Direction", name: "Picsodian Studios" }]),
      thumbnail:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
      heroImage:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=2400&q=80",
      videoUrl: "",
      gallery: JSON.stringify([]),
      featured: false,
      published: true,
      sortOrder: 4,
    },
    {
      title: "Loganster",
      slug: "loganster",
      category: "Character",
      year: 2023,
      client: "Original",
      director: "Picsodian Studios",
      role: "Character / Animation",
      synopsis:
        "A creature-led character piece. Personality first, spectacle second — Loganster is designed to feel like a living performer, not a mascot.",
      overview:
        "The project started as a sculpt and turned into a full performance test: walk cycles, facial acting, and a lighting setup that treats the character like a film actor.",
      crew: JSON.stringify([{ role: "Character Animation", name: "Picsodian Studios" }]),
      thumbnail:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80",
      heroImage:
        "https://images.unsplash.com/photo-1608889175250-c3b12b15b4d1?auto=format&fit=crop&w=2400&q=80",
      videoUrl: "",
      gallery: JSON.stringify([]),
      featured: true,
      published: true,
      sortOrder: 5,
    },
    {
      title: "Prop Animations",
      slug: "prop-animations",
      category: "3D",
      year: 2023,
      client: "Studio R&D",
      director: "Picsodian Studios",
      role: "3D / Props / Lookdev",
      synopsis:
        "A collection of hero props brought to life — weight, material, and camera craft. The kind of object animation that makes a world feel real.",
      overview:
        "Shot as a series of tabletop-style hero moments. Each prop gets its own lighting language, from brushed metal to worn plastic and practical glow.",
      crew: JSON.stringify([{ role: "3D Animation", name: "Picsodian Studios" }]),
      thumbnail:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
      heroImage:
        "https://images.unsplash.com/photo-1620121692029-d0884565381d?auto=format&fit=crop&w=2400&q=80",
      videoUrl: "/works/prop-animations.mp4",
      gallery: JSON.stringify([]),
      featured: true,
      published: true,
      sortOrder: 4,
    },
  ];

  for (const work of works) {
    await prisma.work.upsert({
      where: { slug: work.slug },
      update: work,
      create: work,
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
