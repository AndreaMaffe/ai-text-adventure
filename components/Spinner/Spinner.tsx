import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: number
  color?: string
  className?: string
}

export default function Spinner({
  size = 32,
  color = 'primary',
}: SpinnerProps) {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className={`w-min animate-spin text-${color}`}>
        <Loader2 size={size} />
      </div>
    </div>
  )
}
