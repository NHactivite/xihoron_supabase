import { getEventsById } from '@/action';
import checkRole from '@/app/auth/checkRole';
import Join from '@/components/joinFrom';
import { redirect } from 'next/navigation';

const Order = async ({ params }) => {
  const id = params.id;
   const {user}=await checkRole()
   const safeUser = user ? JSON.parse(JSON.stringify(user)) : null;

  if (!safeUser) {
    // Server-side redirect (instant)
   redirect('/login?message=login-required');
  }

  const Event = await getEventsById(id);

  console.log(safeUser,"safe from from");
  
  return (
    <div>
      <Join Event={Event} user={safeUser} />
    </div>
  );
};

export default Order;
