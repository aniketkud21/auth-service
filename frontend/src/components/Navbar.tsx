import { Shield, UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  currentPage: 'users' | 'auth'
  onNavigate: (page: 'users' | 'auth') => void
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-5xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand */}
        <button
          onClick={() => onNavigate('users')}
          className="flex items-center space-x-2.5 group cursor-pointer"
        >
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">AuthGuard</span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          <Button
            variant={currentPage === 'users' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onNavigate('users')}
            className="gap-1.5"
          >
            <Users className="h-4 w-4" />
            Users
          </Button>

          <Button
            variant={currentPage === 'auth' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onNavigate('auth')}
            className="gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            Sign In / Register
          </Button>
        </nav>
      </div>
    </header>
  )
}
