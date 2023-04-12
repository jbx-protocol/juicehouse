import { Trans } from '@lingui/macro'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { formatAmount } from 'utils/format/formatAmount'
import { SectionContainer } from './SectionContainer'
import juiceHero from '/public/assets/juice-homepage-hero.webp'

export const OurMissionSection = () => {
  return (
    <SectionContainer className="sm:gap-24 md:flex md:justify-between md:gap-32">
      <div className="md:w-1/2">
        <h2 className="font-header text-3xl md:text-4xl">
          <Trans>Our mission</Trans>
        </h2>
        <p className="text-base text-grey-700 dark:text-slate-200 md:text-lg">
          <Trans>
            To connect 1,000,000 creators to 100,000,000 contributors to raise
            $1,000,000,000, whilst putting Juicebox into the hands of our
            community - sharing our success with the people that matter.
          </Trans>
        </p>

        <ProgressBar
          className="my-20"
          currentAmount={500687764}
          maxAmount={1000000000}
        />
      </div>

      <div className="mx-auto w-80 max-w-xs md:mx-0">
        <Image
          src={juiceHero}
          alt="Banny the chill Juicebox banana drinking juice"
          priority
        />
      </div>
    </SectionContainer>
  )
}

interface ProgressBarProps {
  className?: string
  currentAmount: number
  maxAmount: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  currentAmount,
  maxAmount,
}) => {
  const percentage = (currentAmount / maxAmount) * 100

  return (
    <div className={twMerge('text-start', className)}>
      <div className="relative mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-medium">$0</span>

          {/* Progress bar */}
          <div className="relative h-3 w-full rounded-full bg-split-100 dark:bg-slate-400">
            <div
              className="h-full rounded-full bg-split-400"
              style={{ width: `${percentage}%` }}
            />

            {/* Tooltip bubble */}
            <div
              // Add a soft shadow to the tooltip bubble
              className="absolute bottom-full mb-2 flex -translate-x-1/2 flex-col items-center"
              style={{
                left: `${percentage}%`,
              }}
            >
              <div className="bg-l0 whitespace-nowrap rounded-lg bg-white py-2 px-3 font-medium shadow-md dark:bg-slate-900">
                <Trans>We are here</Trans>
              </div>
              <div className="h-0 w-0 border-4 border-b-0 border-transparent border-t-white shadow-md dark:border-t-slate-900" />
            </div>

            {/* Underneath current number */}
            <div
              className="absolute top-full mt-2 -translate-x-1/2"
              style={{
                left: `${percentage}%`,
              }}
            >
              <span>${formatAmount(currentAmount)}</span>
            </div>
          </div>

          <span className="text-2xl font-medium">
            ${Math.floor(maxAmount / 1e9)}B
          </span>
        </div>
      </div>
    </div>
  )
}
