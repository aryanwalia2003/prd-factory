import { notFound } from "next/navigation";
import { getTemplate, PRD_TEMPLATES } from "@/lib/templates";
import PrdForm from "@/components/PrdForm";

export function generateStaticParams() {
  return PRD_TEMPLATES.map((t) => ({ category: t.id }));
}

export default async function NewPrdPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const template = getTemplate(category);
  if (!template) notFound();

  return <PrdForm template={template} />;
}
