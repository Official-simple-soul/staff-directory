import { userApi } from '@/api/user.api'
import { auth } from '@/lib/firebase'
import { colors } from '@/theme/theme'
import { notifications } from '@mantine/notifications'
import { onAuthStateChanged } from 'firebase/auth'

function waitForAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const requireAuth = async (allowedRoles: string[] = []) => {
  // ✅ Wait for Firebase to restore auth
  const currentUser =
    auth.currentUser || ((await waitForAuth()) as typeof auth.currentUser)

  if (!currentUser) {
    return { redirect: '/' }
  }

  try {
    const userData = await userApi.getUserByEmail(currentUser.email!)

    // ✅ If roles are provided, enforce them
    if (
      !userData ||
      (allowedRoles.length > 0 && !allowedRoles.includes(userData.role))
    ) {
      // await auth.signOut()
      notifications.show({
        title: 'Access Denied',
        message: 'You do not have permission to view this page.',
        color: colors.danger,
      })
      return { redirect: '..' }
    }

    return { user: userData }
  } catch (error) {
    await auth.signOut()
    return { redirect: '/' }
  }
}
