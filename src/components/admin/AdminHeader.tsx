import type { ReactNode } from "react";

export function AdminHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="dash-head">
      <div className="min-w-0">
        {kicker ? <p className="micro text-white/40">{kicker}</p> : null}
        <h1 className="dash-title">{title}</h1>
        {description ? <p className="dash-lede">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
