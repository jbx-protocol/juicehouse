import { Menu } from 'antd'
import QuickProjectSearch from 'components/QuickProjectSearch'
import useMobile from 'hooks/Mobile'
import { CSSProperties, useEffect, useState } from 'react'
import MobileNavigation from './Mobile/MobileNavigation'
import NavLanguageSelector from './components/NavLanguageSelector'
import ThemePicker from './components/ThemePicker'
import { TransactionsList } from './components/TransactionList'
import WalletButton from './components/Wallet/WalletButton'
import {
  DropdownKey,
  desktopMenuItems,
  exploreMenuItems,
  resourcesMenuItems,
} from './navigationItems'

export default function SiteNavigation() {
  const [dropdownOpen, setDropdownOpen] = useState<DropdownKey>(false)

  const isMobile = useMobile()
  const dropdownIconStyle: CSSProperties = {
    fontSize: 13,
    marginLeft: 7,
  }

  // Close resources dropdown when clicking anywhere in the window except the dropdown items
  useEffect(() => {
    function handleClick() {
      setDropdownOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const menuItems = desktopMenuItems({
    resourcesMenuProps: { items: resourcesMenuItems() },
    exploreMenuProps: { items: exploreMenuItems() },
    dropdownOpen,
    setDropdownOpen,
    dropdownIconStyle,
  })

  if (isMobile) return <MobileNavigation />

  /* top-nav is antd override */
  return (
    <nav className="top-nav z-[1] flex h-16 items-center justify-between bg-smoke-25 py-11 leading-[64px] dark:bg-slate-800 md:px-4 xl:px-12">
      <Menu className="flex flex-row" items={menuItems} mode="inline" />

      <div className="flex items-center gap-6">
        <NavLanguageSelector />

        <ThemePicker />

        <TransactionsList listClassName="absolute top-[70px] right-[30px]" />

        <WalletButton />

        <QuickProjectSearch className="md:hidden xl:inline" />
      </div>
    </nav>
  )
}
