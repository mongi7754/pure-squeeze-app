import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_name: string;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image_url, author_name, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Wellness & Nutrition Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest tips on healthy living, nutrition facts, and the benefits of fresh juices
          </p>
        </div>

        {/* Featured Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <Badge variant="secondary">Health Tips</Badge>
          <Badge variant="secondary">Nutrition</Badge>
          <Badge variant="secondary">Detox</Badge>
          <Badge variant="secondary">Weight Loss</Badge>
          <Badge variant="secondary">Recipes</Badge>
          <Badge variant="secondary">Wellness</Badge>
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                    {post.featured_image_url ? (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <span className="text-4xl">📝</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{post.author_name}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt || 'Read this interesting article about health and wellness...'}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts available at the moment.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-card rounded-lg p-8 mt-16 text-center">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">
            Stay Updated with Our Latest Articles
          </h2>
          <p className="text-muted-foreground mb-6">
            Get weekly wellness tips and nutrition advice delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </main>
    </div>
  );
}