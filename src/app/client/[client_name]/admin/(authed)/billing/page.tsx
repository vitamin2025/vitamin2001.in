import { FeatureGate } from "@/components/client-admin";
import { BillingView } from "./billing-view";

export default function BillingPage() {
  return (
    <FeatureGate feature="billing">
      <BillingView />
    </FeatureGate>
  );
}
