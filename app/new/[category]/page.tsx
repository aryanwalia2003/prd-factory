import { notFound } from "next/navigation";
import { PRD_TEMPLATES } from "@/lib/templates";
import { getAnyTemplate } from "@/lib/template-store";
import PrdForm from "@/components/PrdForm";

// Built-in templates prerender; custom (DB) ones on-demand render hote hain.
export function generateStaticParams() {
  return PRD_TEMPLATES.map((t) => ({ category: t.id }));
}

export default async function NewPrdPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const template = await getAnyTemplate(category);
  if (!template) notFound();

  return <PrdForm template={template} />;
}
