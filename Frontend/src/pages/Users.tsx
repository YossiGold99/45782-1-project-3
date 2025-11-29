import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUsers, followUser, unfollowUser, exportUsersCSV, exportUsersExcel, getFollowing } from '../services/api'
import { User, Pagination } from '../types'
import { useSocket } from '../hooks/useSocket'
import './Users.css'

const Users = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [followingMap, setFollowingMap] = useState<Record<number, boolean>>({})
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())
  const [showFollowers, setShowFollowers] = useState(false)

  const socket = useSocket()

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  useEffect(() => {
    if (socket) {
      socket.on('user-followed', (data: any) => {
        // Update following status in real-time
        if (data.followerId === currentUser?.id) {
          setFollowingMap(prev => ({ ...prev, [data.followingId]: true }))
        }
      })

      socket.on('user-unfollowed', (data: any) => {
        if (data.followerId === currentUser?.id) {
          setFollowingMap(prev => ({ ...prev, [data.followingId]: false }))
        }
      })

      return () => {
        socket.off('user-followed')
        socket.off('user-unfollowed')
      }
    }
  }, [socket, currentUser])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers(page, search)
      setUsers(data.users)
      setPagination(data.pagination)
      
      // Fetch following status for current user
      if (currentUser && !showFollowers) {
        const followingData = await getFollowing(currentUser.id, 1)
        const followingIds = followingData.following.reduce((acc: Record<number, boolean>, user: User) => {
          acc[user.id] = true
          return acc
        }, {})
        setFollowingMap(followingIds)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId: number) => {
    try {
      await followUser(userId)
      setFollowingMap(prev => ({ ...prev, [userId]: true }))
      if (socket) {
        socket.emit('user-followed', { followerId: currentUser?.id, followingId: userId })
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error following user')
    }
  }

  const handleUnfollow = async (userId: number) => {
    try {
      await unfollowUser(userId)
      setFollowingMap(prev => ({ ...prev, [userId]: false }))
      if (socket) {
        socket.emit('user-unfollowed', { followerId: currentUser?.id, followingId: userId })
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error unfollowing user')
    }
  }

  const handleExportCSV = () => {
    exportUsersCSV()
  }

  const handleExportExcel = () => {
    exportUsersExcel()
  }

  if (loading && users.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users</h1>
        {currentUser?.role === 'Admin' && (
          <div className="export-buttons">
            <button onClick={handleExportCSV} className="btn-secondary">
              Export CSV
            </button>
            <button onClick={handleExportExcel} className="btn-secondary">
              Export Excel
            </button>
          </div>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <button
          onClick={() => setShowFollowers(!showFollowers)}
          className="btn-secondary"
          style={{ marginLeft: '10px' }}
        >
          {showFollowers ? 'Show All Users' : 'Show My Followers'}
        </button>
      </div>

      <div className="users-table">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={users.length > 0 && users.every(u => selectedUsers.has(u.id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(new Set(users.map(u => u.id)))
                    } else {
                      setSelectedUsers(new Set())
                    }
                  }}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(user => {
                if (showFollowers) {
                  // Show only users that current user is following
                  return followingMap[user.id] === true
                }
                return true
              })
              .map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedUsers)
                        if (e.target.checked) {
                          newSelected.add(user.id)
                        } else {
                          newSelected.delete(user.id)
                        }
                        setSelectedUsers(newSelected)
                      }}
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.id !== currentUser?.id && (
                      followingMap[user.id] ? (
                        <button
                          onClick={() => handleUnfollow(user.id)}
                          className="btn-danger"
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollow(user.id)}
                          className="btn-success"
                        >
                          Follow
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedUsers.size > 0 && (
        <div className="selected-actions" style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          <strong>Selected: {selectedUsers.size} user(s)</strong>
          <button
            onClick={() => {
              selectedUsers.forEach(userId => {
                if (!followingMap[userId] && userId !== currentUser?.id) {
                  handleFollow(userId)
                }
              })
              setSelectedUsers(new Set())
            }}
            className="btn-success"
            style={{ marginLeft: '10px' }}
          >
            Follow Selected
          </button>
          <button
            onClick={() => {
              selectedUsers.forEach(userId => {
                if (followingMap[userId] && userId !== currentUser?.id) {
                  handleUnfollow(userId)
                }
              })
              setSelectedUsers(new Set())
            }}
            className="btn-danger"
            style={{ marginLeft: '10px' }}
          >
            Unfollow Selected
          </button>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Users
