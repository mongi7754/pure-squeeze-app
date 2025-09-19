import { Leaf, Shield, Truck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "No artificial preservatives, colors, or flavors. Just pure, natural ingredients."
  },
  {
    icon: Shield, 
    title: "Quality Assured",
    description: "Each batch tested for purity and freshness. Premium quality guaranteed."
  },
  {
    icon: Truck,
    title: "Fresh Delivery",
    description: "Same-day delivery available. Cold-chain maintained for maximum freshness."
  },
  {
    icon: Clock,
    title: "24hr Fresh",
    description: "Juices made fresh within 24 hours of delivery. Maximum nutrition retained."
  }
];

export const Features = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Pure Squeeze?
          </h2>
          <p className="text-lg text-muted-foreground">
            Quality and freshness you can trust in every bottle
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-background border-border/50 hover:shadow-card transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-fresh mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};