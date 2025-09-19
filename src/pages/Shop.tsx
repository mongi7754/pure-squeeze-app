import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  size: string;
  image_url: string | null;
  tags: string[] | null;
  is_popular: boolean;
  is_available: boolean;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('is_popular', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = selectedSize === "all" || product.size === selectedSize;
    return matchesSearch && matchesSize;
  });

  const sizes = ["all", "1L", "2L", "3L", "4L", "5L"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Fresh Juice Shop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of fresh, preservative-free juices. All prices in KSH.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search juices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSize(size)}
              >
                {size === "all" ? "All Sizes" : size}
              </Button>
            ))}
          </div>
        </div>

        {/* Pricing Guide */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Pricing Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Badge variant="secondary">1L</Badge>
              <p className="text-sm text-muted-foreground mt-1">KSH 100</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary">2L</Badge>
              <p className="text-sm text-muted-foreground mt-1">KSH 400</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary">3L</Badge>
              <p className="text-sm text-muted-foreground mt-1">KSH 600</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary">4L</Badge>
              <p className="text-sm text-muted-foreground mt-1">KSH 800</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary">5L</Badge>
              <p className="text-sm text-muted-foreground mt-1">KSH 1,000</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={`${product.name} - ${product.size}`}
                image={product.image_url || "/placeholder.svg"}
                price={product.price}
                description={product.description || ""}
                tags={product.tags || []}
                isPopular={product.is_popular}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}