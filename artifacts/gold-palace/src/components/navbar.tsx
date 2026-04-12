import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMe, useLogout, useGetCart, getGetMeQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation Left */}
          <nav className="hidden md:flex flex-1 items-center gap-8">
            <Link href="#collections" className="text-sm font-medium hover:text-primary transition-colors tracking-widest uppercase">
              Collections
            </Link>
            <Link href="#new-arrivals" className="text-sm font-medium hover:text-primary transition-colors tracking-widest uppercase">
              New Arrivals
            </Link>
            <Link href="#sale" className="text-sm font-medium hover:text-primary transition-colors tracking-widest uppercase">
              Sale
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors tracking-widest uppercase">
              Heritage
            </Link>
          </nav>

          {/* Logo */}
          <div className="flex-1 md:flex-none text-center">
            <Link href="/" className="inline-block">
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary">
                GOLD PALACE
              </h1>
              <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase mt-1">
                Est. 1921
              </p>
            </Link>
          </div>

          {/* Desktop Navigation Right (Icons) */}
          <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
            <button className="text-foreground hover:text-primary transition-colors p-2" data-testid="button-search">
              <Search size={20} />
            </button>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm font-serif italic text-muted-foreground">Hello, {user.firstName}</span>
                <button 
                  onClick={handleLogout}
                  className="text-foreground hover:text-primary transition-colors p-2" 
                  title="Sign Out"
                  disabled={logoutMutation.isPending}
                  data-testid="button-logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block text-foreground hover:text-primary transition-colors p-2" data-testid="link-login">
                <User size={20} />
              </Link>
            )}
            
            <button className="text-foreground hover:text-primary transition-colors relative p-2" data-testid="button-cart">
              <ShoppingBag size={20} />
              {user && cart && cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg py-4 px-4 flex flex-col gap-4 z-40">
          <Link href="#collections" className="text-sm font-medium tracking-widest uppercase p-2 border-b border-border">
            Collections
          </Link>
          <Link href="#new-arrivals" className="text-sm font-medium tracking-widest uppercase p-2 border-b border-border">
            New Arrivals
          </Link>
          <Link href="#sale" className="text-sm font-medium tracking-widest uppercase p-2 border-b border-border">
            Sale
          </Link>
          <Link href="#about" className="text-sm font-medium tracking-widest uppercase p-2 border-b border-border">
            Heritage
          </Link>
          {user ? (
            <button onClick={handleLogout} disabled={logoutMutation.isPending} className="text-sm font-medium tracking-widest uppercase p-2 text-left" data-testid="mobile-button-logout">
              Sign Out
            </button>
          ) : (
            <Link href="/login" className="text-sm font-medium tracking-widest uppercase p-2" data-testid="mobile-link-login">
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
