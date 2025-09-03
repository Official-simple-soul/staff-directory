import { Image } from '@mantine/core'

function AppLogo() {
  return (
    <div className="font-bold text-sm text-primary border-b-2 border-t-2 border-b-secondary size-10 flex justify-center items-center rounded-xl overflow-hidden">
      <Image src={'/sm-logo.png'} loading="lazy" alt="App Logo" />
    </div>
  )
}

export default AppLogo
