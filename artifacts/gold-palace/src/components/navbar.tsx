import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User, Menu, X, LogOut, ChevronDown, Heart } from "lucide-react";
import { useGetMe, useLogout, useGetCart, getGetMeQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface NavbarProps {
  onCartOpen?: () => void;
}

export function Navbar({ onCartOpen }: NavbarProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [heritageMenuOpen, setHeritageMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const heritageRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey(), enabled: !!user } });
  const logoutMutation = useLogout();

  const cartCount = cart?.reduce((sum, item) => sum + (item.quantity ?? 1), 0) ?? 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountMenuOpen(false);
      if (heritageRef.current && !heritageRef.current.contains(e.target as Node)) setHeritageMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setAccountMenuOpen(false);
        setLocation("/");
      },
    });
  };

  const categories = [
    { name: "Rings", href: "/category/rings" },
    { name: "Earrings", href: "/category/earrings" },
    { name: "Mangalsutra", href: "/category/mangalsutra" },
    { name: "Necklace", href: "/category/necklace" },
    { name: "Bracelet", href: "/category/bracelet" },
    { name: "Chain", href: "/category/chain" },
    { name: "Pendant", href: "/category/pendant" },
  ];

  const heritageLinks = [
    { name: "Our Story", href: "/about" },
    { name: "Master Craftsmanship", href: "/craftsmanship" },
    { name: "Gold & Diamonds", href: "/materials" },
    { name: "The Atelier Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background flex flex-col border-b border-border shadow-sm">
      {/* TOP PROMO STRIP */}
      <div className="bg-secondary text-white py-1.5 text-center text-[11px] font-medium tracking-widest uppercase w-full">
        10% OFF GOLD &amp; DIAMOND JEWELRY — USE CODE: IWD2026
      </div>
      {/* SHIPPING STRIP */}
      <div className="bg-primary/10 border-b border-primary/20 py-1.5 text-center text-[10px] font-medium tracking-[0.2em] text-foreground/70 uppercase w-full">
        Complimentary Insured Shipping on all orders over $500
      </div>

      {/* MAIN HEADER ROW */}
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left: Search + Heritage */}
        <div className="flex-1 flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-foreground hover:text-primary transition-colors p-2"
          >
            <Search size={22} strokeWidth={1.5} />
          </button>

          {/* Heritage Dropdown - desktop */}
          <div className="hidden lg:block relative" ref={heritageRef}>
            <button
              onClick={() => setHeritageMenuOpen(!heritageMenuOpen)}
              className="flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors font-medium"
            >
              Our Heritage <ChevronDown size={14} className={`transition-transform ${heritageMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {heritageMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-card border border-border shadow-xl py-2 z-50">
                {heritageLinks.map((l) => (
                  <Link
                    key={l.name}
                    href={l.href}
                    onClick={() => setHeritageMenuOpen(false)}
                    className="block px-5 py-3 text-sm text-foreground hover:text-primary hover:bg-muted/40 transition-colors"
                  >
                    {l.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2"
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

        {/* Right: Account & Cart */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {user ? (
            <div className="hidden md:block relative" ref={accountRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <User size={20} strokeWidth={1.5} />
                <span className="hidden xl:inline">Hi, {user.firstName}</span>
                <ChevronDown size={13} className={`transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {accountMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border shadow-xl py-2 z-50">
                  <Link
                    href="/account"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-foreground hover:text-primary hover:bg-muted/40 transition-colors"
                  >
                    <User size={14} /> My Account
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-foreground hover:text-primary hover:bg-muted/40 transition-colors"
                  >
                    <Heart size={14} /> Wishlist
                  </Link>
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-foreground hover:text-destructive hover:bg-muted/40 transition-colors w-full text-left"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <Link href="/login" className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1.5">
                <User size={20} strokeWidth={1.5} />
                <span className="hidden xl:inline">Sign In</span>
              </Link>
              <span className="text-border">|</span>
              <Link href="/register" className="hidden xl:inline text-foreground hover:text-primary transition-colors font-medium">
                Create Account
              </Link>
            </div>
          )}

          <button
            onClick={onCartOpen}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors p-2 group relative"
          >
            <div className="relative">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {user && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none px-1">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden xl:inline-block text-sm font-medium">
              Bag ({user && cart ? cartCount : 0})
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-border bg-muted/20 px-4 py-3">
          <div className="container mx-auto flex gap-3 items-center max-w-xl">
            <Search size={18} className="text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search for rings, necklaces, mangalsutra…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY NAV BAR */}
      <div className="hidden md:block bg-muted/50 border-t border-border/50 py-3">
        <nav className="container mx-auto px-4 flex items-center justify-center">
          {categories.map((cat, index) => (
            <div key={cat.name} className="flex items-center">
              <Link
                href={cat.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide px-5"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-40 max-h-[85vh] overflow-y-auto">
          <div className="py-2">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-5 pt-3 pb-2">Collections</p>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="block text-sm font-medium tracking-wide px-5 py-3 border-b border-border/30 hover:text-primary hover:bg-muted/30 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-5 pt-4 pb-2">Our Heritage</p>
            {heritageLinks.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className="block text-sm font-medium tracking-wide px-5 py-3 border-b border-border/30 hover:text-primary hover:bg-muted/30 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.name}
              </Link>
            ))}
            <div className="pt-2 pb-4 px-4">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-sm font-medium p-3 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={16} /> My Account
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    disabled={logoutMutation.isPending}
                    className="flex items-center gap-2 text-sm font-medium p-3 text-muted-foreground hover:text-destructive transition-colors w-full text-left"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/login"
                    className="flex-1 text-center text-sm font-medium py-3 border border-primary text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center text-sm font-medium py-3 bg-primary text-white uppercase tracking-widest hover:bg-primary/90 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
