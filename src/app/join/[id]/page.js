import { getEventsById } from '@/action';
import Join from '@/components/joinFrom';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Order = async ({ params }) => {
  const id = params.id;
  const user = await currentUser();
  const safeUser = user ? JSON.parse(JSON.stringify(user)) : null;

  if (!safeUser) {
    // Server-side redirect (instant)
   redirect('/sign-in?message=login-required');
  }

  const Event = await getEventsById(id);

  return (
    <div>
      <Join Event={Event} user={safeUser} />
    </div>
  );
};

export default Order;
