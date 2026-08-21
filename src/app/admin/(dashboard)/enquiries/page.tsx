import { prisma } from "@/lib/prisma";
import { EnquiryList } from "@/components/admin/EnquiryList";

export default async function EnquiriesPage() {
  const items = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
        Enquiries
      </h1>
      <p className="mt-2 text-sm text-white/45">Messages from the contact form.</p>
      <EnquiryList
        items={items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
