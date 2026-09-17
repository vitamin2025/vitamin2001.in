import { redirect } from "next/navigation";

export default async function PublicFeaturePage({
  params,
}: {
  params: Promise<{ client_name: string; feature: string }>;
}) {
  const { client_name, feature } = await params;

  if (feature.toLowerCase() === "linktree" || feature.toLowerCase() === "links") {
    redirect("/public/links");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8 text-slate-500">
      <p>Feature &ldquo;{feature}&rdquo; is not available for {client_name}.</p>
    </div>
  );
}
