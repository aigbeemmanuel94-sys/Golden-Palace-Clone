import React, { useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useListCategories,
  getListCategoriesQueryKey,
  useListProducts,
  getListProductsQueryKey,
  useGetMe,
  getGetMeQueryKey,
  useAddToCart,
  getGetCartQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug ?? "";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("gp_wishlist") || "[]"); } catch { return []; }
  });

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const category = categories?.find((c) => c.slug === slug);

  const { data: products, isLoading } = useListProducts(
    { categoryId: category?.id },
    { query: { queryKey: getListProductsQueryKey({ categoryId: category?.id }), enabled: !!category?.id } }
  );

  const addToCartMutation = useAddToCart();

  const handleAddToCart = (productId: number) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    addToCartMutation.mutate(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setCartOpen(true);
          toast({ title: "Added to Cart", description: "Item added to your shopping bag." });
        },
      }
    );
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("gp_wishlist", JSON.stringify(next));
      return next;
    });
  };

  const getDiscountPct = (price: string, originalPrice?: string | null) => {
    if (!originalPrice) return null;
    const sale = parseFloat(price.replace(/[^0-9.]/g, ""));
    const orig = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
    if (!orig || orig <= sale) return null;
    return Math.round((1 - sale / orig) * 100);
  };

  const displayName = category?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Category Hero */}
      <section className="bg-muted/30 border-b border-border/50 py-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <span className="text-[11px] font-medium tracking-[0.3em] text-primary uppercase mb-4 block">Collections</span>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{displayName}</h1>
          <div className="w-20 h-[1px] bg-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">
            {products?.length ?? 0} pieces — Handcrafted in 22K & 18K gold
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading || !category ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-card p-4 border border-border">
                  <Skeleton className="w-full aspect-square mb-4 rounded-none" />
                  <Skeleton className="h-3 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-5 w-1/4 mb-4" />
                  <Skeleton className="h-10 w-full rounded-none" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, i) => {
                const pct = getDiscountPct(product.price, product.originalPrice);
                const inWishlist = wishlist.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card p-4 border border-border hover:shadow-md transition-shadow flex flex-col h-full group relative"
                  >
                    {pct && (
                      <div className="absolute top-6 left-6 z-10 bg-destructive text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                        -{pct}%
                      </div>
                    )}
                    {product.badge && !pct && (
                      <div className="absolute top-6 left-6 z-10 bg-primary text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                        {product.badge}
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-6 right-6 z-10 p-2 bg-background/80 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <Heart
                        size={16}
                        className={inWishlist ? "fill-primary text-primary" : "text-muted-foreground"}
                      />
                    </button>

                    <div className="relative aspect-square mb-5 bg-muted/20 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col flex-1 text-center">
                      <span className="text-[10px] uppercase tracking-widest text-primary font-medium mb-2">
                        {category.name}
                      </span>
                      <h3 className="font-sans text-sm text-foreground mb-2 leading-relaxed flex-1">{product.name}</h3>
                      <span className="text-xs text-muted-foreground mb-4">{product.weight ?? "22K Gold"}</span>
                      <div className="flex items-center justify-center gap-3 mb-6">
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through text-sm">{product.originalPrice}</span>
                        )}
                        <span className={`font-serif text-lg font-medium ${pct ? "text-destructive" : "text-foreground"}`}>
                          {product.price}
                        </span>
                      </div>
                      <Button
                        className="w-full rounded-none bg-transparent border border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-widest text-[11px] h-11"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addToCartMutation.isPending}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-serif text-xl mb-2">No pieces found</p>
              <p className="text-sm text-muted-foreground">Check back soon for new additions.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
