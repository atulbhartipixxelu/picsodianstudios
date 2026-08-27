import { WorkForm } from "@/components/admin/WorkForm";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function NewWorkPage() {
  return (
    <div>
      <AdminHeader
        kicker="Library"
        title="New work"
        description="Add a project to the studio library."
      />
      <div className="max-w-3xl">
        <WorkForm />
      </div>
    </div>
  );
}
