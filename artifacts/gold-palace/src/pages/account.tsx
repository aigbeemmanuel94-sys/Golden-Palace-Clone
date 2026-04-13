import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Package, Heart, Settings, LogOut, Edit2, Check } from "lucide-react";
import {
  useGetMe,
  useLogout,
  getGetMeQueryKey,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

// Sample order history data
const sampleOrders = [
  { id: "GP-2026-0891", date: "March 28, 2026", status: "Delivered", items: "22K Gold Jhumka Earrings", total: "$2,291.50" },
  { id: "GP-2026-0754", date: "February 14, 2026", status: "Delivered", items: "18K Diamond Mangalsutra (3.05g)", total: "$1,046.00" },
  { id: "GP-2025-1203", date: "December 3, 2025", status: "Delivered", items: "22K Gold Pendant + Bangle Set", total: "$1,908.12" },
  { id: "GP-2025-0992", date: "October 12, 2025", status: "Delivered", items: "22K Rope Chain for Men (14.2g)", total: "$5,003.00" },
];

export default function AccountPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cartOpen, setCartOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileFirst, setProfileFirst] = useState("");
  const [profileLast, setProfileLast] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  const { data: user, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const logoutMutation = useLogout();

  const [wishlist, setWishlist] = useState<{ id: number; name: string; price: string; imageUrl: string; weight: string }[]>([]);

  useEffect(() => {
    if (user) {
      setProfileFirst(user.firstName ?? "");
      setProfileLast(user.lastName ?? "");
      setProfileEmail(user.email ?? "");
    }
  }, [user]);

  useEffect(() => {
    // Load wishlist product details from localStorage IDs + all products cached
    const ids: number[] = JSON.parse(localStorage.getItem("gp_wishlist") || "[]");
    if (ids.length === 0) return;
    // We can't query individual products easily, so let's store full wishlist items in localStorage
    const items = JSON.parse(localStorage.getItem("gp_wishlist_items") || "[]");
    setWishlist(items.filter((i: any) => ids.includes(i.id)));
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setLocation("/");
      },
    });
  };

  const handleSaveProfile = () => {
    toast({ title: "Profile Updated", description: "Your profile has been saved." });
    setEditingProfile(false);
  };

  const removeFromWishlist = (id: number) => {
    const ids: number[] = JSON.parse(localStorage.getItem("gp_wishlist") || "[]");
    const updated = ids.filter((x) => x !== id);
    localStorage.setItem("gp_wishlist", JSON.stringify(updated));
    setWishlist((prev) => prev.filter((x) => x.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading your account…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <User size={48} strokeWidth={1} className="mx-auto mb-6 text-primary" />
            <h2 className="font-serif text-3xl mb-3">Sign In to Your Account</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Access your profile, order history, wishlist, and more.
            </p>
            <Link href="/login">
              <Button className="w-full h-12 rounded-none bg-primary text-white uppercase tracking-widest text-xs mb-4">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full h-12 rounded-none border-foreground text-foreground uppercase tracking-widest text-xs hover:bg-foreground hover:text-background">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Account Header */}
      <section className="bg-muted/30 border-b border-border/50 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-primary uppercase mb-2">My Account</p>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">
                Welcome back, {user.firstName}
              </h1>
              <p className="text-muted-foreground text-sm mt-2">{user.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="rounded-none border-border text-muted-foreground hover:border-destructive hover:text-destructive uppercase tracking-widest text-xs h-10 px-6 flex items-center gap-2"
            >
              <LogOut size={15} />
              Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Account Tabs */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 md:px-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 max-w-2xl mb-10 bg-muted/50 rounded-none h-12">
              <TabsTrigger value="profile" className="rounded-none uppercase tracking-wider text-xs flex items-center gap-2">
                <User size={13} /> Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-none uppercase tracking-wider text-xs flex items-center gap-2">
                <Package size={13} /> Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="rounded-none uppercase tracking-wider text-xs flex items-center gap-2">
                <Heart size={13} /> Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-none uppercase tracking-wider text-xs flex items-center gap-2">
                <Settings size={13} /> Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="max-w-xl">
                <div className="bg-card border border-border p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl">Personal Information</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProfile(!editingProfile)}
                      className="text-primary hover:text-primary uppercase tracking-widest text-xs flex items-center gap-1"
                    >
                      {editingProfile ? <Check size={14} /> : <Edit2 size={14} />}
                      {editingProfile ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">First Name</label>
                        {editingProfile ? (
                          <Input value={profileFirst} onChange={(e) => setProfileFirst(e.target.value)} className="h-11 rounded-none" />
                        ) : (
                          <p className="text-foreground font-medium py-2.5">{user.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Last Name</label>
                        {editingProfile ? (
                          <Input value={profileLast} onChange={(e) => setProfileLast(e.target.value)} className="h-11 rounded-none" />
                        ) : (
                          <p className="text-foreground font-medium py-2.5">{user.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Email Address</label>
                      {editingProfile ? (
                        <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="h-11 rounded-none" type="email" />
                      ) : (
                        <p className="text-foreground font-medium py-2.5">{user.email}</p>
                      )}
                    </div>
                    {editingProfile && (
                      <Button
                        onClick={handleSaveProfile}
                        className="h-11 rounded-none bg-primary text-white uppercase tracking-widest text-xs px-8"
                      >
                        Save Changes
                      </Button>
                    )}
                  </div>
                </div>

                {/* Member Since */}
                <div className="mt-6 bg-card border border-border p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Gold Palace Member Since</p>
                    <p className="font-serif text-lg text-foreground">
                      {new Date(user.createdAt ?? Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="max-w-3xl">
                <h2 className="font-serif text-2xl mb-8">Order History</h2>
                {sampleOrders.length === 0 ? (
                  <div className="text-center py-16 bg-card border border-border">
                    <Package size={40} strokeWidth={1} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="font-serif text-lg mb-2">No orders yet</p>
                    <p className="text-muted-foreground text-sm">Your purchases will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sampleOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border p-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-mono text-sm font-medium text-foreground">{order.id}</span>
                              <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5">
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-foreground mb-1">{order.items}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-serif text-xl text-foreground">{order.total}</p>
                            <button className="text-xs text-primary hover:text-primary/80 uppercase tracking-widest mt-1">
                              View Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <div>
                <h2 className="font-serif text-2xl mb-8">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-16 bg-card border border-border max-w-md">
                    <Heart size={40} strokeWidth={1} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="font-serif text-lg mb-2">Your wishlist is empty</p>
                    <p className="text-muted-foreground text-sm mb-6">
                      Save pieces you love by clicking the heart icon on any product.
                    </p>
                    <Link href="/">
                      <Button className="rounded-none bg-primary text-white uppercase tracking-widest text-xs h-11 px-8">
                        Browse Collections
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="bg-card border border-border p-4 relative">
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-4 right-4 text-primary hover:text-destructive transition-colors"
                        >
                          <Heart size={16} className="fill-current" />
                        </button>
                        <div className="aspect-square bg-muted/20 mb-4 overflow-hidden">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm text-foreground mb-1 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-muted-foreground mb-3">{item.weight}</p>
                        <p className="font-serif text-lg text-foreground mb-4">{item.price}</p>
                        <Button className="w-full h-10 rounded-none bg-transparent border border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-widest text-[11px]">
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="max-w-xl space-y-6">
                <h2 className="font-serif text-2xl mb-8">Account Settings</h2>

                <div className="bg-card border border-border p-8">
                  <h3 className="font-serif text-lg mb-6">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Current Password</label>
                      <Input type="password" placeholder="••••••••" className="h-11 rounded-none" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">New Password</label>
                      <Input type="password" placeholder="••••••••" className="h-11 rounded-none" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">Confirm New Password</label>
                      <Input type="password" placeholder="••••••••" className="h-11 rounded-none" />
                    </div>
                    <Button
                      className="h-11 rounded-none bg-primary text-white uppercase tracking-widest text-xs px-8 mt-2"
                      onClick={() => toast({ title: "Password Updated", description: "Your password has been changed successfully." })}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="bg-card border border-border p-8">
                  <h3 className="font-serif text-lg mb-4">Email Preferences</h3>
                  <div className="space-y-4">
                    {["New Arrivals & Collections", "Exclusive Member Offers", "Order Updates", "Gold Market Insights"].map((pref) => (
                      <label key={pref} className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-foreground">{pref}</span>
                        <div className="relative">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-10 h-5 bg-muted peer-checked:bg-primary rounded-full transition-colors cursor-pointer"></div>
                          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-destructive/30 p-8">
                  <h3 className="font-serif text-lg mb-2 text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-none border-destructive text-destructive hover:bg-destructive hover:text-white uppercase tracking-widest text-xs h-10 px-6"
                    onClick={() => toast({ variant: "destructive", title: "Account Deletion", description: "Please contact support to delete your account." })}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
