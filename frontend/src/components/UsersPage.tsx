import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Users as UsersIcon, Shield, UserCheck, AlertCircle } from 'lucide-react'
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authApi, type UserResponse } from '@/services/auth'

import { PageHeader } from './PageHeader'

export function UsersPage() {
  const navigate = useNavigate()
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
      if (err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Browse and manage all registered user accounts."
        actions={
          <Button asChild size="sm">
            <Link to="/users/new">+ Add User</Link>
          </Button>
        }
      />

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
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-full bg-secondary/60 rounded-md animate-pulse" />
            ))}
          </div>
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
            <Button asChild size="sm">
              <Link to="/users/new">+ Add User</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Users DataTable */}
      {!loading && !error && users.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 border-b border-border/60 text-xs text-muted-foreground uppercase font-mono tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-4 font-semibold">User</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Email</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Role</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                  >
                    {/* User identifier */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                            {user.username}
                          </span>
                          <span className="block text-[11px] text-muted-foreground font-mono">
                            ID #{user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
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
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {user.is_active !== false ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-secondary/20 border-t border-border/40 text-xs text-muted-foreground">
            <span>Showing {users.length} registered user{users.length === 1 ? '' : 's'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
