-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  size TEXT NOT NULL, -- '1L', '2L', '3L', '4L', '5L'
  image_url TEXT,
  tags TEXT[],
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT,
  delivery_type TEXT NOT NULL DEFAULT 'delivery', -- 'delivery' or 'pickup'
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'delivered', 'cancelled'
  payment_method TEXT DEFAULT 'mpesa',
  mpesa_checkout_request_id TEXT,
  mpesa_receipt_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author_name TEXT NOT NULL DEFAULT 'Pure Squeeze Team',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage products" 
ON public.products 
FOR ALL 
USING (false);

-- Create policies for orders (users can view their own orders)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Orders can be updated for payment processing" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Create policies for order_items
CREATE POLICY "Order items are viewable with orders" 
ON public.order_items 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

-- Create policies for blog_posts (public read for published posts)
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

-- Create policies for contact_messages
CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, size, image_url, tags, is_popular) VALUES
('Orange Juice', 'Fresh squeezed orange juice packed with vitamin C', 100.00, '1L', '/src/assets/orange-juice.jpg', ARRAY['Citrus', 'Vitamin C', 'Fresh'], true),
('Orange Juice', 'Fresh squeezed orange juice packed with vitamin C', 400.00, '2L', '/src/assets/orange-juice.jpg', ARRAY['Citrus', 'Vitamin C', 'Fresh'], false),
('Orange Juice', 'Fresh squeezed orange juice packed with vitamin C', 600.00, '3L', '/src/assets/orange-juice.jpg', ARRAY['Citrus', 'Vitamin C', 'Fresh'], false),
('Orange Juice', 'Fresh squeezed orange juice packed with vitamin C', 800.00, '4L', '/src/assets/orange-juice.jpg', ARRAY['Citrus', 'Vitamin C', 'Fresh'], false),
('Orange Juice', 'Fresh squeezed orange juice packed with vitamin C', 1000.00, '5L', '/src/assets/orange-juice.jpg', ARRAY['Citrus', 'Vitamin C', 'Fresh'], false),

('Green Detox Juice', 'Healthy green blend with spinach, cucumber, and apple', 100.00, '1L', '/src/assets/green-juice.jpg', ARRAY['Detox', 'Healthy', 'Vegan'], true),
('Green Detox Juice', 'Healthy green blend with spinach, cucumber, and apple', 400.00, '2L', '/src/assets/green-juice.jpg', ARRAY['Detox', 'Healthy', 'Vegan'], false),
('Green Detox Juice', 'Healthy green blend with spinach, cucumber, and apple', 600.00, '3L', '/src/assets/green-juice.jpg', ARRAY['Detox', 'Healthy', 'Vegan'], false),
('Green Detox Juice', 'Healthy green blend with spinach, cucumber, and apple', 800.00, '4L', '/src/assets/green-juice.jpg', ARRAY['Detox', 'Healthy', 'Vegan'], false),
('Green Detox Juice', 'Healthy green blend with spinach, cucumber, and apple', 1000.00, '5L', '/src/assets/green-juice.jpg', ARRAY['Detox', 'Healthy', 'Vegan'], false),

('Pineapple Juice', 'Tropical pineapple juice rich in enzymes', 100.00, '1L', '/src/assets/pineapple-juice.jpg', ARRAY['Tropical', 'Enzymes', 'Sweet'], false),
('Pineapple Juice', 'Tropical pineapple juice rich in enzymes', 400.00, '2L', '/src/assets/pineapple-juice.jpg', ARRAY['Tropical', 'Enzymes', 'Sweet'], false),
('Pineapple Juice', 'Tropical pineapple juice rich in enzymes', 600.00, '3L', '/src/assets/pineapple-juice.jpg', ARRAY['Tropical', 'Enzymes', 'Sweet'], false),
('Pineapple Juice', 'Tropical pineapple juice rich in enzymes', 800.00, '4L', '/src/assets/pineapple-juice.jpg', ARRAY['Tropical', 'Enzymes', 'Sweet'], false),
('Pineapple Juice', 'Tropical pineapple juice rich in enzymes', 1000.00, '5L', '/src/assets/pineapple-juice.jpg', ARRAY['Tropical', 'Enzymes', 'Sweet'], false),

('Watermelon Juice', 'Refreshing watermelon juice perfect for hydration', 100.00, '1L', '/src/assets/watermelon-juice.jpg', ARRAY['Refreshing', 'Hydrating', 'Summer'], true),
('Watermelon Juice', 'Refreshing watermelon juice perfect for hydration', 400.00, '2L', '/src/assets/watermelon-juice.jpg', ARRAY['Refreshing', 'Hydrating', 'Summer'], false),
('Watermelon Juice', 'Refreshing watermelon juice perfect for hydration', 600.00, '3L', '/src/assets/watermelon-juice.jpg', ARRAY['Refreshing', 'Hydrating', 'Summer'], false),
('Watermelon Juice', 'Refreshing watermelon juice perfect for hydration', 800.00, '4L', '/src/assets/watermelon-juice.jpg', ARRAY['Refreshing', 'Hydrating', 'Summer'], false),
('Watermelon Juice', 'Refreshing watermelon juice perfect for hydration', 1000.00, '5L', '/src/assets/watermelon-juice.jpg', ARRAY['Refreshing', 'Hydrating', 'Summer'], false);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, content, excerpt, is_published) VALUES
('Top 5 Health Benefits of Fresh Juice', 'health-benefits-fresh-juice', 'Fresh juices are packed with essential vitamins and minerals that your body needs...', 'Discover the amazing health benefits of drinking fresh juice daily.', true),
('Best Detox Juices for Weight Loss', 'best-detox-juices-weight-loss', 'If you''re looking to lose weight naturally, detox juices can be your best friend...', 'Learn about the most effective detox juices for healthy weight loss.', true),
('How to Store Fresh Juice Properly', 'how-to-store-fresh-juice', 'Proper storage is key to maintaining the nutritional value and taste of fresh juice...', 'Tips and tricks for storing your fresh juice to maintain quality.', true);