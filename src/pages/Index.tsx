import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <ProductGrid />
      </main>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-fresh">
                  <span className="text-sm font-bold text-white">🥤</span>
                </div>
                <span className="font-bold text-background">Pure Squeeze</span>
              </div>
              <p className="text-background/80 text-sm">
                Fresh, natural juices delivered to your door. 100% preservative-free.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-background">Quick Links</h3>
              <ul className="space-y-2 text-sm text-background/80">
                <li><a href="/shop" className="hover:text-background transition-colors">Shop</a></li>
                <li><a href="/about" className="hover:text-background transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-background transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-background transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-background">Customer Care</h3>
              <ul className="space-y-2 text-sm text-background/80">
                <li><a href="/faq" className="hover:text-background transition-colors">FAQ</a></li>
                <li><a href="/delivery" className="hover:text-background transition-colors">Delivery Info</a></li>
                <li><a href="/returns" className="hover:text-background transition-colors">Returns</a></li>
                <li><a href="/support" className="hover:text-background transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-background">Contact</h3>
              <ul className="space-y-2 text-sm text-background/80">
                <li>📞 +254 700 123 456</li>
                <li>📧 hello@puresqueeze.co.ke</li>
                <li>📍 Nairobi, Kenya</li>
                <li>🕒 Mon-Sat: 7AM-7PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center">
            <p className="text-background/60 text-sm">
              © 2024 Pure Squeeze Fresh Juice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
