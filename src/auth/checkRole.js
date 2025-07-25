import { auth } from '@clerk/nextjs/server'

export const checkRole = async () => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === "admin"
}