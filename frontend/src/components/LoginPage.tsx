import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { authApi } from '@/services/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      await authApi.login({ username, password })
      navigate('/', { replace: true })
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6 select-none">
        <Link
          to="/"
          className="h-10 w-10 rounded-xl bg-foreground/5 dark:bg-foreground/10 border border-border/80 flex items-center justify-center mb-3 shadow-sm hover:scale-105 transition-transform"
        >
          <span className="font-bold text-lg tracking-tighter">
            k<span className="text-emerald-500">.</span>
          </span>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl p-6 sm:p-7 shadow-xl shadow-black/[0.03] dark:shadow-none transition-all">
        {errorMessage && (
          <div className="mb-4 p-3 text-xs rounded-lg border border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-medium text-foreground/80">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 bg-background/80 rounded-lg border-border/80 transition-all focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-foreground/80">
                Password
              </Label>
              <button
                type="button"
                tabIndex={-1}
                className="text-[11px] text-muted-foreground hover:text-emerald-500 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyDown}
                className="h-10 pr-10 bg-background/80 rounded-lg border-border/80 transition-all focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {capsLockActive && (
              <p className="text-[11px] text-amber-500 dark:text-amber-400 font-medium flex items-center gap-1.5 pt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Caps Lock is on
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-3 font-medium bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>

        {/* Clean link to Signup page */}
        <div className="mt-5 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline underline-offset-4 hover:text-emerald-500 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
