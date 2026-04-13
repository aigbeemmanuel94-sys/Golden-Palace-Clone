import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ShieldCheck, Diamond, Gem, Award, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  useListCategories, 
  getListCategoriesQueryKey,
  useListProducts,
  getListProductsQueryKey,
  useSubscribeNewsletter,
  useGetMe,
  getGetMeQueryKey,
  useAddToCart,
  getGetCartQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  
  const { data: categories, isLoading: isLoadingCategories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() }
  });

  const { data: newArrivals, isLoading: isLoadingNewArrivals } = useListProducts(
    { isNewArrival: true },
    { query: { queryKey: getListProductsQueryKey({ isNewArrival: true }) } }
  );

  const { data: trending, isLoading: isLoadingTrending } = useListProducts(
    { isTrending: true },
    { query: { queryKey: getListProductsQueryKey({ isTrending: true }) } }
  );

  const subscribeMutation = useSubscribeNewsletter();
  const addToCartMutation = useAddToCart();

  useEffect(() => {
    // Show popup after 2 seconds if not seen in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenDiscountPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("hasSeenDiscountPopup", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    subscribeMutation.mutate(
      { data: { email } },
      {
        onSuccess: () => {
          toast({
            title: "Subscribed Successfully",
            description: "Welcome to the Gold Palace Insider.",
          });
          setEmail("");
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Subscription Failed",
            description: error?.response?.data?.error || "Please try again later.",
          });
        }
      }
    );
  };

  const getDiscountPct = (price: string, originalPrice?: string | null) => {
    if (!originalPrice) return null;
    const sale = parseFloat(price.replace(/[^0-9.]/g, ""));
    const orig = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
    if (!orig || orig <= sale) return null;
    return Math.round((1 - sale / orig) * 100);
  };

  const handleAddToCart = (productId: number) => {
    if (!user) {
      setLocation("/login");
      return;
    }

    addToCartMutation.mutate(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setCartOpen(true);
          toast({
            title: "Added to Cart",
            description: "Item has been added to your shopping bag.",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="flex-1">
        {/* HERO SECTION - BRIGHT & LUXURIOUS */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-muted/30 border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
            <img 
              src="/images/hero-bright.png" 
              alt="Luxury 22K Gold Jewelry" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-background/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 md:px-8 flex flex-col items-start justify-center h-full">
            <div className="max-w-2xl text-left">
              <span className="inline-block text-[11px] font-medium tracking-[0.3em] text-primary uppercase mb-5 border border-primary/40 px-3 py-1">
                Est. 1994 — World's First 22K Gold Jewelry Online Store
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground mb-6 leading-[1.1] drop-shadow-sm">
                Heirloom Elegance,{" "}
                <span className="italic text-primary">Masterfully</span>{" "}
                Crafted
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-12 font-light leading-relaxed max-w-xl">
                One of the world's oldest online jewelry shops since 1994. Master artisans. 100% authentic 22K gold &amp; conflict-free diamonds.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-start items-center">
                <Link href="/category/rings">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm tracking-widest uppercase h-14 px-10 rounded-none w-full sm:w-auto">
                    Shop 22K Gold
                  </Button>
                </Link>
                <Link href="/category/gold-bar">
                  <Button size="lg" variant="outline" className="border-primary text-foreground hover:bg-primary hover:text-primary-foreground text-sm tracking-widest uppercase h-14 px-10 rounded-none w-full sm:w-auto bg-transparent/50 backdrop-blur-sm">
                    Shop Diamonds
                  </Button>
                </Link>
                <a href="#new-arrivals">
                  <Button size="lg" variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent text-sm tracking-widest uppercase h-14 px-8 rounded-none w-full sm:w-auto border-b border-transparent hover:border-primary">
                    New Arrivals
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST SECTION - WHY CHOOSE US */}
        <section className="py-16 bg-card border-b border-border/50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-medium mb-3 text-foreground">One of the World's Oldest Online Jewelry Shops</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Pioneering luxury jewelry ecommerce since 1994 with an unshakeable reputation for excellence.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Gem className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-medium mb-3 text-foreground">Expertly Crafted by Master Artisans</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Each piece is meticulously handcrafted, preserving generations of jewelry-making traditions.</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-medium mb-3 text-foreground">Guaranteed 100% Authentic</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Certified 22K gold, 18K gold, and ethically sourced conflict-free diamonds of the highest caliber.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section id="collections" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Shop by Category</h2>
              <div className="w-20 h-[1px] bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
              {isLoadingCategories ? (
                Array(7).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="w-full aspect-[4/5] mb-4 rounded-none" />
                    <Skeleton className="h-5 w-2/3 mx-auto" />
                  </div>
                ))
              ) : categories?.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group cursor-pointer flex flex-col" data-testid={`link-category-${cat.id}`}>
                  <div className="relative aspect-[4/5] mb-3 overflow-hidden border border-border group-hover:border-primary/60 transition-colors">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                        <span className="font-serif text-2xl text-muted-foreground">{cat.name[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                      <h3 className="font-serif text-sm md:text-base text-white group-hover:text-primary transition-colors drop-shadow-sm">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BRIDAL TROUSSEAU SECTION */}
        <section className="py-24 bg-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img src="/images/hero-bright.png" alt="" className="w-full h-full object-cover object-right" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/40"></div>
          </div>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-xl">
              <span className="inline-block text-[10px] font-medium tracking-[0.3em] text-primary uppercase mb-5 border border-primary/40 px-3 py-1">
                Exclusive Collection
              </span>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">The Bridal Trousseau</h2>
              <p className="text-white/70 text-base mb-10 font-light leading-relaxed">
                Complete your special day with our exclusive collection of 22K gold antique bridal sets — rich with cultural heritage, heavy with gold, and treasured for generations.
              </p>
              <Link href="/category/necklace">
                <Button className="bg-primary text-primary-foreground hover:bg-white hover:text-secondary rounded-none h-12 px-10 uppercase tracking-widest text-sm font-medium transition-colors">
                  Explore Bridal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section id="new-arrivals" className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">New Arrivals</h2>
              <div className="w-20 h-[1px] bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {isLoadingNewArrivals ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-card p-4 border border-border">
                    <Skeleton className="w-full aspect-square mb-4 rounded-none" />
                    <Skeleton className="h-3 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-5 w-1/4 mb-4" />
                    <Skeleton className="h-10 w-full rounded-none" />
                  </div>
                ))
              ) : newArrivals?.map((product) => (
                <div key={product.id} className="bg-card p-4 border border-border hover:shadow-md transition-shadow flex flex-col h-full group" data-testid={`product-card-${product.id}`}>
                  <div className="relative aspect-square mb-5 bg-muted/20 overflow-hidden">
                    <img 
                      src={product.imageUrl || "/images/prod-1.png"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-medium mb-2">
                      {product.categoryId ? categories?.find(c => c.id === product.categoryId)?.name || 'Jewelry' : 'Jewelry'}
                    </span>
                    <h3 className="font-sans text-sm text-foreground mb-2 leading-relaxed flex-1">{product.name}</h3>
                    
                    <span className="text-xs text-muted-foreground mb-4">
                      {product.weight ? product.weight : "22K Gold"}
                    </span>
                    
                    <p className="font-serif text-lg font-medium text-foreground mb-6">${Number(product.price.replace(/[^0-9.]/g, '')).toLocaleString()}</p>
                    
                    <Button 
                      className="w-full rounded-none bg-transparent border border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-widest text-[11px] h-11"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      disabled={addToCartMutation.isPending}
                      data-testid={`button-add-to-cart-${product.id}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/category/rings">
                <Button variant="outline" className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background uppercase tracking-widest px-10 h-12">
                  Shop All New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* TRENDING NOW / SALE */}
        <section id="sale" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Trending Now</h2>
              <div className="w-20 h-[1px] bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {isLoadingTrending ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-card p-4 border border-border">
                    <Skeleton className="w-full aspect-square mb-4 rounded-none" />
                    <Skeleton className="h-3 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-5 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full rounded-none" />
                  </div>
                ))
              ) : trending?.map((product) => (
                <div key={product.id} className="bg-card p-4 border border-border hover:shadow-md transition-shadow flex flex-col h-full group relative" data-testid={`product-card-${product.id}`}>
                  
                  {/* Discount Badge */}
                  {(() => {
                    const pct = getDiscountPct(product.price, product.originalPrice);
                    return pct ? (
                      <div className="absolute top-6 left-6 z-10 bg-destructive text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                        -{pct}%
                      </div>
                    ) : null;
                  })()}

                  <div className="relative aspect-square mb-5 bg-muted/20 overflow-hidden">
                    <img 
                      src={product.imageUrl || "/images/prod-2.png"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-medium mb-2">
                      {product.categoryId ? categories?.find(c => c.id === product.categoryId)?.name || 'Jewelry' : 'Jewelry'}
                    </span>
                    <h3 className="font-sans text-sm text-foreground mb-2 leading-relaxed flex-1">{product.name}</h3>
                    
                    <span className="text-xs text-muted-foreground mb-3">
                      {product.weight ? product.weight : "18K Gold"}
                    </span>
                    
                    <div className="flex items-center justify-center gap-3 mb-6">
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through text-sm">${Number(product.originalPrice.replace(/[^0-9.]/g, '')).toLocaleString()}</span>
                      )}
                      <span className="font-serif text-lg font-medium text-destructive">${Number(product.price.replace(/[^0-9.]/g, '')).toLocaleString()}</span>
                    </div>
                    
                    <Button 
                      className="w-full mt-auto rounded-none bg-foreground text-background hover:bg-primary uppercase tracking-widest text-[11px] h-11 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      disabled={addToCartMutation.isPending}
                      data-testid={`button-quick-add-${product.id}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-24 bg-muted/50 border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">Join Our Mailing List</h2>
            <p className="text-muted-foreground mb-10 text-sm md:text-base">
              Sign Up for exclusive updates, new arrivals & insider only discounts.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto" onSubmit={handleSubscribe}>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-14 rounded-none border-border bg-card focus-visible:ring-1 focus-visible:ring-primary text-center sm:text-left flex-1"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit" 
                className="h-14 rounded-none bg-foreground hover:bg-primary text-background uppercase tracking-widest text-xs px-10 w-full sm:w-auto transition-colors"
                disabled={subscribeMutation.isPending}
                data-testid="button-newsletter-submit"
              >
                {subscribeMutation.isPending ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />

      {/* FIRST VISIT DISCOUNT POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card w-full max-w-lg border border-border shadow-2xl relative overflow-hidden flex flex-col"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-20"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              
              <div className="p-10 md:p-14 text-center relative z-10 flex flex-col items-center">
                <Diamond className="w-10 h-10 text-primary mb-6" strokeWidth={1} />
                
                <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Welcome</h3>
                <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
                  Join the Gold Palace Insider and receive exclusive access to new heirloom arrivals.
                </p>
                
                <div className="bg-muted/50 w-full p-6 border border-border/50 mb-8">
                  <p className="font-medium text-foreground uppercase tracking-widest text-xs mb-2">Your Exclusive Offer</p>
                  <p className="font-serif text-2xl text-primary mb-2">Take 20% off your first order</p>
                  <p className="text-sm text-muted-foreground font-mono bg-background py-2 border border-border/30 inline-block px-4">
                    Use code: <strong className="text-foreground">CODESALE20</strong>
                  </p>
                </div>
                
                <Button 
                  onClick={() => setShowPopup(false)}
                  className="w-full h-12 rounded-none bg-foreground hover:bg-primary text-background uppercase tracking-widest text-xs transition-colors"
                >
                  Continue Shopping
                </Button>
              </div>
              
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-primary/30 m-4 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-primary/30 m-4 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-primary/30 m-4 pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-primary/30 m-4 pointer-events-none"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
