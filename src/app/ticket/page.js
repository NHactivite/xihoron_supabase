import { currentUser } from "@clerk/nextjs/server";
import { getCandidateById } from "@/action";
import TicketCardClient from "@/components/ticketCardClient";
export default async function Page() {
  const user = await currentUser();
  const candidate = await getCandidateById(user.id);

  return <TicketCardClient candidate={candidate} />;
}
