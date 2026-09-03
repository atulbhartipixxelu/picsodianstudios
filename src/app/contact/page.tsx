import { ContactExperience } from "@/components/contact/ContactExperience";
import { PageReveal } from "@/components/ui/PageReveal";
import { getPublicStudio } from "@/lib/public-data";

export const revalidate = 60;
export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const studio = await getPublicStudio();

  return (
    <PageReveal>
      <ContactExperience
        email={studio.email}
        instagram={studio.instagram}
        twitter={studio.twitter}
        linkedin={studio.linkedin}
        vimeo={studio.vimeo}
      />
    </PageReveal>
  );
}
