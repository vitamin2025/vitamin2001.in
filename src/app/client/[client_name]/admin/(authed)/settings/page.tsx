import { FeatureGate } from "@/components/client-admin";
import { SettingsView } from "./settings-view";

export default function SettingsPage() {
  return (
    <FeatureGate feature="settings">
      <SettingsView />
    </FeatureGate>
  );
}
