import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { authApi } from '@/services/auth'

import { PageHeader } from './PageHeader'

export function AddUserPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      await authApi.createUser({ username, email, password })
      setSuccessMessage('User created successfully')
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (err: any) {
      if (err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add User"
        description="Create and provision a new user account."
        breadcrumbs={[
          { label: 'Users', to: '/' },
          { label: 'New User' },
        ]}
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader className="space-y-1 border-b border-border/40 pb-5">
            <CardTitle className="text-lg">Account Information</CardTitle>
            <CardDescription>
              Enter the credentials and details for the new user.
            </CardDescription>
          </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs rounded-md border border-destructive/40 bg-destructive/10 text-destructive">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3 text-xs rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
