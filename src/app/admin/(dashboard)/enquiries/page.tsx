import { prisma } from "@/lib/prisma";
import { EnquiryList } from "@/components/admin/EnquiryList";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function EnquiriesPage() {
  const items = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminHeader
        kicker="Inbox"
        title="Enquiries"
        description="Messages from the contact form."
      />
      <EnquiryList
        items={items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
