import { notFound } from "next/navigation";
import { getTaskBySlug } from "@/src/lib/data";
import ShadowingClient from "@/src/features/shadowing/components/ShadowingClient";

// Enable dynamic rendering
export const dynamic = "force-dynamic";

interface ShadowingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShadowingPage({ params }: ShadowingPageProps) {
  const { slug } = await params;
  const task = await getTaskBySlug(slug);

  if (!task) {
    notFound();
  }

  // The layout wrapper is handled by the root layout,
  // but we render the client component directly here.
  return <ShadowingClient task={task} />;
}
