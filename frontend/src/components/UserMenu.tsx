import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, 
  LogOut, 
  LogIn,
  Sun, 
  Moon, 
  Copy, 
  Check
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { authApi, type UserResponse } from '@/services/auth'

interface UserMenuProps {
  user: UserResponse | null
  onLogoutSuccess?: () => void
}

export function UserMenu({ user, onLogoutSuccess }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleCopyUserId = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (user?.id) {
      navigator.clipboard.writeText(String(user.id))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLogout = async () => {
    setIsOpen(false)
    try {
      await authApi.logout()
    } catch {
      // Continue client cleanup anyway
    }
    if (onLogoutSuccess) {
      onLogoutSuccess()
    } else {
      navigate('/login', { replace: true })
    }
  }

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U'

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="User account menu"
        className="relative flex items-center justify-center h-9 w-9 rounded-full bg-secondary/80 hover:bg-secondary border border-border text-foreground transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
      >
        {user ? (
          <span className="font-semibold text-xs tracking-wide text-foreground">
            {initial}
          </span>
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl shadow-black/10 dark:shadow-black/40 py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
          {/* User Profile Summary Header */}
          <div className="px-3.5 py-3 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate leading-none">
                    {user?.username || 'Guest'}
                  </p>
                  {user?.is_admin && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {user?.email || (user ? 'Authenticated' : 'Not signed in')}
                </p>
              </div>
            </div>

            {/* Quick stats / User ID copy badge */}
            {user && (
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground bg-secondary/50 rounded-md px-2 py-1">
                <span>Account ID: #{user.id}</span>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
                  title="Copy User ID"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Theme Selector Segmented Control */}
          <div className="px-3.5 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
              <span>Appearance</span>
              <span className="text-[11px] capitalize font-mono text-foreground/80">{theme}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-secondary/80 border border-border/60">
              <button
                type="button"
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="border-t border-border/60 py-1">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-secondary/70 transition-colors cursor-pointer text-left"
              >
                <LogIn className="h-4 w-4" />
                <span>Log in</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
