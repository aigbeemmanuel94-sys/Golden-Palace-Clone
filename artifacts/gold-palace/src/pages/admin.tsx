import React, { useState, useEffect } from "react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type Stats = { totalUsers: number; totalOrders: number; totalRevenue: string; totalActivities: number; newsletterSubscribers: number };
type AdminUser = { id: number; email: string; firstName: string; lastName: string; isAdmin: boolean; createdAt: string };
type Order = { id: number; userId: number | null; userEmail: string | null; userName: string | null; status: string; items: unknown; subtotal: string; shippingCost: string; total: string; shippingAddress: unknown; paymentMethod: string | null; transactionId: string | null; createdAt: string };
type ActivityLog = { id: number; userId: number | null; userEmail: string | null; userName: string | null; action: string; metadata: unknown; ipAddress: string | null; userAgent: string | null; createdAt: string };
type Newsletter = { id: number; email: string; createdAt: string };

const fetcher = async (path: string) => {
  const res = await fetch(`/api${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "Invalid email or password.");
        return;
      }
      if (!data.isAdmin) {
        setError("This account does not have admin privileges.");
        return;
      }
      onSuccess();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-[#C9A84C] mb-2">Gold Palace</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">Admin Portal</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5 shadow-2xl"
        >
          <h2 className="text-white font-semibold text-lg mb-1">Sign in to your admin account</h2>

          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email address</label>
            <input
              type="email"
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>

          <p className="text-center text-xs text-gray-600 pt-1">
            <a href="/" className="text-[#C9A84C] hover:underline">← Back to store</a>
          </p>
        </form>
      </div>
    </div>
  );
}

const Badge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    login: "bg-blue-100 text-blue-800",
    logout: "bg-gray-100 text-gray-700",
    signup: "bg-green-100 text-green-800",
    failed_login: "bg-red-100 text-red-800",
    add_to_cart: "bg-yellow-100 text-yellow-800",
    remove_from_cart: "bg-orange-100 text-orange-800",
    checkout: "bg-purple-100 text-purple-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

const fmt = (n: string | number) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export function AdminPage() {
  const [tab, setTab] = useState<"overview" | "users" | "orders" | "activity" | "newsletter">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [newsletter, setNewsletter] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");

  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const notAuthenticated = !meLoading && !me;
  const notAdmin = !meLoading && me && !(me as { isAdmin?: boolean }).isAdmin;

  const handleLoginSuccess = () => {
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  useEffect(() => {
    if (!me || !(me as { isAdmin?: boolean }).isAdmin) return;
    const load = async () => {
      setLoading(true);
      try {
        const [s, u, o, a, n] = await Promise.all([
          fetcher("/admin/stats"),
          fetcher("/admin/users"),
          fetcher("/admin/orders"),
          fetcher("/admin/activity"),
          fetcher("/admin/newsletter"),
        ]);
        setStats(s);
        setUsers(u);
        setOrders(o);
        setActivity(a);
        setNewsletter(n);
      } catch (e) {
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [me]);

  const handleStatusChange = async (orderId: number, status: string) => {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  if (meLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (notAuthenticated || notAdmin) {
    return (
      <AdminLoginForm
        onSuccess={handleLoginSuccess}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: `Users (${users.length})` },
    { id: "orders", label: `Orders (${orders.length})` },
    { id: "activity", label: `Activity (${activity.length})` },
    { id: "newsletter", label: `Newsletter (${newsletter.length})` },
  ] as const;

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      (o.userEmail ?? "").toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.userName ?? "").toLowerCase().includes(orderSearch.toLowerCase()) ||
      String(o.id).includes(orderSearch) ||
      (o.transactionId ?? "").toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredActivity = activity.filter(
    (a) =>
      a.action.includes(activitySearch.toLowerCase()) ||
      (a.userEmail ?? "").toLowerCase().includes(activitySearch.toLowerCase()) ||
      (a.userName ?? "").toLowerCase().includes(activitySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-serif text-2xl text-[#C9A84C]">Gold Palace</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Signed in as <strong>{(me as { email?: string })?.email}</strong>
          </span>
          <a href="/" className="text-sm text-[#C9A84C] hover:underline">← Back to Store</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 bg-white border border-gray-200 rounded-lg p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-[#C9A84C] text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Total Users", value: stats.totalUsers, color: "text-blue-600" },
                { label: "Total Orders", value: stats.totalOrders, color: "text-purple-600" },
                { label: "Total Revenue", value: fmt(stats.totalRevenue), color: "text-green-600" },
                { label: "Activity Logs", value: stats.totalActivities, color: "text-orange-600" },
                { label: "Newsletter Subs", value: stats.newsletterSubscribers, color: "text-pink-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Sign-ups</h3>
                <div className="space-y-3">
                  {users.slice(0, 8).map((u) => (
                    <div key={u.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-800">{u.firstName} {u.lastName}</span>
                        <span className="text-gray-400 ml-2">{u.email}</span>
                        {u.isAdmin && <span className="ml-2 px-1.5 py-0.5 bg-[#C9A84C] text-white text-xs rounded">ADMIN</span>}
                      </div>
                      <span className="text-gray-400 text-xs">{timeAgo(u.createdAt)}</span>
                    </div>
                  ))}
                  {users.length === 0 && <p className="text-gray-400 text-sm">No users yet.</p>}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {activity.slice(0, 8).map((a) => (
                    <div key={a.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge status={a.action} />
                        <span className="text-gray-500">{a.userName ?? "Anonymous"}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{timeAgo(a.createdAt)}</span>
                    </div>
                  ))}
                  {activity.length === 0 && <p className="text-gray-400 text-sm">No activity yet.</p>}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 6).map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-800">#{o.id}</span>
                        <span className="text-gray-400 ml-2">{o.userEmail ?? "Guest"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge status={o.status} />
                        <span className="font-semibold text-gray-800">{fmt(o.total)}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-400 text-sm">No orders yet.</p>}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Newsletter Subscribers</h3>
                <div className="space-y-2">
                  {newsletter.slice(0, 8).map((n) => (
                    <div key={n.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{n.email}</span>
                      <span className="text-gray-400 text-xs">{timeAgo(n.createdAt)}</span>
                    </div>
                  ))}
                  {newsletter.length === 0 && <p className="text-gray-400 text-sm">No subscribers yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">All Registered Users</h2>
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="border border-gray-200 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">#{u.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{u.firstName} {u.lastName}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.isAdmin
                          ? <span className="px-2 py-0.5 bg-[#C9A84C] text-white text-xs rounded font-medium">Admin</span>
                          : <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Customer</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <p className="text-center py-8 text-gray-400">No users found.</p>
              )}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">All Orders & Transactions</h2>
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by email, order ID, or transaction…"
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Order</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Items</th>
                      <th className="px-4 py-3 text-left">Subtotal</th>
                      <th className="px-4 py-3 text-left">Shipping</th>
                      <th className="px-4 py-3 text-left">Total</th>
                      <th className="px-4 py-3 text-left">Payment</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((o) => {
                      const items = Array.isArray(o.items) ? o.items as { name: string; quantity: number; price: string }[] : [];
                      return (
                        <tr key={o.id} className="hover:bg-gray-50 align-top">
                          <td className="px-4 py-3 text-gray-400 font-mono">#{o.id}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-800">{o.userName ?? "Guest"}</div>
                            <div className="text-gray-400 text-xs">{o.userEmail}</div>
                            {o.transactionId && (
                              <div className="text-gray-300 text-xs font-mono mt-0.5">txn: {o.transactionId}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-0.5">
                              {items.map((it, idx) => (
                                <div key={idx} className="text-xs text-gray-600">
                                  {it.quantity}× {it.name} <span className="text-gray-400">@ {it.price}</span>
                                </div>
                              ))}
                              {items.length === 0 && <span className="text-gray-300 text-xs">—</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{fmt(o.subtotal)}</td>
                          <td className="px-4 py-3 text-gray-500">{fmt(o.shippingCost)}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{fmt(o.total)}</td>
                          <td className="px-4 py-3 text-gray-500 capitalize">{o.paymentMethod ?? "—"}</td>
                          <td className="px-4 py-3">
                            <select
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                              className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
                            >
                              {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <p className="text-center py-8 text-gray-400">No orders found.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "activity" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">User Activity Log</h2>
              <input
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder="Search by action or user…"
                className="border border-gray-200 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-left">Action</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Details</th>
                    <th className="px-4 py-3 text-left">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredActivity.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{timeAgo(a.createdAt)}</td>
                      <td className="px-4 py-3"><Badge status={a.action} /></td>
                      <td className="px-4 py-3 font-medium text-gray-800">{a.userName ?? "Anonymous"}</td>
                      <td className="px-4 py-3 text-gray-500">{a.userEmail ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                        {a.metadata ? JSON.stringify(a.metadata).slice(0, 80) : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{a.ipAddress ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredActivity.length === 0 && (
                <p className="text-center py-8 text-gray-400">No activity logged yet.</p>
              )}
            </div>
          </div>
        )}

        {tab === "newsletter" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Newsletter Subscribers ({newsletter.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Email Address</th>
                    <th className="px-4 py-3 text-left">Subscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newsletter.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">#{n.id}</td>
                      <td className="px-4 py-3 text-gray-800">{n.email}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(n.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {newsletter.length === 0 && (
                <p className="text-center py-8 text-gray-400">No subscribers yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
