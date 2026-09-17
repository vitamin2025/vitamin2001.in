import { FeatureGate } from "@/components/client-admin";
import { AuditView } from "./audit-view";

export default function AuditPage() {
  return (
    <FeatureGate feature="audit">
      <AuditView />
    </FeatureGate>
  );
}
