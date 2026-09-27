import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { UsersPage } from './components/UsersPage'
import { AuthCard } from './components/AuthCard'

type Page = 'users' | 'auth'

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('users')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="flex-1 container max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {currentPage === 'users' && (
          <UsersPage onAddUserClick={() => setCurrentPage('auth')} />
        )}

        {currentPage === 'auth' && (
          <div className="flex flex-col items-center justify-center py-6 sm:py-12">
            <div className="w-full max-w-sm space-y-4">
              <button
                onClick={() => setCurrentPage('users')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
              >
                ← Back to Users
              </button>
              <AuthCard />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        AuthGuard &copy; {new Date().getFullYear()} &bull; User Directory & Auth Service
      </footer>
    </div>
  )
}

export default App
