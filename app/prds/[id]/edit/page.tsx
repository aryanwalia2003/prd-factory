import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPrd } from "@/lib/db/prds";
import { getAnyTemplate } from "@/lib/template-store";
import PrdForm from "@/components/PrdForm";

export const instant = false; // session check runtime pe hota hai

export default async function EditPrdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const row = await getPrd(id);
  if (!row) notFound();
  if (row.createdBy !== session.user.id) redirect(`/prds/${id}`);

  const template = await getAnyTemplate(row.categoryId);
  if (!template) notFound();

  return (
    <PrdForm
      template={template}
      existing={{ id: row.id, title: row.title, author: row.author, sections: row.sections }}
    />
  );
}
