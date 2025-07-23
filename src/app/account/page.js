import AccountPage from '@/components/account'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const Account = async() => {
    const user= await currentUser();
    console.log(user,"account");
     const planUser = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.emailAddresses[0]?.emailAddress || '',
    phone: user.phoneNumbers[0]?.phoneNumber || '',
    phoneId: user.phoneNumbers[0]?.id || '',
    joinDate: new Date(user.createdAt).toLocaleDateString(),
    img: user.imageUrl || '',
  }
    
  return (
    <AccountPage planUser={planUser}/>
  )
}

export default Account