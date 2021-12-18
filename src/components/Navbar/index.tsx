import { Collapse, Space } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Header } from 'antd/lib/layout/layout'
import { t } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { ThemeOption } from 'constants/theme/theme-option'

import Account from './Account'
import ThemePicker from './ThemePicker'

export default function Navbar() {
  const history = useHistory()
  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const navLinkStyleProps = {
    className: 'hover-opacity',
    style: {
      fontWeight: 600,
      color: colors.text.primary,
    },
  }

  const menuItem = (text: string, route: string, onClick?: VoidFunction) => {
    const external = route?.startsWith('http')
    if (external) {
      return (
        <a href={route} target="_blank" rel="noreferrer" {...navLinkStyleProps}>
          {text}
        </a>
      )
    } else {
      return (
        <Link to={route} {...navLinkStyleProps}>
          {text}
        </Link>
      )
    }
  }

  const menuItemWithOnClickHandler = (text: string, onClick: VoidFunction) => {
    return (
      <a onClick={onClick} {...navLinkStyleProps}>
        {text}
      </a>
    )
  }

  const logo = (height = 40) => (
    <img
      style={{ height }}
      src={
        forThemeOption &&
        forThemeOption({
          [ThemeOption.light]: '/assets/juice_logo-ol.png',
          [ThemeOption.dark]: '/assets/juice_logo-od.png',
        })
      }
      alt="Juicebox logo"
    />
  )

  const menu = () => {
    return (
      <>
        {menuItem(t`Projects`, '/projects')}
        {menuItemWithOnClickHandler(t`FAQ`, () => {
          history.push('/')
          setTimeout(() => {
            document
              .getElementById('faq')
              ?.scrollIntoView({ behavior: 'smooth' })
          }, 0)
        })}
        {menuItem(t`Docs`, 'https://docs.juicebox.money')}
        {menuItem(t`Blog`, 'https://blog.juicebox.money')}
        {menuItem('Discord', 'https://discord.gg/6jXrJSyDFf')}
        {menuItem(t`Workspace`, 'https://juicebox.notion.site')}
      </>
    )
  }

  return window.innerWidth > 900 ? (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: colors.background.l0,
      }}
    >
      <Space size="large" style={{ flex: 1 }}>
        <Link to="/" style={{ display: 'inline-block' }}>
          {logo()}
        </Link>
        {menu()}
      </Space>
      <Space size="middle">
        <ThemePicker />
        <div className="hide-mobile">
          <Account />
        </div>
      </Space>
    </Header>
  ) : (
    <Header
      style={{
        background: colors.background.l0,
        zIndex: 100,
        padding: 8,
      }}
      onClick={e => {
        setActiveKey(undefined)
        e.stopPropagation()
      }}
    >
      <Collapse style={{ border: 'none' }} activeKey={activeKey}>
        <CollapsePanel
          style={{ border: 'none' }}
          key={0}
          showArrow={false}
          header={
            <Space
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              {logo(30)}
              <MenuOutlined style={{ color: colors.icon.primary }} />
            </Space>
          }
          extra={<ThemePicker />}
        >
          <Space direction="vertical" size="middle">
            {menu()}
            <Account />
          </Space>
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
