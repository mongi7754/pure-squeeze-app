import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart } from "lucide-react";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description: string;
  tags?: string[];
  isPopular?: boolean;
}

export const ProductCard = ({ 
  name, 
  image, 
  price, 
  originalPrice, 
  description, 
  tags = [], 
  isPopular = false 
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-hover transition-all duration-300 hover:scale-[1.02]">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted">
        {isPopular && (
          <Badge className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground font-semibold">
            Popular
          </Badge>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white/90 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Heart className="h-4 w-4" />
        </Button>
        
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-secondary/20 text-secondary-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Product Info */}
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              KSh {price}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                KSh {originalPrice}
              </span>
            )}
          </div>
          
          <Button size="sm" variant="default" className="gap-1">
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};