
import { getUserSession } from '@/action';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const checkRole = async() => {
  const supabase = await createClient();

  const check= await getUserSession();
   let role = 'user';
  // get current user (server-side)
  if(check?.claims){
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) console.error('getUser error', userErr);

  // default role


  if (user?.id) {
    // fetch role from user_Profiles table
    const { data: profile, error: profileErr } = await supabase
      .from('user_Profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileErr) {
      console.error('profile fetch error', profileErr);
      redirect("/login")
    } else if (profile?.role) {
      role = profile.role;
    }
  }
   return ({user:user,role:role})
  }
  
  return ({user:null,role:role})
}

export default checkRole;
