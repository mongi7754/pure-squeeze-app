import { ProductCard } from "./ProductCard";
import orangeJuice from "@/assets/orange-juice.jpg";
import greenJuice from "@/assets/green-juice.jpg";
import pineappleJuice from "@/assets/pineapple-juice.jpg";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description: string;
  tags: string[];
  isPopular?: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Fresh Orange Juice",
    image: orangeJuice,
    price: 100,
    description: "Pure Valencia oranges squeezed to perfection. Rich in Vitamin C and natural sweetness.",
    tags: ["Vitamin C", "Natural", "1L"],
    isPopular: true
  },
  {
    id: "2", 
    name: "Green Power Detox",
    image: greenJuice,
    price: 120,
    description: "Spinach, kale, cucumber and apple blend. Perfect for your daily green nutrition boost.",
    tags: ["Detox", "Vegan", "1L"],
    isPopular: true
  },
  {
    id: "3",
    name: "Tropical Pineapple",
    image: pineappleJuice,
    price: 110,
    originalPrice: 130,
    description: "Sweet tropical pineapple juice packed with enzymes and tropical flavor.",
    tags: ["Tropical", "Enzymes", "1L"]
  },
  {
    id: "4",
    name: "Fresh Orange Juice - 2L",
    image: orangeJuice,
    price: 400,
    description: "Family size Valencia orange juice. Perfect for sharing the citrus goodness.",
    tags: ["Vitamin C", "Family Size", "2L"]
  },
  {
    id: "5",
    name: "Green Power Detox - 3L",
    image: greenJuice,
    price: 600,
    description: "Large size green detox blend. Great for meal prep and weekly health goals.",
    tags: ["Detox", "Vegan", "3L"]
  },
  {
    id: "6",
    name: "Premium Orange - 5L",
    image: orangeJuice,
    price: 1000,
    description: "Premium family pack Valencia orange juice. Best value for orange juice lovers.",
    tags: ["Premium", "Best Value", "5L"]
  }
];

export const ProductGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fresh Juice Selection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our range of 100% natural, preservative-free juices. 
            Available in multiple sizes to suit your lifestyle.
          </p>
        </div>
        
        {/* Price Guide */}
        <div className="bg-muted rounded-lg p-6 mb-12">
          <h3 className="text-lg font-semibold mb-4 text-center">Size & Pricing Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-background rounded-md p-3">
              <div className="text-sm text-muted-foreground">1 Litre</div>
              <div className="font-bold text-primary">KSh 100</div>
            </div>
            <div className="bg-background rounded-md p-3">
              <div className="text-sm text-muted-foreground">2 Litre</div>
              <div className="font-bold text-primary">KSh 400</div>
            </div>
            <div className="bg-background rounded-md p-3">
              <div className="text-sm text-muted-foreground">3 Litre</div>
              <div className="font-bold text-primary">KSh 600</div>
            </div>
            <div className="bg-background rounded-md p-3">
              <div className="text-sm text-muted-foreground">4 Litre</div>
              <div className="font-bold text-primary">KSh 800</div>
            </div>
            <div className="bg-background rounded-md p-3">
              <div className="text-sm text-muted-foreground">5 Litre</div>
              <div className="font-bold text-primary">KSh 1000</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              originalPrice={product.originalPrice}
              description={product.description}
              tags={product.tags}
              isPopular={product.isPopular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};