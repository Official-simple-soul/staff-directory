import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Group,
  Center,
  LoadingOverlay,
  Alert,
  Divider,
  Stack,
} from '@mantine/core'
import { IconLogin, IconShield, IconAlertCircle } from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useUser } from '@/services/user.service'
import { colors, radius } from '@/theme/theme'
import { sharedInputProps } from '@/constant/ui'
import { AppButton } from '@/components/AppButton'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { getUserByEmail } = useUser()

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length >= 6 ? null : 'Password must be at least 6 characters',
    },
  })

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true)
    setError('')

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      )
      const firebaseUser = userCredential.user

      // Check if user has admin role in Firestore
      const userData = await getUserByEmail(values.email)

      if (!userData) {
        throw new Error('User account not found')
      }

      if (!['admin', 'super-admin'].includes(userData.role)) {
        // Sign out non-admin users immediately
        await auth.signOut()
        throw new Error('Access denied. Admin privileges required.')
      }

      // Successful login - redirect to dashboard
      notifications.show({
        title: 'Welcome back!',
        message: `Logged in as ${userData.name}`,
        color: 'green',
      })

      navigate({ to: '/dashboard' })
    } catch (err: any) {
      console.error('Login error:', err)

      let errorMessage = 'Login failed. Please try again.'

      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.'
          break
        default:
          errorMessage = err.message || 'Login failed. Please try again.'
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-layout flex items-center justify-center p-4">
      {/* Glassmorphism Container */}
      <Paper
        p={{ base: 'md', md: 'xl' }}
        radius={radius.app}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl relative"
      >
        <LoadingOverlay visible={loading} />

        {/* Header */}
        <Center mb="xl">
          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full inline-flex mb-4">
              <IconShield size={32} className="text-primary" />
            </div>
            <Text fw={700} size="xl" className="text-text mb-2">
              Admin Dashboard
            </Text>
            <Text size="sm" c="dimmed">
              Sign in to access the management panel
            </Text>
          </div>
        </Center>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Authentication Error"
            color="red"
            variant="light"
            mb="xl"
            radius="md"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack gap="md">
            <TextInput
              label="Email Address"
              placeholder="your.email@company.com"
              required
              {...form.getInputProps('email')}
              {...sharedInputProps()}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
              {...sharedInputProps()}
            />

            <AppButton
              type="submit"
              loading={loading}
              leftSection={!loading && <IconLogin size={18} />}
              fullWidth
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </AppButton>
          </Stack>
        </form>

        <Divider my="xl" label="Access Information" labelPosition="center" />

        <Text size="sm" c="dimmed" ta="center">
          Only users with <strong>admin privileges</strong> can access this
          system.
          <br />
          Contact your system administrator for access.
        </Text>

        {/* Security Footer */}
        <Group
          justify="center"
          mt="xl"
          pt="xl"
          className="border-t border-gray-200/50"
        >
          <Text size="xs" c="dimmed">
            🔒 Secure Admin Portal • {new Date().getFullYear()}
          </Text>
        </Group>
      </Paper>
    </div>
  )
}
