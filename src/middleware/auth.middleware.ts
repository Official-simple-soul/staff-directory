// src/middleware/authMiddleware.ts
import { userApi } from '@/api/user.api'
import { auth } from '@/lib/firebase'

export const requireAdminAuth = async () => {
  const currentUser = auth.currentUser

  if (!currentUser) {
    return { redirect: '/' }
  }

  try {
    const userData = await userApi.getUserByEmail(currentUser.email!)

    if (!userData || !['admin', 'super-admin'].includes(userData.role)) {
      await auth.signOut()
      return { redirect: '/' }
    }

    return { user: userData }
  } catch (error) {
    await auth.signOut()
    return { redirect: '/' }
  }
}
