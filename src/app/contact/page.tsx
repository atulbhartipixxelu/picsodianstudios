import { ContactExperience } from "@/components/contact/ContactExperience";
import { PageReveal } from "@/components/ui/PageReveal";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageReveal>
      <ContactExperience />
    </PageReveal>
  );
}
