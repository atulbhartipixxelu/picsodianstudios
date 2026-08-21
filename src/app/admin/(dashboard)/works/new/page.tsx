import { WorkForm } from "@/components/admin/WorkForm";

export default function NewWorkPage() {
  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
        New work
      </h1>
      <p className="mt-2 text-sm text-white/45">Add a project to the studio library.</p>
      <div className="mt-8 max-w-3xl">
        <WorkForm />
      </div>
    </div>
  );
}
