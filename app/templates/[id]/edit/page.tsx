import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCustomTemplate, getCustomTemplateOwnerId } from "@/lib/db/custom-templates";
import TemplateForm from "@/components/TemplateForm";

export const instant = false; // session check runtime pe hota hai

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const template = await getCustomTemplate(id);
  if (!template) notFound();

  const ownerId = await getCustomTemplateOwnerId(id);
  if (ownerId !== session.user.id) redirect("/templates");

  return <TemplateForm existing={template} />;
}
