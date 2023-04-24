import { Trans } from '@lingui/macro'
import Loading from 'components/Loading'
import template from 'lodash/template'
import { HomepageCard } from '../../HomepageCard'
import { ProjectCarousel } from '../../ProjectCarousel'
import { SectionHeading } from '../../SectionHeading'
import { useExploreCategories } from '../hooks/useExploreCategories'

export const ExploreCategories = () => {
  const { tags, isLoading, error } = useExploreCategories()
  return (
    <div>
      <SectionHeading
        className="mb-12"
        heading={<Trans>Explore categories</Trans>}
        subheading={
          <Trans>
            Whether it's a fundraiser or NFT project, we've got you covered.
          </Trans>
        }
      />

      {isLoading ? (
        <Loading size="large" />
      ) : error ? (
        <div className="text-error">{error}</div>
      ) : (
        <ProjectCarousel
          items={tags.map(tag => (
            <HomepageCard
              key={tag}
              title={tag.charAt(0).toUpperCase() + tag.slice(1)}
              img={
                <img
                  className="h-full w-full object-cover object-center"
                  src={CategoryImagePath({ tag })}
                  alt={tag}
                />
              }
              href={CategoryLink({ tag })}
            />
          ))}
        />
      )}
    </div>
  )
}

const CategoryImagePath = template(
  '/assets/images/home/categories/<%= tag %>.jpg',
)

const CategoryLink = template('/projects?tab=all&search=&tags=<%= tag %>')
