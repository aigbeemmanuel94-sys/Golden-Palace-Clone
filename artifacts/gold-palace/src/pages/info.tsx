import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";

const content: Record<string, { title: string; subtitle: string; body: React.ReactNode }> = {
  contact: {
    title: "Contact Us",
    subtitle: "We're here to help",
    body: (
      <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Email Support", value: "support@goldpalace.com", note: "Replies within 4 hours" },
            { label: "WhatsApp", value: "+1 (800) 465-3789", note: "Mon–Sat, 9am–7pm IST" },
            { label: "International", value: "+91 40 6666 7777", note: "Available globally" },
          ].map((c) => (
            <div key={c.label} className="bg-card border border-border p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{c.label}</p>
              <p className="font-serif text-lg text-primary mb-1">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border p-8">
          <h3 className="font-serif text-2xl mb-6">Send Us a Message</h3>
          <div className="space-y-4 max-w-lg">
            <input className="w-full h-11 border border-border bg-background px-4 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Your Name" />
            <input className="w-full h-11 border border-border bg-background px-4 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Email Address" type="email" />
            <textarea className="w-full border border-border bg-background px-4 py-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary h-28 resize-none" placeholder="How can we help you?" />
            <button className="h-11 px-10 bg-primary text-white uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    ),
  },
  shipping: {
    title: "Shipping & Returns",
    subtitle: "Complimentary insured shipping on orders over $500",
    body: (
      <div className="space-y-8 max-w-3xl">
        {[
          { heading: "Complimentary Insured Shipping", text: "All orders over $500 qualify for complimentary fully-insured express shipping. Orders under $500 incur a flat $29 shipping fee. Your jewelry is insured for its full value during transit." },
          { heading: "Delivery Timeframes", text: "US & Canada: 3–5 business days. UK & Europe: 5–8 business days. India & South Asia: 2–4 business days. Rest of World: 7–14 business days. Expedited options available at checkout." },
          { heading: "Returns Policy", text: "We offer hassle-free returns within 30 days of delivery. Items must be unworn and in original packaging with all tags attached. Custom or engraved pieces are final sale." },
          { heading: "Exchange Policy", text: "We're happy to exchange any non-custom piece within 60 days. Simply contact us at support@goldpalace.com and we'll arrange a collection." },
        ].map((s) => (
          <div key={s.heading} className="border-b border-border pb-8 last:border-0">
            <h3 className="font-serif text-xl mb-3 text-foreground">{s.heading}</h3>
            <p className="text-muted-foreground leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know",
    body: (
      <div className="space-y-6 max-w-3xl">
        {[
          { q: "Is your gold certified?", a: "Yes. Every piece carries a BIS hallmark, India's official gold purity certification. 22K pieces are 91.6% pure gold. We also provide a Certificate of Authenticity with every purchase." },
          { q: "Are your diamonds conflict-free?", a: "Absolutely. All diamonds used in Gold Palace jewelry are ethically sourced and certified conflict-free under the Kimberley Process. IGI or GIA certification is available on request." },
          { q: "Can I get custom or bespoke jewelry?", a: "Yes. We offer bespoke services for weddings and special occasions. Contact us at support@goldpalace.com with your requirements and we'll arrange a consultation." },
          { q: "How do I track my order?", a: "Once shipped, you will receive a tracking number via email. All shipments are made through fully insured express couriers with end-to-end tracking." },
          { q: "What if I need to resize a ring?", a: "We offer one free resize within 60 days of purchase. Simply return the ring with your order number and we'll resize it at no charge." },
          { q: "Do you ship internationally?", a: "Yes, we ship to over 120 countries. Duties and taxes may apply depending on your country. These are the buyer's responsibility unless otherwise stated." },
        ].map((f) => (
          <div key={f.q} className="bg-card border border-border p-6">
            <h3 className="font-serif text-lg mb-3 text-foreground">{f.q}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    ),
  },
  "size-guide": {
    title: "Ring Size Guide",
    subtitle: "Find your perfect fit",
    body: (
      <div className="max-w-2xl space-y-8">
        <p className="text-muted-foreground leading-relaxed">
          Finding the right ring size ensures your jewelry fits perfectly. Use our guide below, or contact us for a complimentary ring sizer kit.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 border border-border font-medium uppercase tracking-widest text-xs">US Size</th>
                <th className="text-left p-4 border border-border font-medium uppercase tracking-widest text-xs">UK Size</th>
                <th className="text-left p-4 border border-border font-medium uppercase tracking-widest text-xs">Diameter (mm)</th>
                <th className="text-left p-4 border border-border font-medium uppercase tracking-widest text-xs">Circumference (mm)</th>
              </tr>
            </thead>
            <tbody>
              {[["5","J","15.7","49.3"],["6","L","16.5","51.9"],["7","N","17.3","54.4"],["8","P","18.2","57.2"],["9","R","19.0","59.7"],["10","T","19.8","62.1"],["11","V","20.6","64.6"],["12","X","21.4","67.2"]].map(([us,uk,d,c]) => (
                <tr key={us} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 border border-border">{us}</td>
                  <td className="p-4 border border-border">{uk}</td>
                  <td className="p-4 border border-border">{d}</td>
                  <td className="p-4 border border-border">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-6">
          <h3 className="font-serif text-lg mb-2">Not Sure?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We'll send you a complimentary ring sizer kit. Email us at <span className="text-primary">support@goldpalace.com</span> with your shipping address.
          </p>
        </div>
      </div>
    ),
  },
  "jewelry-care": {
    title: "Jewelry Care Guide",
    subtitle: "Preserve the brilliance of your heirloom pieces",
    body: (
      <div className="max-w-3xl space-y-6">
        {[
          { icon: "✦", heading: "Daily Wear Tips", text: "Remove your jewelry before swimming, showering, or exercising. Chlorine and salt water can dull the finish of 22K gold over time. Put on jewelry last — after perfume, hairspray, and lotion." },
          { icon: "✦", heading: "Cleaning Your Gold", text: "Mix warm water with a few drops of mild dish soap. Soak pieces for 10–15 minutes, then gently brush with a soft toothbrush. Rinse thoroughly and pat dry with a lint-free cloth. Avoid ultrasonic cleaners for pieces with gemstones." },
          { icon: "✦", heading: "Storage", text: "Store each piece separately in a soft pouch or lined jewelry box to prevent scratching. Keep pieces away from direct sunlight and humidity. Chains should be stored unclasped and flat." },
          { icon: "✦", heading: "Diamond & Gemstone Care", text: "Diamonds attract grease. Clean monthly with warm soapy water. Have prongs checked by a professional jeweler every 12–18 months to ensure stones are secure." },
          { icon: "✦", heading: "Professional Cleaning", text: "For deep cleaning or polishing, bring pieces to a professional jeweler. Gold Palace offers complimentary cleaning and inspection for any piece purchased from us — simply contact us to arrange." },
        ].map((s) => (
          <div key={s.heading} className="flex gap-6 pb-6 border-b border-border last:border-0">
            <span className="text-primary text-xl flex-shrink-0 mt-1">{s.icon}</span>
            <div>
              <h3 className="font-serif text-xl mb-2 text-foreground">{s.heading}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  materials: {
    title: "Gold & Diamonds",
    subtitle: "Understanding the materials in your jewelry",
    body: (
      <div className="max-w-3xl space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "22K Gold (91.6% Pure)", desc: "The finest gold used in Indian jewelry tradition. 22K contains 91.6% pure gold with 8.4% alloyed metals for durability. Warmer in color than Western jewelry, heavier in feel, and holds its value as an investment." },
            { title: "18K Gold (75% Pure)", desc: "Used for diamond-set jewelry. The 25% alloy makes it harder, perfect for holding stones securely. Slightly lighter in color than 22K but still distinctly yellow gold." },
            { title: "Conflict-Free Diamonds", desc: "All our diamonds are ethically sourced and certified conflict-free under the Kimberley Process. We primarily use Round Brilliant, Princess, and Pear cuts, ranging from VS to SI clarity." },
            { title: "Colored Gemstones", desc: "We use natural Rubies, Emeralds, and Sapphires in our traditional and temple jewelry. All stones are heat-treated only (no fracture filling or irradiation)." },
          ].map((m) => (
            <div key={m.title} className="bg-card border border-border p-6">
              <h3 className="font-serif text-lg mb-3 text-primary">{m.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we protect your data",
    body: (
      <div className="max-w-3xl space-y-6">
        {[
          { h: "Information We Collect", t: "We collect your name, email address, and shipping address when you place an order or create an account. We do not store credit card information — payments are processed through PCI-compliant payment processors." },
          { h: "How We Use Your Information", t: "Your information is used to process orders, send shipping confirmations, and communicate about your account. We do not sell or share your personal data with third parties for marketing purposes." },
          { h: "Cookies", t: "We use cookies to improve your browsing experience, maintain your shopping cart, and analyze site traffic. You may disable cookies in your browser settings, though some features may not function correctly." },
          { h: "Data Security", t: "All data is transmitted over SSL (HTTPS). We use industry-standard encryption and security practices to protect your personal information." },
          { h: "Contact", t: "If you have questions about your data or wish to request deletion of your account, please contact privacy@goldpalace.com." },
        ].map((s) => (
          <div key={s.h} className="border-b border-border pb-6 last:border-0">
            <h3 className="font-serif text-xl mb-3">{s.h}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.t}</p>
          </div>
        ))}
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully",
    body: (
      <div className="max-w-3xl space-y-6">
        {[
          { h: "Acceptance of Terms", t: "By using Gold Palace's website and services, you agree to these Terms of Service. If you do not agree, please do not use our services." },
          { h: "Products & Pricing", t: "Gold prices fluctuate with international markets. Final pricing is confirmed at checkout. We reserve the right to cancel orders due to pricing errors, though we will notify you promptly." },
          { h: "Orders & Payment", t: "Orders are confirmed upon payment. We accept major credit cards, debit cards, and bank transfers. All transactions are processed securely through our payment partners." },
          { h: "Intellectual Property", t: "All content on this site — images, designs, text, and branding — is the property of Gold Palace and may not be used without written permission." },
          { h: "Limitation of Liability", t: "Gold Palace is not liable for indirect or consequential damages arising from use of our services. Our liability is limited to the value of the order in question." },
        ].map((s) => (
          <div key={s.h} className="border-b border-border pb-6 last:border-0">
            <h3 className="font-serif text-xl mb-3">{s.h}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.t}</p>
          </div>
        ))}
      </div>
    ),
  },
  press: {
    title: "Press",
    subtitle: "Gold Palace in the news",
    body: (
      <div className="max-w-3xl space-y-6">
        {[
          { pub: "Forbes", date: "March 2026", title: "The Online Jeweler That Has Been Selling 22K Gold Since Before Amazon Existed", excerpt: "Gold Palace has quietly built a global following of gold jewelry enthusiasts since 1994, long before e-commerce became a household word..." },
          { pub: "Vogue India", date: "January 2026", title: "The Digital Atelier: Why Bridal Shoppers Trust Gold Palace Over Local Jewelers", excerpt: "With over 50,000 customers across 120 countries, Gold Palace has proven that the most intimate purchase — bridal jewelry — can be made online..." },
          { pub: "Economic Times", date: "October 2025", title: "India's Gold Jewelry Exports: The Online Players Quietly Dominating Global Markets", excerpt: "Among the pioneers driving India's digital jewelry export boom, Gold Palace stands out for its three-decade track record of authenticity..." },
          { pub: "The Hindu", date: "June 2025", title: "Heirloom in a Box: The Artisans Behind Gold Palace's Global Reach", excerpt: "In a workshop in Karimnagar, goldsmiths who have practiced their craft for three generations create pieces that are shipped to New York, London, and Sydney..." },
        ].map((a) => (
          <div key={a.title} className="bg-card border border-border p-6">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-3 py-1">{a.pub}</span>
              <span className="text-xs text-muted-foreground">{a.date}</span>
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">{a.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{a.excerpt}</p>
          </div>
        ))}
      </div>
    ),
  },
  blog: {
    title: "The Atelier Blog",
    subtitle: "Insights on gold, craftsmanship, and heirloom jewelry",
    body: (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {[
          { date: "April 8, 2026", cat: "Gold Insights", title: "Why 22K Gold Is the Standard for Indian Bridal Jewelry", img: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&h=250&fit=crop" },
          { date: "March 22, 2026", cat: "Craftsmanship", title: "Inside the Atelier: A Day With Our Master Goldsmiths", img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=250&fit=crop" },
          { date: "March 5, 2026", cat: "Style Guide", title: "How to Stack Bangles the Traditional Way", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=250&fit=crop" },
          { date: "February 14, 2026", cat: "Investment", title: "Gold as a Generational Investment: The Case for Heirloom Jewelry", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=250&fit=crop" },
          { date: "January 31, 2026", cat: "Trends", title: "2026 Wedding Jewelry Trends: What Brides Are Choosing", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=250&fit=crop" },
          { date: "January 15, 2026", cat: "Care Guide", title: "How to Clean 22K Gold at Home (Without Damaging It)", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop" },
        ].map((post) => (
          <div key={post.title} className="bg-card border border-border group cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-widest text-primary mb-2">{post.cat}</p>
              <h3 className="font-serif text-lg text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-xs text-muted-foreground">{post.date}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
};

export default function InfoPage() {
  const [location] = useRoute("/:slug");
  const [cartOpen, setCartOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  React.useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path);
  });

  const slug = currentPath.replace(/^\//, "") || "contact";

  const page = content[slug] ?? content["contact"];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      <section className="bg-muted/30 border-b border-border/50 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">{page.title}</h1>
          <div className="w-16 h-[1px] bg-primary mb-4"></div>
          <p className="text-muted-foreground">{page.subtitle}</p>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 md:px-8">
          {page.body}
        </div>
      </section>

      <Footer />
    </div>
  );
}
