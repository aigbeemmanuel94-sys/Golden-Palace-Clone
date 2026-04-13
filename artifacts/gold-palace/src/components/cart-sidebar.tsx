import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Trash2, ShoppingBag, Truck, Tag, ClipboardList, Minus, Plus, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import {
  useGetCart,
  useRemoveCartItem,
  useUpdateCartItem,
  useGetMe,
  getGetCartQueryKey,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/shipping-data";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

type Panel = "items" | "shipping" | "discount" | "notes";

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: cart } = useGetCart({
    query: { queryKey: getGetCartQueryKey(), enabled: !!user },
  });
  const removeMutation = useRemoveCartItem();
  const updateMutation = useUpdateCartItem();

  const [activePanel, setActivePanel] = useState<Panel>("items");
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [selectedState, setSelectedState] = useState("");
  const [shippingResult, setShippingResult] = useState<null | { free: boolean; standard: number; express: number }>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  const handleRemove = (id: number) => {
    removeMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        },
      }
    );
  };

  const handleQuantityChange = (id: number, newQty: number) => {
    if (newQty < 1) {
      handleRemove(id);
      return;
    }
    updateMutation.mutate(
      { id, data: { quantity: newQty } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        },
      }
    );
  };

  const subtotal = cart?.reduce((sum, item) => {
    const price = parseFloat(String(item.product?.price ?? "0").replace(/[^0-9.]/g, ""));
    return sum + price * (item.quantity ?? 1);
  }, 0) ?? 0;

  const discountAmount = discountApplied ? subtotal * 0.10 : 0;
  const discountedSubtotal = subtotal - discountAmount;

  const countryData = COUNTRIES.find((c) => c.name === selectedCountry);
  const states = countryData?.states ?? [];

  const handleCalculateShipping = () => {
    const isFree = discountedSubtotal >= 500;
    setShippingResult({
      free: isFree,
      standard: isFree ? 0 : 35,
      express: isFree ? 0 : 65,
    });
  };

  const togglePanel = (panel: Panel) => {
    setActivePanel((prev) => (prev === panel ? "items" : panel));
  };

  const itemCount = cart?.reduce((s, i) => s + (i.quantity ?? 1), 0) ?? 0;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-[95] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="font-serif text-xl">Shopping Bag</span>
            {cart && cart.length > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!user ? (
            <div className="text-center py-16 px-6">
              <ShoppingBag size={40} strokeWidth={1} className="mx-auto mb-4 text-muted-foreground" />
              <p className="font-serif text-lg mb-2">Sign in to view your bag</p>
              <p className="text-sm text-muted-foreground mb-6">
                Your cart will be saved and accessible across devices.
              </p>
              <Link href="/login" onClick={onClose}>
                <Button className="rounded-none bg-primary text-white uppercase tracking-widest text-xs h-11 px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : !cart || cart.length === 0 ? (
            <div className="text-center py-16 px-6">
              <ShoppingBag size={40} strokeWidth={1} className="mx-auto mb-4 text-muted-foreground" />
              <p className="font-serif text-lg mb-2">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Add pieces to your shopping bag to see them here.
              </p>
              <Button
                onClick={onClose}
                className="rounded-none bg-primary text-white uppercase tracking-widest text-xs h-11 px-8"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="p-6 space-y-5">
                {cart.map((item) => {
                  const unitPrice = parseFloat(String(item.product?.price ?? "0").replace(/[^0-9.]/g, ""));
                  const lineTotal = unitPrice * (item.quantity ?? 1);
                  return (
                    <div key={item.id} className="flex gap-4 pb-5 border-b border-border last:border-0">
                      <div className="w-20 h-20 bg-muted/30 overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.imageUrl ?? ""}
                          alt={item.product?.name ?? "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-primary mb-0.5">
                          {item.product?.categoryName ?? "Jewelry"}
                        </p>
                        <p className="text-sm font-medium text-foreground leading-snug mb-2 line-clamp-2 pr-2">
                          {item.product?.name}
                        </p>
                        <div className="flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="flex items-center border border-border rounded-sm">
                            <button
                              onClick={() => handleQuantityChange(item.id, (item.quantity ?? 1) - 1)}
                              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors"
                              disabled={updateMutation.isPending || removeMutation.isPending}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity ?? 1}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, (item.quantity ?? 1) + 1)}
                              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors"
                              disabled={updateMutation.isPending}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-serif text-base text-foreground">
                              ${lineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              disabled={removeMutation.isPending}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-2 border border-border rounded-sm overflow-hidden">
                  <button
                    onClick={() => togglePanel("notes")}
                    className={`flex flex-col items-center gap-1.5 py-3 text-xs transition-colors ${
                      activePanel === "notes" ? "bg-primary text-white" : "bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <ClipboardList size={18} />
                    <span className="text-[10px] uppercase tracking-wider">Notes</span>
                  </button>
                  <button
                    onClick={() => togglePanel("shipping")}
                    className={`flex flex-col items-center gap-1.5 py-3 text-xs border-x border-border transition-colors ${
                      activePanel === "shipping" ? "bg-primary text-white" : "bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Truck size={18} />
                    <span className="text-[10px] uppercase tracking-wider">Shipping</span>
                  </button>
                  <button
                    onClick={() => togglePanel("discount")}
                    className={`flex flex-col items-center gap-1.5 py-3 text-xs transition-colors ${
                      activePanel === "discount" ? "bg-primary text-white" : "bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Tag size={18} />
                    <span className="text-[10px] uppercase tracking-wider">Discount</span>
                  </button>
                </div>
              </div>

              {/* Notes Panel */}
              {activePanel === "notes" && (
                <div className="px-6 pb-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Order Notes</p>
                  <textarea
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add special instructions for your order…"
                    className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary resize-none"
                  />
                  <Button
                    size="sm"
                    className="w-full rounded-none bg-foreground text-background uppercase tracking-widest text-xs h-9 hover:bg-foreground/80"
                    onClick={() => setActivePanel("items")}
                  >
                    Save Note
                  </Button>
                </div>
              )}

              {/* Shipping Panel */}
              {activePanel === "shipping" && (
                <div className="px-6 pb-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-2">
                    <Truck size={14} /> Estimate Shipping Rates
                  </p>

                  {/* Country */}
                  <div className="relative">
                    <label className="text-xs text-muted-foreground mb-1 block">Country / Region</label>
                    <div className="relative">
                      <select
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setSelectedState("");
                          setShippingResult(null);
                        }}
                        className="w-full appearance-none border border-border rounded-sm px-3 py-2.5 pr-8 text-sm bg-background focus:outline-none focus:border-primary"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* State */}
                  {states.length > 0 && (
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">State / Province</label>
                      <div className="relative">
                        <select
                          value={selectedState}
                          onChange={(e) => {
                            setSelectedState(e.target.value);
                            setShippingResult(null);
                          }}
                          className="w-full appearance-none border border-border rounded-sm px-3 py-2.5 pr-8 text-sm bg-background focus:outline-none focus:border-primary"
                        >
                          <option value="">Select state / province…</option>
                          {states.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleCalculateShipping}
                    className="w-full rounded-none bg-primary text-white uppercase tracking-widest text-xs h-10 hover:bg-primary/90"
                  >
                    Calculate Shipping
                  </Button>

                  {/* Result */}
                  {shippingResult && (
                    <div className="bg-primary/5 border border-primary/20 rounded-sm p-4 space-y-2">
                      {shippingResult.free ? (
                        <>
                          <p className="text-sm font-medium text-primary">
                            Complimentary shipping to {selectedCountry}!
                          </p>
                          <ul className="space-y-1 text-sm text-foreground">
                            <li className="flex justify-between">
                              <span>Standard Insured Shipping</span>
                              <span className="font-semibold text-primary">FREE</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Express Insured Shipping</span>
                              <span className="font-semibold text-primary">FREE</span>
                            </li>
                          </ul>
                          <p className="text-[10px] text-muted-foreground">
                            Orders over $500 receive complimentary insured shipping worldwide.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-foreground">
                            Shipping options for {selectedCountry}:
                          </p>
                          <ul className="space-y-1 text-sm text-foreground">
                            <li className="flex justify-between">
                              <span>Standard Insured Shipping</span>
                              <span className="font-semibold">${shippingResult.standard}.00</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Express Insured Shipping</span>
                              <span className="font-semibold">${shippingResult.express}.00</span>
                            </li>
                          </ul>
                          <p className="text-[10px] text-muted-foreground">
                            Add ${(500 - discountedSubtotal).toFixed(2)} more to qualify for free shipping.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Discount Panel */}
              {activePanel === "discount" && (
                <div className="px-6 pb-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Discount Code</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter code…"
                      className="flex-1 border border-border rounded-sm px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary uppercase"
                    />
                    <Button
                      onClick={() => {
                        if (discountCode === "IWD2026") {
                          setDiscountApplied(true);
                          setActivePanel("items");
                        }
                      }}
                      className="rounded-none bg-primary text-white uppercase tracking-widest text-xs h-10 px-4 hover:bg-primary/90"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountApplied && (
                    <p className="text-xs text-primary font-medium">✓ Code IWD2026 applied — 10% off your order</p>
                  )}
                  <p className="text-[10px] text-muted-foreground">Try code: IWD2026 for 10% off</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {user && cart && cart.length > 0 && (
          <div className="px-6 py-5 border-t border-border bg-background space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                <span>${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Discount (IWD2026 — 10%)</span>
                  <span>−${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1 border-t border-border">
                <span className="text-sm font-semibold uppercase tracking-widest">Total</span>
                <span className="font-serif text-xl">${discountedSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Tax included · {discountedSubtotal >= 500 ? "✓ Complimentary insured shipping applied" : `Shipping calculated at checkout`}
            </p>
            <Button className="w-full h-12 rounded-none bg-primary text-white uppercase tracking-widest text-xs hover:bg-primary/90">
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 rounded-none border-foreground text-foreground uppercase tracking-widest text-xs hover:bg-foreground hover:text-background"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
