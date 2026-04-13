import { useQueryClient } from "@tanstack/react-query";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import {
  useGetCart,
  useRemoveCartItem,
  useGetMe,
  getGetCartQueryKey,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: cart } = useGetCart({
    query: { queryKey: getGetCartQueryKey(), enabled: !!user },
  });
  const removeMutation = useRemoveCartItem();

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

  const total = cart?.reduce((sum, item) => {
    const price = parseFloat(
      (item.product?.price ?? "$0").replace(/[^0-9.]/g, "")
    );
    return sum + price * (item.quantity ?? 1);
  }, 0) ?? 0;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-[95] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="font-serif text-xl">Shopping Bag</span>
            <span className="text-sm text-muted-foreground">
              ({cart?.length ?? 0} {cart?.length === 1 ? "item" : "items"})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!user ? (
            <div className="text-center py-16">
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
            <div className="text-center py-16">
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
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-6 border-b border-border last:border-0"
              >
                <div className="w-20 h-20 bg-muted/30 overflow-hidden flex-shrink-0">
                  <img
                    src={item.product?.imageUrl ?? ""}
                    alt={item.product?.name ?? "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-primary mb-1">
                    {item.product?.categoryName ?? "Jewelry"}
                  </p>
                  <p className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    Qty: {item.quantity}
                  </p>
                  <p className="font-serif text-base text-foreground">
                    ${item.product?.price ? Number(item.product.price.replace(/[^0-9.]/g, '')).toLocaleString() : '0'}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0"
                  disabled={removeMutation.isPending}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {user && cart && cart.length > 0 && (
          <div className="p-6 border-t border-border space-y-4 bg-background">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground uppercase tracking-widest">Subtotal</span>
              <span className="font-serif text-xl">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Complimentary insured shipping on orders over $500
            </p>
            <Button className="w-full h-12 rounded-none bg-primary text-white uppercase tracking-widest text-xs hover:bg-primary/90">
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 rounded-none border-foreground text-foreground uppercase tracking-widest text-xs hover:bg-foreground hover:text-background"
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
