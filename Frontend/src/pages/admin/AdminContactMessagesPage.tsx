import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../../services/cmsService";
import type { ContactMessage } from "../../types/cms";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiMessageSquare,
  FiLoader,
  FiX,
  FiCheck,
  FiClock,
  FiMail,
} from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminContactMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Contact Messages | Admin Panel";
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages(statusFilter || undefined);
      setMessages(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch contact messages");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "New" | "Read" | "Replied" | "Closed"
  ) => {
    try {
      await updateContactMessageStatus(id, status);
      toast.success(`Message status updated to ${status}.`);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      fetchMessages();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMessageId) return;
    try {
      setDeleting(true);
      await deleteContactMessage(deleteMessageId);
      toast.success("Contact message deleted.");
      if (selectedMessage && selectedMessage.id === deleteMessageId) {
        setSelectedMessage(null);
      }
      setDeleteMessageId(null);
      fetchMessages();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === "New") {
      handleUpdateStatus(msg.id, "Read");
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Read":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Replied":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Closed":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'rgb(17, 24, 39)',
              fontSize: '24px',
              lineHeight: '32px'
            }}
          >
            Contact Messages
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/contact-messages" className="hover:text-indigo-600 transition cursor-pointer">Content Management</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/contact-messages" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Contact Messages</Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, subject..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-800"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FiLoader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-xs font-semibold">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FiMessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No contact messages found</p>
            <p className="text-xs text-slate-500">Submissions from the storefront /contact-us page will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Message Preview</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{msg.fullName}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{msg.email}</p>
                      {msg.phone && <p className="text-[10px] text-slate-400">{msg.phone}</p>}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 max-w-xs truncate">
                      {msg.subject}
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                      {msg.message}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(msg.status)}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewMessage(msg)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                        <select
                          value={msg.status}
                          onChange={(e) => handleUpdateStatus(msg.id, e.target.value as any)}
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700"
                        >
                          <option value="New">New</option>
                          <option value="Read">Read</option>
                          <option value="Replied">Replied</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button
                          onClick={() => setDeleteMessageId(msg.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 transition"
                          title="Delete Message"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FiMessageSquare className="text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">Message Details</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedMessage.fullName}</p>
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 font-semibold hover:underline flex items-center gap-1.5 mt-0.5">
                      <FiMail size={12} />
                      <span>{selectedMessage.email}</span>
                    </a>
                    {selectedMessage.phone && <p className="text-slate-500 text-[11px] mt-0.5">Phone: {selectedMessage.phone}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm font-extrabold text-slate-900">{selectedMessage.subject}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Message Body</p>
                <div className="p-4 bg-slate-50 rounded-xl text-slate-800 leading-relaxed border border-slate-100 whitespace-pre-line">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <FiClock size={13} />
                  Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, "Replied")}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-lg transition flex items-center gap-1"
                  >
                    <FiCheck size={12} />
                    <span>Mark Replied</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, "Closed")}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold rounded-lg transition"
                  >
                    Close Thread
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteMessageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <FiTrash2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Message</h3>
              <p className="text-xs text-slate-500 mt-1">Are you sure you want to delete this contact message? This action cannot be undone.</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteMessageId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? <FiLoader className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
