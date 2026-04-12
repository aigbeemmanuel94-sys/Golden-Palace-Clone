import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ShieldCheck, Diamond, Gem, Award } from "lucide-react";

export default function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const categories = [
    { name: "Rings", image: "/images/cat-ring.png" },
    { name: "Earrings", image: "/images/cat-earrings.png" },
    { name: "Mangalsutra", image: "/images/cat-mangalsutra.png" },
    { name: "Necklace", image: "/images/cat-necklace.png" },
    { name: "Bracelet", image: "/images/cat-bracelet.png" },
  ];

  const newArrivals = [
    { id: 1, name: "22K Gold Filigree Pendant", price: "$566", image: "/images/prod-1.png" },
    { id: 2, name: "Traditional 22K Gold Chain", price: "$1,397", image: "/images/prod-2.png" },
    { id: 3, name: "Heavy 22K Gold Bangles", price: "$2,850", image: "/images/prod-5.png" },
    { id: 4, name: "Mens 22K Gold Curb Chain", price: "$1,920", image: "/images/prod-9.png" },
  ];

  const trending = [
    { id: 1, name: "18K Gold Diamond Ring", originalPrice: "$3,200", salePrice: "$2,400", discount: "25% OFF", image: "/images/prod-3.png" },
    { id: 2, name: "Diamond Stud Earrings", originalPrice: "$1,800", salePrice: "$1,530", discount: "15% OFF", image: "/images/prod-4.png" },
    { id: 3, name: "Emerald & Diamond Ring", originalPrice: "$4,500", salePrice: "$3,600", discount: "20% OFF", image: "/images/prod-6.png" },
    { id: 4, name: "Ruby & Diamond Pendant", originalPrice: "$2,100", salePrice: "$1,680", discount: "20% OFF", image: "/images/prod-7.png" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-xs tracking-widest font-medium uppercase">
        <p>Complimentary Insured Shipping on all orders over $500</p>
      </div>

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-secondary">
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/images/hero-1.png" 
              alt="Luxury Diamond Necklace" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/20 to-secondary/80"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl mx-auto"
            >
              <motion.span variants={fadeInUp} className="inline-block py-1 px-3 border border-primary/50 text-primary text-xs tracking-[0.3em] uppercase mb-6 backdrop-blur-sm bg-secondary/30">
                10% OFF Gold & Diamond Jewelry
              </motion.span>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
                Heirloom Elegance, <span className="text-primary italic">Masterfully</span> Crafted
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 mb-10 font-light max-w-xl mx-auto">
                Discover the world's finest 22K gold and diamond jewelry, trusted by generations since 1921.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm tracking-widest uppercase h-14 px-8 rounded-none">
                  Shop 22K Gold
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-secondary text-sm tracking-widest uppercase h-14 px-8 rounded-none backdrop-blur-sm">
                  Shop Diamonds
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="py-12 bg-card border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex flex-col items-center py-4 md:py-0 px-4">
                <Award className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-medium mb-2">World's Oldest Online</h3>
                <p className="text-sm text-muted-foreground">Trusted jewelry destination since 1921, pioneering online luxury.</p>
              </div>
              <div className="flex flex-col items-center py-4 md:py-0 px-4">
                <Gem className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-medium mb-2">Master Artisans</h3>
                <p className="text-sm text-muted-foreground">Each piece expertly crafted by South Asian master jewelers.</p>
              </div>
              <div className="flex flex-col items-center py-4 md:py-0 px-4">
                <ShieldCheck className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-serif text-lg font-medium mb-2">100% Authentic</h3>
                <p className="text-sm text-muted-foreground">Guaranteed purity with certified 22K, 18K gold and conflict-free diamonds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="collections" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl text-foreground mb-4">Shop by Category</h2>
              <div className="w-16 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-6 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible md:pb-0 md:px-0">
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/category/${cat.name.toLowerCase()}`} className="snap-center shrink-0 w-[70vw] md:w-auto group cursor-pointer">
                  <div className="relative overflow-hidden aspect-square mb-4 bg-card">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  <h3 className="font-serif text-xl text-center text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HERO 2 / BRAND BANNER */}
        <section className="py-24 bg-secondary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
            <img src="/images/hero-2.png" alt="Bridal Gold" className="w-full h-full object-cover object-left" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">The Bridal Trousseau</h2>
              <p className="text-white/80 text-lg mb-10 font-light">
                Complete your special day with our exclusive collection of 22K gold antique bridal sets, rich with cultural heritage and heavy with gold.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-white hover:text-secondary rounded-none h-12 px-8 uppercase tracking-widest text-sm">
                Explore Bridal
              </Button>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section id="new-arrivals" className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-serif text-4xl text-foreground mb-4">New Arrivals</h2>
                <p className="text-muted-foreground">The latest 22K gold masterpieces added to our atelier.</p>
              </div>
              <Link href="/new-arrivals" className="hidden md:flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-primary hover:text-foreground transition-colors group">
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <div key={product.id} className="group cursor-pointer bg-background p-4 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="relative aspect-square overflow-hidden mb-6 bg-card">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-sans text-sm tracking-wide text-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="font-serif text-lg font-medium">{product.price}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center md:hidden">
              <Button variant="outline" className="rounded-none border-border w-full uppercase tracking-widest">
                View All Arrivals
              </Button>
            </div>
          </div>
        </section>

        {/* TRENDING / SALE */}
        <section id="sale" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl text-foreground mb-4">Trending Diamonds</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Exceptional diamond pieces, currently at special atelier pricing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trending.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden mb-6 bg-card border border-border/50">
                    <span className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                      {product.discount}
                    </span>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-background/90 backdrop-blur-sm">
                      <Button className="w-full rounded-none bg-secondary hover:bg-primary text-white">
                        Quick Add
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-sans text-sm tracking-wide text-foreground mb-2">{product.name}</h3>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-muted-foreground line-through text-sm">{product.originalPrice}</span>
                      <span className="font-serif text-lg font-medium text-destructive">{product.salePrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <Diamond className="w-12 h-12 text-primary mx-auto mb-6" strokeWidth={1} />
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Join the Gold Palace Insider</h2>
            <p className="text-muted-foreground mb-10">
              Subscribe to receive exclusive access to new heirloom arrivals, private sales, and the jewelry care guide.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-12 rounded-none border-border bg-background focus-visible:ring-primary text-center sm:text-left"
                required
              />
              <Button type="submit" className="h-12 rounded-none bg-secondary hover:bg-primary text-white uppercase tracking-widest text-xs px-8">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
