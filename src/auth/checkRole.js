import { auth } from '@clerk/nextjs/server'

export const checkRole = async () => {
  const { sessionClaims } = await auth()
  console.log(sessionClaims ,"hoo");
  
  return sessionClaims?.metadata?.role === "admin"
}