"use client";

import { useRouter } from "next/navigation";

export default function DeletePrdButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete karna hai?")) return;
    await fetch(`/api/prds/${id}`, { method: "DELETE" });
    router.push("/prds");
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
