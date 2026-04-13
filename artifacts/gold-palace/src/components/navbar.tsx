import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { useGetMe, useLogout, useGetCart, getGetMeQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey(), enabled: !!user } });
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      }
    });
  };

  const categories = [
    { name: "Rings", link: "#collections" },
    { name: "Earrings", link: "#collections" },
    { name: "Mangalsutra", link: "#collections" },
    { name: "Necklace", link: "#collections" },
    { name: "Bracelet", link: "#collections" },
    { name: "Chain", link: "#collections" },
    { name: "Pendant", link: "#collections" }
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background flex flex-col border-b border-border shadow-sm">
      {/* TOP PROMO STRIP */}
      <div className="bg-secondary text-white py-1.5 text-center text-[11px] font-medium tracking-widest uppercase w-full">
        10% OFF GOLD &amp; DIAMOND JEWELRY - IWD2026
      </div>
      {/* SHIPPING STRIP */}
      <div className="bg-primary/10 border-b border-primary/20 py-1.5 text-center text-[10px] font-medium tracking-[0.2em] text-foreground/70 uppercase w-full">
        Complimentary Insured Shipping on all orders over $500
      </div>

      {/* MAIN HEADER ROW */}
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Search */}
        <div className="flex-1 flex items-center gap-4">
          <button className="text-foreground hover:text-primary transition-colors p-2" data-testid="button-search">
            <Search size={22} strokeWidth={1.5} />
          </button>
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex-[2] text-center flex flex-col items-center">
          <Link href="/" className="inline-block group">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground font-normal tracking-tight group-hover:text-primary transition-colors">
              Gold Palace
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
              World's First 22k Gold Jewelry Online Store (Since 1994)
            </p>
          </Link>
        </div>

        {/* Right: Login & Cart */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {user ? (
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground mr-2">{user.firstName}</span>
              <button 
                onClick={handleLogout}
                className="text-foreground hover:text-primary transition-colors p-2" 
                title="Sign Out"
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 text-foreground hover:text-primary transition-colors p-2 text-sm font-medium" data-testid="link-login">
              <User size={22} strokeWidth={1.5} />
              <span className="hidden xl:inline-block">Login</span>
            </Link>
          )}
          
          <button className="flex items-center gap-2 text-foreground hover:text-primary transition-colors p-2 group" data-testid="button-cart">
            <div className="relative">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {user && cart && cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="hidden xl:inline-block text-sm font-medium">
              Shopping Cart ({user && cart ? cart.length : 0} items)
            </span>
          </button>
        </div>
      </div>

      {/* CATEGORY NAV BAR */}
      <div className="hidden md:block bg-muted/50 border-t border-border/50 py-3">
        <nav className="container mx-auto px-4 flex items-center justify-center">
          {categories.map((cat, index) => (
            <div key={cat.name} className="flex items-center">
              <Link 
                href={cat.link} 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide px-6"
              >
                {cat.name}
              </Link>
              {index < categories.length - 1 && (
                <div className="h-4 w-px bg-border/80"></div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-2 px-4 flex flex-col z-40 max-h-[80vh] overflow-y-auto">
          {categories.map((cat) => (
            <Link 
              key={cat.name}
              href={cat.link} 
              className="text-sm font-medium tracking-wide p-4 border-b border-border/50 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          {user ? (
            <button 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }} 
              disabled={logoutMutation.isPending} 
              className="text-sm font-medium tracking-wide p-4 text-center mt-2" 
              data-testid="mobile-button-logout"
            >
              Sign Out
            </button>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-medium tracking-wide p-4 text-center bg-muted/30 mt-2" 
              data-testid="mobile-link-login"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
