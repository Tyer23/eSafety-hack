import ParentDashboard from "../../components/ParentDashboard";

export const dynamic = "force-dynamic";

export default function ParentPage() {
  // In a real app we would read the logged‑in user from a session/cookie.
  // For this MVP we hard‑code parent_01.
  const parentId = "parent_01";

  return <ParentDashboard parentId={parentId} />;
}


