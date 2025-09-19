import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About Pure Squeeze
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted source for fresh, preservative-free juices delivered straight to your doorstep
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Pure Squeeze was born from a simple belief: everyone deserves access to fresh, 
              nutritious juices without compromise. We started in 2020 with a mission to 
              provide the freshest juices possible, free from preservatives and artificial additives.
            </p>
            <p className="text-muted-foreground mb-4">
              Our journey began when our founder realized how difficult it was to find 
              truly fresh juice in Nairobi. Most options were either too processed or 
              too expensive. We decided to change that.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to serve thousands of customers across Nairobi with 
              our range of fresh, cold-pressed juices made from locally sourced fruits and vegetables.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-8">
            <img 
              src="/src/assets/hero-juices.jpg" 
              alt="Fresh juices being prepared" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">100% Natural</h3>
                <p className="text-muted-foreground">
                  No preservatives, no artificial colors, no added sugars. Just pure, natural goodness.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Fresh Delivery</h3>
                <p className="text-muted-foreground">
                  Made fresh daily and delivered within hours to ensure maximum nutritional value.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🇰🇪</span>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Local Sourcing</h3>
                <p className="text-muted-foreground">
                  Supporting local farmers by sourcing the freshest fruits and vegetables from Kenya.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quality Process */}
        <div className="bg-card rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-card-foreground mb-8">Our Quality Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Source</h4>
              <p className="text-sm text-muted-foreground">Fresh fruits sourced daily from trusted local farmers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Wash</h4>
              <p className="text-sm text-muted-foreground">Thoroughly cleaned and sanitized in our facility</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Extract</h4>
              <p className="text-sm text-muted-foreground">Cold-pressed to preserve maximum nutrients</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold text-card-foreground mb-2">Deliver</h4>
              <p className="text-sm text-muted-foreground">Fresh delivery within hours of production</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Try Pure Squeeze?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Experience the difference that fresh, natural juice can make in your life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}