import Shipping from '@/components/shipping';
import { currentUser } from '@clerk/nextjs/server';

const Order= async() => {
  const user= await currentUser();
      console.log(user,"account");
       const planUser = {
      userId:user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      phone: user.phoneNumbers[0]?.phoneNumber || '',
    }
    
  return (
    <div><Shipping user={planUser}/></div>
  )
}

export default Order