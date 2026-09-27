import { useEffect, useState } from 'react'
import { Users as UsersIcon, RefreshCw, Shield, UserCheck, AlertCircle, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authApi, type UserResponse } from '@/services/auth'

interface UsersPageProps {
  onAddUserClick: () => void
}

export function UsersPage({ onAddUserClick }: UsersPageProps) {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await authApi.getUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-2">
            <UsersIcon className="h-3.5 w-3.5" />
            User Directory
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Registered Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and inspect all accounts stored in the PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={onAddUserClick}>
            + Register New
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchUsers}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-5 w-24 bg-muted rounded" />
                <div className="h-4 w-36 bg-muted/60 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-3 w-28 bg-muted/40 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && users.length === 0 && (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">No users found</CardTitle>
              <CardDescription>
                Create your first user to populate the database directory.
              </CardDescription>
            </div>
            <Button size="sm" onClick={onAddUserClick}>
              Create User
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Users Grid */}
      {!loading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:border-primary/40 transition-colors">
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold leading-tight">
                        {user.username}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        ID: #{user.id}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-secondary text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                        <UserCheck className="h-3 w-3" />
                        User
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2.5 text-xs text-muted-foreground">
                <div className="truncate">
                  <span className="text-foreground/70 font-medium">Email: </span>
                  <span className="text-foreground/90">{user.email}</span>
                </div>

                {user.created_at && (
                  <div className="flex items-center gap-1.5 text-muted-foreground/80 pt-1 border-t border-border/40 text-[11px]">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
