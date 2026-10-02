import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { 
  Loader2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  User as UserIcon,
  Key,
  Activity,
  Edit2,
  Mail,
  UserCheck
} from 'lucide-react'
import { authApi, type UserResponse } from '@/services/auth'

import { PageHeader } from './PageHeader'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Edit form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchUser = async () => {
    if (!id) return
    setLoading(true)
    setErrorMessage(null)
    try {
      const data = await authApi.getUserById(id)
      setUser(data)
      setUsername(data.username)
      setEmail(data.email)
      setIsActive(data.is_active ?? true)
      setIsAdmin(data.is_admin ?? false)
    } catch (err: any) {
      if (err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(err.message || 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const updated = await authApi.updateUser(id, {
        username,
        email,
        is_active: isActive,
        is_admin: isAdmin,
      })
      setUser(updated)
      setSuccessMessage('User updated successfully')
      setTimeout(() => setSuccessMessage(null), 3500)
    } catch (err: any) {
      if (err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(err.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        <p className="text-sm">Loading user details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit User' : user ? user.username : 'User Details'}
        description={
          isEditing
            ? `Modify settings and permissions for ${user?.username}`
            : user
            ? `User Account Details & Security Overview`
            : 'User Resource'
        }
        breadcrumbs={[
          { label: 'Users', to: '/' },
          { label: user ? user.username : `User #${id}` },
        ]}
        actions={
          user && (
            <Button
              variant={isEditing ? 'outline' : 'default'}
              size="sm"
              onClick={() => {
                if (isEditing) {
                  // Cancel edits and restore original values
                  setUsername(user.username)
                  setEmail(user.email)
                  setIsActive(user.is_active ?? true)
                  setIsAdmin(user.is_admin ?? false)
                  setIsEditing(false)
                } else {
                  setIsEditing(true)
                }
              }}
              className="gap-2 text-xs"
            >
              {isEditing ? (
                'Exit Edit'
              ) : (
                <>
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit User
                </>
              )}
            </Button>
          )
        }
      />

      {errorMessage && (
        <div className="p-3 text-xs rounded-md border border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-xs rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card (Span 2) - Read-only Overview OR Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="border-b border-border/40 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm shrink-0">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {isEditing ? 'Modify Account Information' : 'User Information'}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {isEditing
                          ? 'Update core identity attributes and credentials'
                          : 'Core profile details and identity attributes'}
                      </CardDescription>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground self-start sm:self-auto">
                    ID #{user.id}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {!isEditing ? (
                  /* Read-Only Details View */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground block">Username</span>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-secondary/30 p-2.5 rounded-lg border border-border/40">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{user.username}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground block">Email Address</span>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground bg-secondary/30 p-2.5 rounded-lg border border-border/40">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <span className="text-xs font-medium text-foreground block">Assigned Permissions &amp; Status</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-lg border border-border/60 bg-secondary/20 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold block text-foreground">Sign-in Status</span>
                            <p className="text-[11px] text-muted-foreground">User login permissions</p>
                          </div>
                          {user.is_active !== false ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold bg-secondary px-2 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="p-3.5 rounded-lg border border-border/60 bg-secondary/20 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold block text-foreground">Account Role</span>
                            <p className="text-[11px] text-muted-foreground">Authorization tier</p>
                          </div>
                          {user.is_admin ? (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Shield className="h-3 w-3" />
                              Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold bg-secondary px-2 py-0.5 rounded">
                              <UserCheck className="h-3 w-3" />
                              Standard User
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Edit Form View */
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-username" className="text-xs font-medium">Username</Label>
                        <Input
                          id="edit-username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-email" className="text-xs font-medium">Email Address</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Status & Privileges */}
                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <span className="text-xs font-medium text-foreground block">Account Permissions</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 hover:bg-secondary/40 transition-colors cursor-pointer bg-card/50">
                          <div className="space-y-0.5 pr-2">
                            <span className="text-xs font-semibold block text-foreground">Active Status</span>
                            <p className="text-[11px] text-muted-foreground">Allows user to sign in and initiate sessions</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4 rounded border-border accent-emerald-500 cursor-pointer shrink-0"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 hover:bg-secondary/40 transition-colors cursor-pointer bg-card/50">
                          <div className="space-y-0.5 pr-2">
                            <span className="text-xs font-semibold block text-foreground">Administrator</span>
                            <p className="text-[11px] text-muted-foreground">Grants elevated access across all resources</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="h-4 w-4 rounded border-border accent-emerald-500 cursor-pointer shrink-0"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/40">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUsername(user.username)
                          setEmail(user.email)
                          setIsActive(user.is_active ?? true)
                          setIsAdmin(user.is_admin ?? false)
                          setIsEditing(false)
                        }}
                        disabled={saving}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={saving} className="gap-2 text-xs">
                        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Overview & Metadata Column (Span 1) */}
          <div className="space-y-6">
            {/* Account Summary Card */}
            <Card>
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-emerald-500" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-foreground font-semibold">#{user.id}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Role</span>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold">
                      <Shield className="h-3 w-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="rounded bg-secondary text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                      Standard User
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Status</span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      Inactive
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined
                  </span>
                  <span className="text-foreground">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights / Security Card */}
            <Card className="bg-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security &amp; Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background/50 border border-border/40">
                  <Key className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-medium block">Password Authentication</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Argon2id hashing algorithm enforced</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background/50 border border-border/40">
                  <Activity className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-medium block">Session Security</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">HttpOnly, SameSite=Lax signed cookies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
