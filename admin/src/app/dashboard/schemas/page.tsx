import SchemaStudio from "@/components/SchemaStudio";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";

export default async function SchemasPage() {
  const session = await getAdminSession();
  return (
    <>
      <TopBar title="Schémas 3D" email={session?.email ?? ""} />
      <main className="flex-1 p-6">
        <p className="mb-5 max-w-2xl text-sm font-medium leading-relaxed text-[#64748B]">
          Une image annotée (pas un mesh 3D). Prof propose les pastilles ; tu les corriges et tu les attaches à un chapitre.
        </p>
        <SchemaStudio />
      </main>
    </>
  );
}
