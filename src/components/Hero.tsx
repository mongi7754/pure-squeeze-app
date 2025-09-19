import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-juices.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Fresh squeezed juices" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Pure Squeeze
            <span className="block bg-gradient-citrus bg-clip-text text-transparent">
              Fresh Juice
            </span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            100% natural, preservative-free juices delivered fresh to your door. 
            From vibrant oranges to nutrient-packed greens - pure wellness in every sip.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="hero" className="text-lg px-8 py-6">
              Shop Fresh Juices
            </Button>
            <Button size="lg" variant="citrus" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm">Natural</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm">Preservatives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24hr</div>
              <div className="text-sm">Fresh</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-accent/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
    </section>
  );
};