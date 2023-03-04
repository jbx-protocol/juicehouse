import { juiceTheme } from 'constants/theme'
import { ThemeOption } from 'constants/theme/themeOption'
import type { ThemeContextType } from 'contexts/Theme/ThemeContext'
import { useEffect, useLayoutEffect, useState } from 'react'

const userPrefersDarkMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
}

const getInitialThemeOption = (storageKey: string) => {
  const storedThemeOption = localStorage?.getItem(storageKey)
  if (storedThemeOption) {
    return storedThemeOption as ThemeOption
  }

  return userPrefersDarkMode() ? ThemeOption.dark : ThemeOption.light
}

export function useJuiceTheme(storageKey = 'jb_theme'): ThemeContextType {
  const initialThemeOption = getInitialThemeOption(storageKey)
  const [currentThemeOption, setCurrentThemeOption] =
    useState<ThemeOption>(initialThemeOption)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    initialThemeOption === ThemeOption.dark,
  )

  // Set the theme on the body element
  // This is needed for tailwind css dark theme classes to work
  useLayoutEffect(() => {
    if (currentThemeOption === ThemeOption.dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [currentThemeOption])

  useEffect(() => {
    setIsDarkMode(currentThemeOption === ThemeOption.dark)
    document.documentElement.style.setProperty(
      'color-scheme',
      currentThemeOption,
    )
  }, [currentThemeOption])

  return {
    themeOption: currentThemeOption,
    theme: juiceTheme(currentThemeOption),
    isDarkMode,
    forThemeOption: map => map[currentThemeOption],
    setThemeOption: (themeOption: ThemeOption) => {
      setCurrentThemeOption(themeOption)
      localStorage?.setItem(storageKey, themeOption)
    },
  }
}
