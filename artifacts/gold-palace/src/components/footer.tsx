import { Link } from "wouter";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SiPinterest, SiX } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-20 pb-10 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl text-primary mb-6">Gold Palace</h2>
            <p className="text-sm text-secondary-foreground/70 mb-6 leading-relaxed">
              World's First 22k Gold Jewelry Online Store. Trusted since 1994, we specialize in curating heirloom investment-grade 22K gold and diamond jewelry.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <SiPinterest size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <SiX size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-secondary-foreground/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg mb-6 tracking-wide text-white">Collections</h3>
            <ul className="space-y-4">
              <li><Link href="/category/rings" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">22K Gold Rings</Link></li>
              <li><Link href="/category/earrings" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Diamond Earrings</Link></li>
              <li><Link href="/category/mangalsutra" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Traditional Mangalsutra</Link></li>
              <li><Link href="/category/chains" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Men's Gold Chains</Link></li>
              <li><Link href="/category/bridal" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Bridal Sets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 tracking-wide text-white">Customer Care</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/jewelry-care" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Jewelry Care Guide</Link></li>
              <li><Link href="/faq" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/size-guide" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Ring Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 tracking-wide text-white">Our Heritage</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/craftsmanship" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Master Craftsmanship</Link></li>
              <li><Link href="/materials" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Gold & Diamonds</Link></li>
              <li><Link href="/blog" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">The Atelier Blog</Link></li>
              <li><Link href="/press" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">Press</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-foreground/50">
            &copy; {new Date().getFullYear()} Gold Palace. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-secondary-foreground/50 hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-secondary-foreground/50 hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
