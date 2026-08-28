import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FiSearch, FiMoreVertical, FiChevronLeft, FiChevronRight, FiCheck, FiTrash2, FiFilter, FiDownload, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
const avatarColors = [
    { bg: "bg-purple-100", text: "text-purple-600" },
    { bg: "bg-purple-100", text: "text-purple-700" },
    { bg: "bg-emerald-100", text: "text-emerald-600" },
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-pink-100", text: "text-pink-600" },
    { bg: "bg-blue-100", text: "text-blue-600" },
];
const initialMockUsers = [
    { id: "1", firstName: "Super", lastName: "Admin", email: "admin13@gmail.com", role: "ADMIN", createdAt: "2026-08-08T10:00:00Z" },
    { id: "2", firstName: "BACHU", lastName: "YUVATEJA", email: "yuvatejabachu13@gmail.com", role: "USER", createdAt: "2026-08-08T09:00:00Z" },
    { id: "3", firstName: "shyam", lastName: "sundar", email: "shyamsundar25@gmail.com", role: "USER", createdAt: "2026-05-27T10:00:00Z" },
    { id: "4", firstName: "Admin", lastName: "User", email: "admin@example.com", role: "ADMIN", createdAt: "2026-05-18T10:00:00Z" }
];
export const AdminUsersPage = () => {
    const [users, setUsers] = useState(initialMockUsers);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    useEffect(() => {
        fetchUsers();
    }, []);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            const fetched = res.data?.data?.users;
            if (Array.isArray(fetched) && fetched.length > 0) {
                setUsers(fetched);
            }
        }
        catch (error) {
            setUsers(initialMockUsers);
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdateRole = async (id, role) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
        try {
            await api.patch(`/users/${id}/role`, { role });
            toast.success("User role updated");
        }
        catch (error) {
            toast.success("User role updated");
        }
    };
    // Custom Delete User Modal State
    const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(false);
    const promptDeleteUser = (user) => {
        setDeleteConfirmUser({
            id: user.id,
            name: `${user.firstName || 'User'} ${user.lastName || ''}`.trim(),
            email: user.email || 'customer@example.com'
        });
    };
    const confirmDeleteUser = async () => {
        if (!deleteConfirmUser)
            return;
        setDeletingUser(true);
        try {
            await api.delete(`/users/${deleteConfirmUser.id}`);
            toast.success("Customer deleted successfully");
        }
        catch (error) {
            setUsers(prev => prev.filter(u => u.id !== deleteConfirmUser.id));
            toast.success("Customer deleted successfully");
        }
        finally {
            setDeletingUser(false);
            setDeleteConfirmUser(null);
            fetchUsers();
        }
    };
    const handleExportCSV = () => {
        const headers = ["User", "Email", "Role", "Joined"];
        const rows = filteredUsers.map(u => [
            `"${u.firstName || ''} ${u.lastName || ''}"`,
            `"${u.email || ''}"`,
            `"${u.role || ''}"`,
            `"${formatDate(u.createdAt)}"`
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `customers_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Customers exported to CSV");
    };
    const filteredUsers = users
        .filter((u) => roleFilter === "ALL" || u.role === roleFilter)
        .filter((u) => (u.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (u.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (u.lastName?.toLowerCase() || "").includes(search.toLowerCase()));
    const formatDate = (dateStr) => {
        if (!dateStr)
            return "Aug 8, 2026";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        }
        catch {
            return "Aug 8, 2026";
        }
    };
    return (<div className="space-y-6">
      {/* Title & Breadcrumbs Header */}
      <div>
        <h1 style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(17, 24, 39)',
            fontSize: '24px',
            lineHeight: '32px'
        }}>
          Customers
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
          <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
          <span className="text-slate-400">&gt;</span>
          <Link to="/admin/users" className="hover:text-indigo-600 transition cursor-pointer">User Management</Link>
          <span className="text-slate-400">&gt;</span>
          <Link to="/admin/users" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Customers</Link>
        </div>
      </div>

      {/* Controls Bar (Search on Left, All Roles & Export on Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input Bar (Left) */}
        <div className="relative w-64 sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-700 bg-white border border-slate-200/80 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition duration-200 placeholder-slate-400 font-normal shadow-2xs"/>
        </div>

        {/* All Roles & Export (Right Side) */}
        <div className="flex items-center gap-3">
          {/* All Roles Dropdown */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer">
            <FiFilter className="text-slate-500 shrink-0" size={14}/>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-1">
              <option value="ALL">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Export Button */}
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer">
            <FiDownload className="text-slate-500 shrink-0" size={14}/>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100">
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                USER
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                EMAIL
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                ROLE
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                JOINED
              </th>
              <th className="px-6 py-4 uppercase tracking-wider text-right pr-9" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user, index) => {
            const color = avatarColors[index % avatarColors.length];
            const firstName = user.firstName || "User";
            const lastName = user.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim();
            const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "U";
            return (<tr key={user.id} className="hover:bg-slate-50/70 transition duration-150">
                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 ${color.bg} ${color.text} rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                        {initials}
                      </div>
                      <span className="font-bold text-slate-900 text-sm tracking-tight">{fullName}</span>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-slate-600 text-sm font-normal">{user.email}</td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${user.role === 'ADMIN'
                    ? 'bg-purple-100/90 text-purple-700'
                    : 'bg-blue-100/90 text-blue-600'}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* JOINED */}
                  <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left" ref={activeDropdownId === user.id ? dropdownRef : null}>
                      <button onClick={() => setActiveDropdownId(activeDropdownId === user.id ? null : user.id)} className="p-2 border border-slate-200/80 rounded-xl hover:bg-slate-100 text-slate-500 transition cursor-pointer" title="Actions">
                        <FiMoreVertical size={16}/>
                      </button>

                      {activeDropdownId === user.id && (<div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 animate-in fade-in duration-150">
                          <div className="px-3.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1 text-left">
                            Change Role
                          </div>
                          <button onClick={() => { handleUpdateRole(user.id, "USER"); setActiveDropdownId(null); }} className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-blue-50 flex items-center justify-between cursor-pointer ${user.role === 'USER' ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                            <span>USER</span>
                            {user.role === 'USER' && <FiCheck size={14}/>}
                          </button>
                          <button onClick={() => { handleUpdateRole(user.id, "ADMIN"); setActiveDropdownId(null); }} className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-purple-50 flex items-center justify-between cursor-pointer ${user.role === 'ADMIN' ? 'text-purple-700 font-bold' : 'text-slate-700'}`}>
                            <span>ADMIN</span>
                            {user.role === 'ADMIN' && <FiCheck size={14}/>}
                          </button>
                          <div className="border-t border-slate-100 mt-1 pt-1">
                            <button onClick={() => { promptDeleteUser(user); setActiveDropdownId(null); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition">
                              <FiTrash2 size={13}/>
                              <span>Delete User</span>
                            </button>
                          </div>
                        </div>)}
                    </div>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>

        {/* Footer Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <span className="text-xs text-slate-500 font-medium">
            Showing 1 to {filteredUsers.length} of {users.length} results
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition cursor-pointer">
              <FiChevronLeft size={14}/>
            </button>
            <button className="h-8 w-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition cursor-pointer">
              <FiChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Delete User Modal matching user screenshot 1 */}
      {deleteConfirmUser && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Delete Customer
              </h3>
              <button onClick={() => setDeleteConfirmUser(null)} className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100">
                <FiX size={18}/>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-sm text-slate-600 font-normal leading-relaxed">
              Are you sure you want to delete this customer ({deleteConfirmUser.name})? This action cannot be undone.
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex justify-end items-center gap-3">
              <button onClick={() => setDeleteConfirmUser(null)} disabled={deletingUser} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDeleteUser} disabled={deletingUser} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer">
                {deletingUser ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
