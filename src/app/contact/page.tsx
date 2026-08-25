import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { PageReveal } from "@/components/ui/PageReveal";
import { ScrollWords } from "@/components/ui/ScrollWords";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageReveal>
      <div className="relative min-h-screen bg-ink text-paper">
        <section className="grid gap-12 px-4 pt-10 pb-28 md:grid-cols-12 md:px-7 md:pt-12">
          <div className="md:col-span-5">
            <p className="micro text-signal">Contact / Press & business</p>
            <ScrollWords
              as="h1"
              className="display-huge mt-4 text-[14vw] md:text-[6.2vw]"
              lines={["Get in", "touch."]}
              accentWords={["touch"]}
            />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">
              For business inquiries and press. Tell us what you want to make —
              film, motion, character, or something that doesn&apos;t have a name yet.
            </p>

            <div className="mt-10 space-y-6 border-t border-line pt-8">
              <div>
                <p className="micro text-mist">Studio</p>
                <a
                  href="mailto:creatives@picsodianstudios.com"
                  className="mt-2 block text-signal"
                  data-cursor="Mail"
                >
                  creatives@picsodianstudios.com
                </a>
              </div>
              <div>
                <p className="micro text-mist">For</p>
                <p className="mt-2 text-paper/80">
                  Films · Music videos · Commercials · Game cinematics · Originals
                </p>
              </div>
            </div>
          </div>

          <div className="border border-line bg-ink-2/60 p-6 md:col-span-6 md:col-start-7 md:p-8">
            <p className="micro mb-8 text-mist">Enquiry form / 01</p>
            <EnquiryForm />
          </div>
        </section>
      </div>
    </PageReveal>
  );
}
