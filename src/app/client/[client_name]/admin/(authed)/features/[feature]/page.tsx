import { ComingSoonView } from "./coming-soon-view";

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ client_name: string; feature: string }>;
}) {
  const { feature } = await params;
  return <ComingSoonView feature={feature} />;
}
