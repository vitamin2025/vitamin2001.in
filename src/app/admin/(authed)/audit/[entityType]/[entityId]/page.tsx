import { EntityTrailView } from "./entity-trail-view";

export default async function EntityAuditPage({
  params,
}: {
  params: Promise<{ entityType: string; entityId: string }>;
}) {
  const { entityType, entityId } = await params;
  return (
    <EntityTrailView
      entityType={decodeURIComponent(entityType)}
      entityId={decodeURIComponent(entityId)}
    />
  );
}
