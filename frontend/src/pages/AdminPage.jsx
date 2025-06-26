import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser?.is_admin) {
      navigate("/notes");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        if (error.message.includes("401") || error.message.includes("403")) {
          navigate("/notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate, currentUser]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Admin Dashboard
              </h1>
              <p className="text-base-content/70 mt-1">
                Manage users and system overview
              </p>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-primary">{users.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error loading users: {error}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title text-2xl">User Management</h2>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  No users found
                </h3>
                <p className="text-base-content/70">
                  No users are currently registered in the system.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          ID
                        </div>
                      </th>
                      <th className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-secondary rounded-full"></span>
                          Name
                        </div>
                      </th>
                      <th className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-accent rounded-full"></span>
                          Email
                        </div>
                      </th>
                      <th className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-info rounded-full"></span>
                          Join Date
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover">
                        <td>
                          <span className="font-mono text-sm font-semibold">
                            {user.id}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            {user.is_admin && (
                              <div className="badge badge-secondary badge-xs mt-1">
                                Admin
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="font-medium">{user.email}</span>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatDate(user.created_at)}
                            </span>
                            <span className="text-xs text-base-content/70">
                              {new Date(user.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Users</h3>
                  <p className="text-2xl font-bold text-primary">
                    {users.filter((user) => !user.is_admin).length}
                  </p>
                </div>
                <div className="text-4xl opacity-20"></div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Administrators</h3>
                  <p className="text-2xl font-bold text-secondary">
                    {users.filter((user) => user.is_admin).length}
                  </p>
                </div>
                <div className="text-4xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
