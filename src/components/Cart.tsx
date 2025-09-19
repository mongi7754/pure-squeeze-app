import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const Cart = ({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryType: "delivery"
  });

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!checkoutData.name || !checkoutData.email || !checkoutData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (checkoutData.deliveryType === "delivery" && !checkoutData.address) {
      toast({
        title: "Missing address",
        description: "Please provide a delivery address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: checkoutData.name,
          customer_email: checkoutData.email,
          customer_phone: checkoutData.phone,
          delivery_address: checkoutData.deliveryType === "delivery" ? checkoutData.address : null,
          delivery_type: checkoutData.deliveryType,
          total_amount: total,
          status: 'pending',
          payment_method: 'mpesa'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initiate M-Pesa payment
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          phone: checkoutData.phone,
          amount: total,
          orderId: orderData.id,
          accountReference: `ORDER-${orderData.id.slice(0, 8)}`,
          transactionDesc: `Pure Squeeze Order - ${itemCount} items`
        }
      });

      if (paymentError) throw paymentError;

      if (paymentData.success) {
        toast({
          title: "Payment initiated!",
          description: "Please check your phone for the M-Pesa prompt.",
        });

        // Clear cart and close dialogs
        onClearCart();
        setIsCheckingOut(false);
        setIsOpen(false);
        
        // Reset checkout form
        setCheckoutData({
          name: "",
          email: "",
          phone: "",
          address: "",
          deliveryType: "delivery"
        });
      } else {
        throw new Error(paymentData.error || 'Payment failed');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Cart
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
        </DialogHeader>

        {!isCheckingOut ? (
          // Cart Items View
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-card-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">KSH {item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRemoveItem(item.id)}
                            className="ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total: KSH {total}</span>
                    <Button variant="outline" onClick={onClearCart}>
                      Clear Cart
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setIsCheckingOut(true)} 
                    className="w-full"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          // Checkout Form View
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Checkout</h3>
              <Button variant="ghost" onClick={() => setIsCheckingOut(false)}>
                Back to Cart
              </Button>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={checkoutData.name}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={checkoutData.email}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (M-Pesa) *</Label>
                <Input
                  id="phone"
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g., 0715551324"
                />
              </div>

              <div>
                <Label>Delivery Option *</Label>
                <RadioGroup
                  value={checkoutData.deliveryType}
                  onValueChange={(value) => setCheckoutData(prev => ({ ...prev, deliveryType: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Home Delivery (KSH 200)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Store Pickup (Free)</Label>
                  </div>
                </RadioGroup>
              </div>

              {checkoutData.deliveryType === "delivery" && (
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={checkoutData.address}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>KSH {total}</span>
                </div>
                {checkoutData.deliveryType === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>KSH 200</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>KSH {total + (checkoutData.deliveryType === "delivery" ? 200 : 0)}</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay with M-Pesa"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};