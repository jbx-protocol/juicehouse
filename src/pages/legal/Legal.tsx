import { Trans } from '@lingui/macro'
import { Divider } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'

export default function Legal() {
  return (
    <>
      <div className="my-0 mx-auto max-w-5xl p-10">
        <h1 className="m-0 my-4 font-display text-4xl">
          <Trans>Legal Resources</Trans>
        </h1>
        <p>
          <Trans>
            <Link href="/@juicebox">JuiceboxDAO</Link> and juicebox.money cannot
            provide legal services or advice to project creators – when using
            the protocol, compliance is your responsibility.
          </Trans>
        </p>
        <p>
          <Trans>
            If you need help assessing your project's needs, finding a legal
            expert, or legally incorporating your project, start with the
            resources below:
          </Trans>
        </p>

        <h2 className="mt-6 mb-4 font-display text-2xl">
          <Trans>Recommended Reading</Trans>
        </h2>
        <p>
          <Trans>
            Use these resources to familiarize yourself with the legal concerns
            facing web3 projects and some common solutions.
          </Trans>
        </p>
        <ul className="list-disc">
          <li>
            <Trans>
              Projects based in the United States can begin reasoning through
              their project's legal concerns with the{' '}
              <ExternalLink href="https://docs.google.com/document/d/1AfPJAj7qfCY88Ke7wHmsT_AFF0LyU8am9fM3j_fCur8/">
                Crypto Legal Risk Checklist
              </ExternalLink>
              . When you reach out to a legal expert, you can send them this
              document to help them understand the nature of your project.
            </Trans>
          </li>
          <li>
            <Trans>
              To learn about the trade-offs between different legal entities for
              DAOs and other projects, review Paradigm's{' '}
              <ExternalLink href="https://daos.paradigm.xyz/">
                DAO Legal Entity Matrix
              </ExternalLink>
              .
            </Trans>
          </li>
          <li>
            <Trans>
              Alternatively, a16z's{' '}
              <ExternalLink href="https://a16z.com/tag/legal-frameworks-for-daos-series/">
                Legal Frameworks for DAOs series
              </ExternalLink>{' '}
              provides a pragmatic overview of legal entity selection for DAOs
              within the United States.
            </Trans>
          </li>
          <li>
            <Trans>
              The{' '}
              <ExternalLink href="https://0x.org/docs/developer-resources/0x-legal-guide">
                0x Legal Guide
              </ExternalLink>{' '}
              provides an overview of securities and commodities regulations as
              they pertain to cryptocurrency within the United States.
            </Trans>
          </li>
        </ul>

        <h2 className="mt-6 mb-4 text-2xl">
          <Trans>Legal Experts</Trans>
        </h2>
        <p>
          <Trans>
            Once you have a general understanding of your project's legal needs,
            you are <strong>strongly encouraged</strong> to reach out to a legal
            expert for help addressing them.
          </Trans>
        </p>
        <ul className="list-disc">
          <li>
            <Trans>
              <ExternalLink href="https://openesq.tech/">
                Open Esquire
              </ExternalLink>{' '}
              is a group of legal engineers helping Ethereum (and Juicebox)
              projects incorporate and maintain compliance within the United
              States.
            </Trans>
          </li>
          <li>
            <Trans>
              If you're looking to find another lawyer, join{' '}
              <ExternalLink href="https://www.lexdao.coop/">
                LexDAO
              </ExternalLink>
              's{' '}
              <ExternalLink href="https://discord.gg/gQDMhvDVWS">
                Discord server
              </ExternalLink>{' '}
              and inquire in the <code>find-a-lawyer</code> channel. LexDAO also
              provides helpful legal templates on{' '}
              <ExternalLink href="https://github.com/lexDAO">
                GitHub
              </ExternalLink>
              .
            </Trans>
          </li>
        </ul>

        <h2 className="mt-6 mb-4 font-display text-2xl">
          <Trans>Legal Services</Trans>
        </h2>
        <p>
          <Trans>
            You can use these services to form legal entities for yourself or
            your project.
          </Trans>
        </p>
        <ul className="list-disc">
          <li>
            <Trans>
              To quickly form a legal entity within the United States, you can
              use{' '}
              <ExternalLink href="https://www.doola.com/">Doola</ExternalLink>.
              To form an entity in another jurisdiction, you can use{' '}
              <ExternalLink href="https://otonomos.com/">Otonomos</ExternalLink>
              . Alternatively, you can register for incorporation with the
              corresponding government directly.
            </Trans>
          </li>
          <li>
            <Trans>
              You can form an onchain LLC, non-profit, or charter entity by
              using{' '}
              <ExternalLink href="https://www.wrappr.wtf">
                wrappr.wtf
              </ExternalLink>
              . Wrappr lets you mint NFTs which serve as limited liability
              "legal wrappers" for DAOs, wallets, or projects. This public good
              service is provided free-of-charge – you only have to pay for gas.
            </Trans>
          </li>
          <li>
            <Trans>
              If you're looking to adopt a robust legal entity for your DAO,{' '}
              <ExternalLink href="https://www.midao.org/">MIDAO</ExternalLink>{' '}
              can help your project incorporate as a for-profit or non-profit
              Marshall Islands DAO LLC.
            </Trans>
          </li>
          <li>
            <Trans>
              <ExternalLink href="https://opolis.co/">Opolis</ExternalLink>{' '}
              helps individuals within the United States set up single-member
              companies to manage payroll, benefits, and taxes. This can be a
              great option for independent DAO contributors.
            </Trans>
          </li>
        </ul>

        <h2 className="mt-6 mb-4 font-display text-2xl">
          <Trans>Templates</Trans>
        </h2>
        <p>
          <Trans>
            Templates can be a helpful starting point when working with a legal
            expert – be sure to review any documents with a lawyer before using
            them.
          </Trans>
        </p>
        <ul className="list-disc">
          <li>
            <Trans>
              <ExternalLink href="https://www.openlaw.io/">
                OpenLaw
              </ExternalLink>{' '}
              is a framework for legal contracts which can interact with smart
              contracts. Visit their{' '}
              <ExternalLink href="https://lib.openlaw.io/">
                library
              </ExternalLink>{' '}
              for a large collection of open-source legal documents for web3
              projects.
            </Trans>
          </li>
          <li>
            <Trans>
              The{' '}
              <ExternalLink href="https://www.lexpunk.army/">
                LexPunk Army
              </ExternalLink>{' '}
              community provides free templates and resources for on{' '}
              <ExternalLink href="https://github.com/LeXpunK-Army">
                GitHub
              </ExternalLink>{' '}
              and on their{' '}
              <ExternalLink href="https://forum.lexpunk.army/">
                forum
              </ExternalLink>
              .
            </Trans>
          </li>
          <li>
            <Trans>
              For common legal documents, you may have success using AI chatbots
              to create preliminary drafts which you can then improve with a
              lawyer's help.{' '}
              <ExternalLink href="https://www.nani.ooo/">nani.ooo</ExternalLink>{' '}
              is an Ethereum-specific AI wallet assistant worth experimenting
              with. Popular LLMs like{' '}
              <ExternalLink href="https://chat.openai.com/">
                ChatGPT
              </ExternalLink>{' '}
              and{' '}
              <ExternalLink href="https://bard.google.com/">Bard</ExternalLink>{' '}
              can be surprisingly effective. As always, don't use any documents
              until you have reviewed them with a legal expert.
            </Trans>
          </li>
        </ul>

        <p>
          <Trans>
            If you're looking for further resources or have questions, send us a
            message in the{' '}
            <ExternalLink href="https://discord.gg/juicebox">
              JuiceboxDAO Discord server
            </ExternalLink>{' '}
            or on the <Link href="/contact">Contact page</Link>.
          </Trans>
        </p>

        <Divider />

        <p className="grey-500 dark:grey-300 text-sm">
          <em>
            <Trans>
              None of the information, services, or materials offered on
              juicebox.money (the "Site") constitute, or are intended to
              constitute, legal, financial, tax, investment, or other advice,
              and you should not act or refrain from acting based on any
              information, services, or materials provided on the Site. All
              content on our Site is information of a general nature and does
              not address the unique circumstances of any particular user. You
              are strongly urged to consult with your own legal, financial, tax,
              investment, and other advisors regarding all legal, financial,
              tax, and investment-related questions or concerns you have.
            </Trans>
          </em>
        </p>
        <p>
          <em>
            <Trans>
              For further information, see our{' '}
              <ExternalLink href="https://docs.juicebox.money/tos">
                Terms of Service
              </ExternalLink>
              .
            </Trans>
          </em>
        </p>
      </div>
    </>
  )
}
