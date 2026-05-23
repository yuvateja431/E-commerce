import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiUserCheck, FiUserX, FiSearch, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data?.data?.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter((u: any) => 
    (u.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.lastName?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative w-96">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search users by name or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                      {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                    </div>
                    <span className="font-bold text-gray-900">{user.firstName || 'Unknown'} {user.lastName || 'User'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <select 
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded p-1 outline-none"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
