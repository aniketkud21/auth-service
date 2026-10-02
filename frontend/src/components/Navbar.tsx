import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserMenu } from '@/components/UserMenu'
import { authApi, type UserResponse } from '@/services/auth'

export function Navbar() {
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null)

  const checkUser = async () => {
    const user = await authApi.getMe()
    setCurrentUser(user)
  }

  useEffect(() => {
    checkUser()
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Scope */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group cursor-pointer select-none py-1"
          >
            <span className="font-bold text-xl tracking-tight transition-opacity group-hover:opacity-85">
              kinto<span className="text-emerald-500">.</span>
            </span>
          </Link>
          <span className="text-border text-sm select-none font-light">/</span>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/80 border border-border/60 text-[11px] font-medium text-muted-foreground select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>production</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-3">
          {/* User Account / Profile Menu */}
          <UserMenu
            user={currentUser}
            onLogoutSuccess={() => {
              setCurrentUser(null)
              window.location.href = '/login'
            }}
          />
        </nav>
      </div>
    </header>
  )
}
