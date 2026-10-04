import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Eye, EyeOff, AlertCircle, ArrowRight, Check } from 'lucide-react'
import { authApi } from '@/services/auth'

export function SignupPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockActive, setCapsLockActive] = useState(false)

  // Password criteria checklist
  const criteria = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  }

  const passedCriteriaCount = Object.values(criteria).filter(Boolean).length

  const getStrengthTier = () => {
    if (password.length === 0) return { label: '', color: 'bg-muted', textColor: 'text-muted-foreground' }
    if (passedCriteriaCount <= 1) return { label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500' }
    if (passedCriteriaCount === 2) return { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500' }
    if (passedCriteriaCount === 3) return { label: 'Good', color: 'bg-sky-500', textColor: 'text-sky-500' }
    return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' }
  }

  const strength = getStrengthTier()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      await authApi.register({ username, email, password })
      // Auto-login upon successful registration
      await authApi.login({ username, password })
      navigate('/', { replace: true })
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed')
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
          Create an account
        </h1>
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
              placeholder="e.g. aniket"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 bg-background/80 rounded-lg border-border/80 transition-all focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground/80">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="aniket@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 bg-background/80 rounded-lg border-border/80 transition-all focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-foreground/80">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Choose a strong password"
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

            {/* Registration Password Strength & Criteria */}
            {password.length > 0 && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">Password strength</span>
                  <span className={`font-medium ${strength.textColor}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1 w-full">
                  {[1, 2, 3, 4].map((tier) => (
                    <div
                      key={tier}
                      className={`rounded-full transition-all duration-300 ${
                        passedCriteriaCount >= tier ? strength.color : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${criteria.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                    {criteria.length ? <Check className="w-3 h-3 stroke-[2.5]" /> : <span className="w-3 text-center">·</span>}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${criteria.hasLetter ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                    {criteria.hasLetter ? <Check className="w-3 h-3 stroke-[2.5]" /> : <span className="w-3 text-center">·</span>}
                    <span>Letters (A-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${criteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                    {criteria.hasNumber ? <Check className="w-3 h-3 stroke-[2.5]" /> : <span className="w-3 text-center">·</span>}
                    <span>Numbers (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${criteria.hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                    {criteria.hasSpecial ? <Check className="w-3 h-3 stroke-[2.5]" /> : <span className="w-3 text-center">·</span>}
                    <span>Special symbol</span>
                  </div>
                </div>
              </div>
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
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>

        {/* Clean link to Login page */}
        <div className="mt-5 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:text-emerald-500 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
