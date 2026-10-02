import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { UsersPage } from './components/UsersPage'
import { AddUserPage } from './components/AddUserPage'
import { UserDetailPage } from './components/UserDetailPage'
import { AuthCard } from './components/AuthCard'
import { ThemeProvider } from './context/ThemeContext'

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-150">
        <Navbar />

      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/users/new" element={<AddUserPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route
            path="/login"
            element={
              <div className="flex flex-col items-center justify-center py-6 sm:py-12">
                <div className="w-full max-w-sm">
                  <AuthCard />
                </div>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        kinto &copy; {new Date().getFullYear()} &bull; Modern Auth &amp; Session Infrastructure
      </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
