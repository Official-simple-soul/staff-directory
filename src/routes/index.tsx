import { LoginScreen } from '@/pages/auth/Login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <LoginScreen />
}
