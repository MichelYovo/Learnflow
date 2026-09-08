import MessagesInbox from "@/components/MessagesInbox";
import TopBar from "@/components/TopBar";
import { getAdminSession } from "@/lib/auth";
import { listSupportMessages } from "@/lib/supportInbox";

export default async function MessagesPage() {
  const session = await getAdminSession();
  const { data } = await listSupportMessages();
  const messages = data ?? [];

  return (
    <>
      <TopBar title="Messages" email={session?.email ?? ""} />
      <main className="flex-1 p-6">
        <p className="mb-5 text-sm font-medium text-[#64748B]">
          Formulaires du site vitrine · Support et liste d’attente
          {` · ${messages.length} message${messages.length > 1 ? "s" : ""}`}
        </p>
        <MessagesInbox messages={messages} />
      </main>
    </>
  );
}
