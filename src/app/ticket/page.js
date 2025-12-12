import { getCandidateById } from "@/action";
import TicketCardClient from "@/components/ticketCardClient";
import { createClient } from "@/lib/supabase/server";
export default async function Page() {
   const supabase=await createClient();
   const {data:{user}}=await supabase.auth.getUser()
  const candidate = await getCandidateById(user?.id);
console.log(candidate,"oo");



  return <TicketCardClient candidate={candidate} />;
}
