import { OrgDetailView } from "./org-detail-view";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrgDetailView orgId={orgId} />;
}
