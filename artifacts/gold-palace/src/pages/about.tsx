import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <span className="text-[11px] font-medium tracking-[0.3em] text-primary uppercase mb-5 block">Est. 1994</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-6 leading-tight">Our Story</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
            Three decades of passion, craftsmanship, and an unwavering commitment to the art of gold jewelry.
          </p>
        </div>
      </section>

      {/* Story Sections */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[11px] font-medium tracking-[0.3em] text-primary uppercase mb-4 block">The Beginning</span>
              <h2 className="font-serif text-3xl md:text-4xl mb-6 text-foreground">Pioneering Online Jewelry Since 1994</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gold Palace was born in 1994 in the vibrant heart of India's jewelry trade, at a time when the internet was a new frontier. We became one of the world's first jewelers to bring 22K gold jewelry online — before most businesses even had a website.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our founders believed that the world deserved access to authentic, investment-grade Indian gold jewelry — not just those who lived near the great bazaars of Mumbai, Chennai, or Hyderabad, but anyone, anywhere on the planet.
              </p>
            </motion.div>
            <div className="aspect-square bg-muted/30 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&h=600&fit=crop"
                alt="Gold Palace heritage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="aspect-square bg-muted/30 overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop"
                alt="Master artisans"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
              <span className="text-[11px] font-medium tracking-[0.3em] text-primary uppercase mb-4 block">Our Artisans</span>
              <h2 className="font-serif text-3xl md:text-4xl mb-6 text-foreground">Generations of Master Craftsmen</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every piece in the Gold Palace collection is made by hand. Our artisans have inherited their craft through generations — many tracing their jewelry-making lineage back over 200 years in the Karimnagar and Rajkot districts of India.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Working exclusively with BIS hallmarked 22K gold and IGI/GIA certified diamonds, these craftsmen pour hours, sometimes days, into every bracelet, mangalsutra, and pendant that bears our name.
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-border">
            {[
              { num: "30+", label: "Years of Excellence" },
              { num: "50K+", label: "Happy Customers" },
              { num: "120+", label: "Countries Served" },
              { num: "100%", label: "Authentic Gold" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-4xl text-primary mb-2">{s.num}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="font-serif text-3xl mb-4">Explore Our Collections</h2>
          <p className="text-muted-foreground mb-8">Every piece tells a story. Find yours.</p>
          <Link href="/category/rings">
            <Button className="rounded-none bg-primary text-white uppercase tracking-widest text-xs h-12 px-10 hover:bg-primary/90">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
