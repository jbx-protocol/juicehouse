import { ReactNode, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFundingCycleCountdown } from '../hooks/useFundingCycleCountdown'

const RS_PROJECT_ID = 618

export type ProjectHeaderCountdownProps = {
  className?: string
}

export const ProjectHeaderCountdown: React.FC<ProjectHeaderCountdownProps> = ({
  className,
}) => {
  const { secondsRemaining } = useFundingCycleCountdown()

  const { days, hours, minutes, seconds } = useMemo(() => {
    const days = Math.floor(secondsRemaining / (3600 * 24))
    const hours = Math.floor((secondsRemaining % (3600 * 24)) / 3600)
    const minutes = Math.floor((secondsRemaining % 3600) / 60)
    const seconds = Math.floor(secondsRemaining % 60)
    return { days, hours, minutes, seconds }
  }, [secondsRemaining])

  if (RS_PROJECT_ID === 618) return null

  if (secondsRemaining === 0) return null
  return (
    <div
      className={twMerge(
        'absolute bottom-5 left-1/2 mx-auto flex w-full max-w-6xl -translate-x-1/2 items-center justify-end pr-5',
        className,
      )}
    >
      <div className="mr-3 text-lg text-white">Closing in</div>
      <div className="flex gap-1.5">
        <CountdownCard label="Days" unit={days} />
        <CountdownCard label="Hrs" unit={hours} />
        <CountdownCard label="Mins" unit={minutes} />
        <CountdownCard label="Secs" unit={seconds} />
      </div>
    </div>
  )
}

export const CountdownCard = ({
  label,
  unit,
}: {
  label: ReactNode
  unit: number
}) => (
  <div className="flex w-11 flex-1 flex-col items-center rounded-lg border border-smoke-75 bg-smoke-50 py-1 px-1.5 text-black drop-shadow dark:border-slate-400 dark:bg-slate-700 dark:text-white">
    <div className="text-xl">{unit}</div>
    <div className="text-xs">{label}</div>
  </div>
)
