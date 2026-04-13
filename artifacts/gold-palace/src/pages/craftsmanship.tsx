import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Design & Casting",
    desc: "Each piece begins as a hand-drawn sketch by our senior designers, many of whom trained under master goldsmiths in Rajasthan. The design is then cast in pure wax before being investment cast in molten 22K gold.",
  },
  {
    step: "02",
    title: "Hand Finishing",
    desc: "Once cast, our artisans spend hours hand-filing, polishing, and refining every surface. No shortcuts. Each edge is checked under magnification for uniformity and sharpness.",
  },
  {
    step: "03",
    title: "Stone Setting",
    desc: "For diamond and gemstone pieces, our setters carefully place each stone by hand using precision tools. Every diamond is IGI or GIA certified and conflict-free.",
  },
  {
    step: "04",
    title: "BIS Hallmarking",
    desc: "Every piece receives BIS hallmarking — India's official gold purity certification — confirming the exact karat. You'll never receive gold that isn't what we say it is.",
  },
  {
    step: "05",
    title: "Quality Inspection",
    desc: "A dedicated QC team inspects each piece against 47 checkpoints before it is approved for sale. Pieces that don't pass are returned to the workshop.",
  },
  {
    step: "06",
    title: "Packaging & Dispatch",
    desc: "Approved pieces are wrapped in signature Gold Palace packaging and dispatched with fully insured express shipping — so your heirloom arrives safely.",
  },
];

export default function CraftsmanshipPage() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      <section className="bg-secondary text-white py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <span className="text-[11px] font-medium tracking-[0.3em] text-primary uppercase mb-5 block">Our Heritage</span>
          <h1 className="font-serif text-5xl md:text-6xl mb-6 leading-tight">Master Craftsmanship</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            The process behind every Gold Palace piece — from raw gold to heirloom.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background flex-1">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">The Six-Step Atelier Process</h2>
            <div className="w-20 h-[1px] bg-primary mx-auto"></div>
          </div>

          <div className="space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-8 items-start pb-12 border-b border-border last:border-0"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-xl text-primary font-bold">{s.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl text-foreground mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 bg-muted/30 border border-border p-10 text-center">
            <h3 className="font-serif text-3xl mb-4">Our Promise</h3>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto mb-6">
              Every piece we ship carries a Certificate of Authenticity, BIS hallmark, and our personal guarantee. If you are not satisfied for any reason within 30 days, we will make it right.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8 max-w-md mx-auto">
              {["BIS Hallmarked", "Insured Shipping", "30-Day Returns"].map((b) => (
                <div key={b} className="text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-foreground">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
