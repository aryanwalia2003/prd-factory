"use client";

import { useRouter } from "next/navigation";

export default function DeleteTemplateButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Template delete karna hai?")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
      Delete
    </button>
  );
}
