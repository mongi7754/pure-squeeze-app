import { ShoppingCart, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-fresh">
            <span className="text-lg font-bold text-white">🥤</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">Pure Squeeze</span>
            <span className="text-xs text-muted-foreground">Fresh Juice</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Shop
          </a>
          <a href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            About
          </a>
          <a href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Blog
          </a>
          <a href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Account */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>

          {/* Cart */}
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground"
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};