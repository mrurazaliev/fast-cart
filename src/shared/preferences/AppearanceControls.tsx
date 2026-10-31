import { Moon, Sun } from 'lucide-react'
import i18n, { isLanguage } from '@/shared/i18n/i18n'
import { useText } from '@/shared/i18n/useText'
import { useTheme } from './themeContext'
import { Button } from '@/components/ui/button'

const AppearanceControls = ({ className = '' }: { className?: string }) => {
  const { t } = useText()
  const { theme, toggleTheme } = useTheme()
  const label =
    theme === 'dark' ? t('Switch to light mode') : t('Switch to dark mode')
  return (
    <div className={`flex shrink-0 items-center gap-1 ${className}`}>
      <select
        aria-label={t('Language')}
        value={i18n.resolvedLanguage || 'en'}
        onChange={(event) => {
          if (isLanguage(event.target.value))
            void i18n.changeLanguage(event.target.value)
        }}
        className="h-9 w-[64px] rounded-sm border bg-background px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <option value="en" lang="en">
          EN
        </option>
        <option value="ru" lang="ru">
          RU
        </option>
        <option value="tg" lang="tg">
          TJ
        </option>
      </select>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        title={label}
        aria-pressed={theme === 'dark'}
        onClick={toggleTheme}
        className="size-9 rounded-sm bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
      >
        {theme === 'dark' ? (
          <Sun aria-hidden="true" />
        ) : (
          <Moon aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}

export default AppearanceControls
